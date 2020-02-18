# Applications

_Applications_ are the system's way to handle software.

**NOTE :** This document is only an *introduction* to how applications work.

## How applications work

An application is a set of executable files and resources. They are the only way to execute code, as direct binary programs are not supported.

Any user can install applications, which will only be available from his account.
Administrator users can install global applications, which are available to every user.

## Installation methods

Applications are installed through an _application package_ via [Skyer](../applications/Skyer.md), the applications manager. There are several installation methods:

* From the store
* Directly from the application's package
* As a volatile application

### From the store

Applications can be downloaded from NightOS' official applications store (available via [*Stellar*](../applications/Stellar.md)).

- For closed-source applications, the store only provides [_pre-compiled programs_](../technical/pre-compiling.md)
- For open-source applications, the store provides both pre-built programs as well as the source code

For the latter, user can choose either to build the program from source, using the appropriated build tools in order to optimize performances, or to simply use the pre-built programs (which is the option by default).

### Volatile applications

Applications can be also be ran as _volatile applications_, which means they are not installed on the disk. There are three methods:

* *Full-volatile*: the app's data are removed when the application closes
* *Session-scoped*: the app's data are stored on disk until the system shuts down
* *Local-persistent*: the app's data are stored within a data file located in the same folder
* *Persistent*: the app's data are stored in a dedicated folder, also enabling common data between users

By default, volatile applications are ran in *local-persistent* mode. In this mode, the system first checks if a file with the same name as the application's package but with the *.vad* (Volatile Application's Data) exists. If so, it opens this file as the application's storage. Then, when the application wants to store some data, it is stored inside this data file.

Note that VAD files are disguised [VSF](../filesystem/file-formats.md) files.

Volatile applications running as persistent do not appear in the applications list and can only be managed through a specific option in the *Control Center*. Their executable files are not stored anywhere and stay in the application's package, while only their data are stored on the disk. This allows to run the same application several times without losing any data and without worrying about a data file. This also allows to store common data between users.

Note that the store has an option for installing applications as volatile.

## Permissions

See the [permissions document](../features/permissions.md).

## Name and slug

Each application has a name as well as a slug. The name can any valid UTF-8 string, while the slug must respect several rules:

* Only lowercase letters, underscores and digits
* Must not start by a digit
* Must not be the name of a native shell command
* Must not be the name of a native shell function
* Must not be the name of a shell type

By default, the slug is auto-generated from the name, but it can also be customized.

From the slug is generated the _Application's IDentifier_ (AID), which is prefixed by the developer's identifier (DID) which is specified in the application's manifest (must match the publisher's identifier on the store). The DID is submitted to the same rules as the application's slug.

For instance, an application with a slug of `utils` made by a developer whose DID is `superdev` will get an AID of `utils.superdev`.

## Commands

Application can expose [shell commands](../technical/shell.md). Multiple commands can be exposed without any risk of clashing as the command name must be prefixed by the AID first.

For instance, if an application with AID `superdev.utils` exposes an `get_time` command, the final usable command will be `:superdev.utils.get_time`.

This is quite a long name but allows to prevent any clashing between commands. It's common for shell scripts to define aliases at the beginning of the script to refer more easily to applications' commands.
