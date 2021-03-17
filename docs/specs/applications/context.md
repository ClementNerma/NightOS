# Execution Context

An application's _execution context_ is a piece of data that is provided when the application starts.  
It indicates why the application was started and so what it is supposed to do.

- [Startup Reason](#startup-reason)
- [Context header](#context-header)
- [Arguments structure](#arguments-structure)

## Startup Reason

The most important information is the _startup reason_, which indicates _why_ the application was started.

It is one-byte long, and is made of the following bits (starting from the strongest):

- Bits 0-3:
  - `0x1`: the application was started as part of its post-installation process
  - `0x2`: the application was started as part of its pre-update process
  - `0x3`: the application was started as part of its post-update process
  - `0x4`: the application was started as part of its pre-uninstallation process
  - `0x4`: the application was started by the system as an [application service](../../concepts/applications.md#services)
  - `0x5`: the application was started by the desktop environment
  - `0x6`: the application was started by itself (from another process of the same application)
  - `0x7`: the application was started by another application
  - `0x8`: the application was started using one its exposed [shell commands](../../concepts/applications.md#commands)
  - `0x9`: the application was started as a [desktop environment](../../ux/desktop-environment.md)
- Bit 4: set if the application was started automatically after a crash/improver shutdown and should to the [`sys::crashsave`](../system-services/crashsave.md) service to get a crashsave
- Bit 5: set if the application's raw output (CMDRAW) will be read (e.g. through the use of a [shell operator](../shell-scripting.md#reading-a-commands-output))

The startup reason is especially important as it determines what the application should do (e.g. uninstall itself, run as a command...) but also if it should output data through its CMDRAW in case it was called by a command.

## Context header

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
  - `0x10`: this process is run as the application's [desktop environment service](../integration-services/desktop-environments.md)
  - `0x11`: this process is run as the application's [file manager service](../integration-services/file-managers.md)
  - `0x12`: this process is run as the application's [filesystem opener service](../integration-services/filesystem-openers.md)
- Scoped service's name (8 bytes) - filled with zeroes if the process is not run as a scoped service
- The application's [ANID](../applications-libraries.md#application-identifier) (4 bytes)

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

## Arguments structure

The context header is followed by the list of each command-line argument, taking up to 64 KB.

Arguments are a simple concatenation of [encoded values](commands.md#values-encoding).
