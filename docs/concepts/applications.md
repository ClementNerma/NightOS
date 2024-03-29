# Applications

_Applications_ are the system's way to handle software.

**NOTE :** This document is only an _introduction_ to how applications work.

- [How applications work](#how-applications-work)
- [Installation methods](#installation-methods)
  - [From the store](#from-the-store)
  - [Sideloading](#sideloading)
  - [Volatile applications](#volatile-applications)
- [Permissions](#permissions)
- [Commands](#commands)
- [System applications](#system-applications)
- [Services](#services)

## How applications work

An application is a set of executable files and resources. They are the only way to execute code, as direct binary programs are not supported.

Any user can install applications, which will only be available from his account.
Administrator users can install global applications, which are available to every user.

## Installation methods

Applications are installed through an [_application package_](../specs/applications.md#application-package) via [Skyer](../applications/Skyer.md), the applications manager. There are several installation methods:

- From the store
- Directly from the application's package ([_sideloading_](#sideloading))
- As a volatile application

### From the store

Applications can be downloaded from NightOS' official applications store (available via [_Stellar_](../applications/Stellar.md)).

- For closed-source applications, the store only provides [_pre-compiled programs_](../technical/pre-compiling.md)
- For open-source applications, the store provides both pre-built programs as well as the source code

For the latter, user can choose either to build the program from source, using the appropriated build tools in order to optimize performances, or to simply use the pre-built programs (which is the option by default).

### Sideloading

Applications sideloading (installing an application directly from its [package](../specs/applications.md#application-package)) follows strict rules determined by the _sideloading mode_, which is either "disabled", "store-checking" or "unsecure".

**Disabled mode** prevents all sideloading ; it's not possible to install applications from their package in this mode. [Volatile applications](#volatile-applications) can stil be run.

**Store-checking mode** allows sideloading but will first make the system check if the application's [AID](../specs/applications-libraries.md#application-identifier) matches an existing application on the Store. If so, it compares the application's signature to the Store application's one. If they don't match, the application is considered malicious and won't be installed.  
Note that this mode only works while connected to internet, as the system needs to check the Store to ensure the application is not malicious. If the computer is offline, sideloading will be disabled.

**Unsecure mode** allows sideloading without any checking, which is highly dangerous as it allows spoofing.

The sideloading mode can be changed in the [control center](../applications/Central.md).

### Volatile applications

Applications can be also be ran as _volatile applications_, which means they are not installed on the disk. There are four different methods:

- **Fully volatile**: the app's data are removed when the application closes
- **Session-scoped**: the app's data are stored on disk until the system shuts down
- **Locally persistent**: the app's data are stored within a data file located in the same folder
- **Persistent**: the app's data are stored in a dedicated folder, also enabling common data between users

By default, volatile applications are ran in **locally persistent** mode. In this mode, the system first checks if a file with the same name as the application's package but with the _.vad_ (Volatile Application's Data) exists. If so, it opens this file as the application's storage. Then, when the application wants to store some data, it is stored inside this data file.

Note that VAD files are disguised [VSF](../technical/file-formats.md#virtual-storages) files.

Volatile applications running as persistent do not appear in the applications list and can only be managed through a specific option in the _Control Center_. Their executable files are not stored anywhere and stay in the application's package, while only their data are stored on the disk. This allows to run the same application several times without losing any data and without worrying about a data file. This also allows to store common data between users.

Note that the store has an option for installing applications as volatile.

## Permissions

Permissions allow to finely control what an application can do (or not). See the [permissions feature document](../features/permissions.md) for more details.

## Commands

Application can expose [shell commands](../technical/shell.md). Multiple commands can be exposed without any risk of clashing as the command name must be prefixed by the AID first.

For instance, if an application with AID `superdev.utils` exposes an `get_time` command, the final usable command will be `:superdev.utils.get_time`.

This is quite a long name but allows to prevent any clashing between commands. Shell scripts must use imports at the beginning to specify the commands they will use. This also allows to directly spot any missing application required for that script. For more informations on the shell language, check the related [specifications document](../specs/shell-scripting.md).

Note that, by default, shell prompts (not scripts) will allow to directly use commands such as `get_time` in the short form if no other application exposes a command with the same name, for convenience.

Commands work by launching the application with a specific [execution context](../specs/applications.md#execution-context).

## System applications

Some [native applications](../applications/README.md) are part of the system itself and are called _system applications_ as such. They get a few specific features:

- Access to system-reserved features
- Ability to create [system services](#services)
- They cannot be uninstalled

System applications cannot be removed in any way, as some of them are critical for the system to function properly.  
Native applications which are _not_ system applications can be removed, though.

These applications can be updated independently of the system itself, thus their version may differ from the system itself.

## Services

Application can provide [services](../technical/services.md) to run at startup. They must be specified in their [manifest](../specs/applications.md#application-manifest).

Services run at startup with the usual application's permissions, and services get one process per active user.
