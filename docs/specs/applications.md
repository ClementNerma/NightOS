# Applications

This document describes application-specific structure and behaviour. For common reference, see the [applications and libraries](applications-libraries.md) document.

- [Application package](#application-package)
  - [Content](#content)
  - [Pre-compiled applications](#pre-compiled-applications)
  - [Libraries embedding](#libraries-embedding)
  - [Values encoding](#values-encoding)
  - [Returning and failing](#returning-and-failing)
  - [Volatile applications](#volatile-applications)
- [Application manifest](#application-manifest)
- [Commands](#commands)
  - [Example](#example)
- [Execution Context](#execution-context)
  - [Startup Reason](#startup-reason)
  - [Context header](#context-header)
  - [Arguments structure](#arguments-structure)

## Application package

Application packages are files that have either the `.nap` (NightOS Application Package) or `.nva` (NightOS Volatile Application).

### Content

NAP and NVA files are ZStandard archives which only requirement is to contain, at the archive's root, a `manifest.toml` file describing the archive itself, a `hash.md5` ensuring the archive has not been corrupted.

They are built around a _manifest_ which can be found [below](#application-manifest).

### Pre-compiled applications

By default, and if possible, the system will always try to install [pre-compiled programs](../technical/pre-compiling.md) from applications' package. If the pre-compiled programs are not available, it will be built from source code - which takes a lot more time.

### Libraries embedding

Although it's a better practice to split applications and libraries into different packages, sometimes it's more easy to embed both in the same package, especially in two cases:

- When the application is just a thin layer ahead of the library (e.g. CLI tool)
- When the library's API changes rapidly and the application relies on it

For such scenarios, it's possible for an application package to embed one or more libraries, and publish them all at once.

The application's and libraries' version may differ if required.

If an another application or a library specifies one of the embedded libraries as a dependency, only the said library will be installed, not the application.

### Values encoding

The application's startup arguments and output value use the following encoding:

- The return value's length (8 bytes) ;
- The value's [shell type](shell-scripting.md#value-types) code (see the table below) ;
- The encoded value (see the table below)

| Type code | Type      | Description                         | Representation                                                                             |
| --------- | --------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| `0x00`    | `void`    | Void                                | nothing                                                                                    |
| `0x01`    | `bool`    | Boolean                             | 1 byte, `0x00` = falsy, `0x01` = truthy                                                    |
| `0x02`    | `int`     | 64-bit signed integer number        | Two's complement                                                                           |
| `0x03`    | `float`   | 64-bit signed floating-point number | [IEEE 754](https://standards.ieee.org/standard/754-2019.html)                              |
| `0x04`    | `char`    | UTF-8 grapheme cluster              | Character's length (8 bytes), followed by the UTF-8 grapheme cluster                       |
| `0x05`    | `string`  | UTF-8 string                        | String's length (8 bytes), followed by the UTF-8 encoded string                            |
| `0x06`    | `list`    | Typed linear list                   | Type code of the list's number of items (1 byte), length in bytes (64 bits), encoded items |
| `0x07`    | `path`    | Filesystem path                     | Represented as an UTF-8 string                                                             |
| `0x08`    | `command` | Shell command                       | Represented as an UTF-8 string                                                             |
| `0x09`    | `stream`  | [Pipe RC](kernel/ipc.md#pipes)      | RC identifier (8 bytes)                                                                    |

The type code is present to avoid misinterpreting the value in case the command returned a value of the wrong type.

### Returning and failing

The value must be returned using the [CMDOUT](kernel/ipc.md#interactive-usage) pipe. The data sent through this pipe must follow the above [encoding](#values-encoding).

A command may also fail. To indicate so, the process must send the `0xFF` value through the pipe, and the shell will consider the command as failed (but not invalid, so the process won't be abruptly killed).

### Volatile applications

[Volatile applications](../concepts/applications.md#volatile-applications) cannot expose commands globally as they are technically not installed.  
They can though be used in shell scripts through [volatile imports](shell-scripting.md#volatile-imports).

## Application manifest

Here is the specifications of the application manifest, in additional to the [common manifest](applications-libraries.md#the-manifest):

```yaml
# [OPT] Event triggers
events:
  # [OPT] Should the application start just after being installed?
  postinstall: false
  # [OPT] Should the application start just before being uninstalled?
  preuninstall: false
  # [OPT] Should the application start just before being updated?
  preupdate: false
  # [OPT] Should the application start just after being updated?
  postupdate: false

# [OPT] Exposed commands (see the related document for additional informations)
commands: {}

# [OPT] Does the application expose services?
services:
  # [REQ] Does the application expose a main service?
  main: false
  # [REQ] List of scoped services
  scoped: []
  # [REQ] List of integration services
  integration:
    # [OPT] Desktop environment service
    desktop_env: false
    # [OPT] File manager service
    file_manager: false
    # [OPT] Filesystem opener service
    fs_items_opener: false
    # [OPT] Filesystem interface
    fs_interface: false
  # [REQ] List of driver services
  driver:
    # [OPT] Storage driver service
    storage: false

# [REQ] System features
sysfeatures:
  # [REQ] Does the application support crash saves?
  crash_saves_support: true

# [OPT] Additional informations
additional:
  # [OPT] Available languages (in a list of existing languages)
  languages: ["en-US"]
```

## Commands

Applications can expose commands through their [manifest](#application-manifest).

The format is the same as the [shell's command typing](shell-scripting.md#commands-typing), although adapted to YAML:

- The `pos` or `dash` indicator is turned into a (required) `syntax` option
- The `optional` indicator becomes a boolean that must be set to `true`
- The `void` type is forbidden

### Example

```yaml
# [...beginning of the manifest...]
commands:
  say_hello:
    help: "A program that repeats the name of a list of person"
    author: "Me <my@email>" # Optional
    license: "MIT" # Optional
    return: void
    args:
      # Declare a positional argument named 'names' with a help text
      names:
        syntax: pos
        type: list[string]
        help: "List of names to display"

      # Declare a dash argument named 'repeat'
      repeat:
        syntax: dash
        type: int
        short: r
        long: repeat
        optional: true

      # Return the time this command took to complete
      get-duration:
        syntax: flag
        short: d
        long: duration
        $if:
          cond: present()
          return: void
# [...end of the manifest...]
```

## Execution Context

An application's _execution context_ is a piece of data that is provided when the application starts.  
It indicates why the application was started and so what it is supposed to do.

### Startup Reason

The most important information is the _startup reason_, which indicates _why_ the application was started.

It is one-byte long, and is made of the following bits (starting from the strongest):

- Bits 0-3:
  - `0x1`: the application was started as part of its post-installation process
  - `0x2`: the application was started as part of its pre-update process
  - `0x3`: the application was started as part of its post-update process
  - `0x4`: the application was started as part of its pre-uninstallation process
  - `0x4`: the application was started by the system as an [application service](../concepts/applications.md#services)
  - `0x5`: the application was started by the desktop environment
  - `0x6`: the application was started by itself (from another process of the same application)
  - `0x7`: the application was started by another application
  - `0x8`: the application was started using one its exposed [shell commands](../concepts/applications.md#commands)
  - `0x9`: the application was started as a [desktop environment](../ux/desktop-environment.md)
- Bit 4: set if the application was started automatically after a crash/improver shutdown and should to the [`sys::crashsave`](services/system/crashsave.md) service to get a crashsave
- Bit 5: set if the application's raw output (CMDRAW) will be read (e.g. through the use of a [shell operator](shell-scripting.md#reading-a-commands-output))

The startup reason is especially important as it determines what the application should do (e.g. uninstall itself, run as a command...) but also if it should output data through its CMDRAW in case it was called by a command.

### Context header

The context header is stored as a single block of data, consisting of:

- The startup reason (1 byte)
- Ambiant informations (1 byte)
  - Bit 0: set if the application is starting for the very first time since it was installed
  - Bit 1: set if the application is starting for the very first time for this specific user
  - Bit 2: set if the application is starting for the very first time as this specific service
  - Bit 3: set if the application is starting for the first time after an update
  - Bit 4: set if other instances of this application are running
- Special assignment information (1 byte)
  - Bit 0: set if the application is starting for the first time after being assigned as the new desktop environment
  - Bit 1: set if the application is starting for the first time after being assigned as the new default file manager
- Service type (1 byte):
  - `0x00`: this process is not run as a service
  - `0x01`: this process is run as the application's main service
  - `0x02`: this process is run as an application's scoped service
  - `0x10`: this process is run as the application's [desktop environment service](services/integration/desktop-environments.md)
  - `0x11`: this process is run as the application's [file manager service](services/integration/file-managers.md)
  - `0x12`: this process is run as the application's [file opener service](services/integration/file-openers.md)
- Scoped service's name (8 bytes) - filled with zeroes if the process is not run as a scoped service
- The application's [ANID](applications-libraries.md#application-identifier) (4 bytes)

If the command was started as a command, it also contains the following informations:

- The ANID of the caller application (4 bytes)
- The number of arguments the process was started with (1 byte)
- The cumulated size of all arguments, in bytes - up to 63.5 KB (2 bytes)
- RC identifier for the CMDIN pipe (8 bytes)
- RC identifier for the CMDUSR pipe (8 bytes)
- SC identifier for the CMDMSG pipe (8 bytes)
- SC identifier for the CMDERR pipe (8 bytes)
- SC identifier for the CMDRAW pipe (8 bytes)
- SC identifier for the CMDOUT pipe (8 bytes)
- _Future-proof shift space_ (196 bytes)

RC and SC identifiers come from the relevant [flows](./filesystem.md#flows).

### Arguments structure

The context header is followed by the list of each command-line argument, taking up to 64 KB.

Arguments are a simple concatenation of [encoded values](#values-encoding).
