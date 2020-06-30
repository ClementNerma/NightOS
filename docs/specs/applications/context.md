# Application Context

The _application context_ is a piece of data that is provided when the application starts.  
It indicates why the application was started and so what it is supposed to do.

## Execution Context

The most important information is the _execution context_, which indicates the reason the application was started.

It is one-byte long, and is made of the following bits (starting from the strongest):

- Bits 0-3: _execution purpose_
  - `0x1`: the application was started by the system as an [application service](../../concepts/applications.md#services)
  - `0x2`: the application was started by the desktop environment
  - `0x3`: the application was started by itself (from another process of the same application)
  - `0x4`: the application was started by another application
  - `0x5`: the application was started using one its exposed [shell commands](../../concepts/applications.md#commands)
- Bit 4: set if the application was started automatically after a crash/improver shutdown and should to the [`sys::crashsave`](../services/crashsave.md) service to get a crashsave
- Bit 5: set if the application's raw output (CMDRAW) will be read (e.g. through the use of a [shell operator](../shell-scripting.md#reading-a-commands-output))
- Bit 6: set if other instances of this application are running
- Bit 7: set if this application is starting for the very first time since it was installed

The execution context is especially important as it determines what the application should do (e.g. uninstall itself, run as a command...) but also if it should output data through its CMDRAW in case it was called by a command.

## Data structure

The context is stored as a single block of data, consisting of:

- The execution context (1 byte)
- The application's [ANID](../../concepts/applications.md#application-identifier) (4 bytes)

If the command was not started a command, the context ends here. Else, it also contains the following informations:

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
- The value of command-line arguments (up to 63.5 KB)

The context's size may so vary from 512 bytes to 64 KB.

## Arguments structure

Arguments are a simple concatenation of [encoded values](commands.md#values-encoding).
