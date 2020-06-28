# Applications

_Applications_ are the system's way to handle software.

**NOTE :** This document is only an _introduction_ to how applications work.

## How applications work

An application is a set of executable files and resources. They are the only way to execute code, as direct binary programs are not supported.

Any user can install applications, which will only be available from his account.
Administrator users can install global applications, which are available to every user.

## Installation methods

Applications are installed through an [_application package_](../specs/applications/package.md) via [Skyer](../applications/Skyer.md), the applications manager. There are several installation methods:

- From the store
- Directly from the application's package ([_sideloading_](#sideloading))
- As a volatile application

### From the store

Applications can be downloaded from NightOS' official applications store (available via [_Stellar_](../applications/Stellar.md)).

- For closed-source applications, the store only provides [_pre-compiled programs_](../technical/pre-compiling.md)
- For open-source applications, the store provides both pre-built programs as well as the source code

For the latter, user can choose either to build the program from source, using the appropriated build tools in order to optimize performances, or to simply use the pre-built programs (which is the option by default).

### Sideloading

Applications sideloading (installing an application directly from its [package](../specs/applications/package.md)) follows strict rules determined by the _sideloading mode_, which is either "disabled", "secure" or "unsecure".

**Disable mode** prevents all sideloading ; it's not possible to install applications from their package in this mode. [Volatile applications](#volatile-applications) can stil be run, though.

**Secure mode** allows sideloading but will first make the system check if the application's [AID](#application-identifier) matches an existing application on the Store. If so, it compares the application's signature to the Store application's one. If they don't match, the application is considered malicious and won't be installed.  
Note that this mode only works while connected to internet, as the system needs to check the Store to ensure the application is not malicious. If the computer is offline, sideloading will be disabled.

**Unsecure mode** allows sideloading without any checking, which is highly dangerous as it allows spoofing.

The sideloading mode can be changed in the [control center](../applications/Central.md).

### Volatile applications

Applications can be also be ran as _volatile applications_, which means they are not installed on the disk. There are three methods:

- _Full-volatile_: the app's data are removed when the application closes
- _Session-scoped_: the app's data are stored on disk until the system shuts down
- _Local-persistent_: the app's data are stored within a data file located in the same folder
- _Persistent_: the app's data are stored in a dedicated folder, also enabling common data between users

By default, volatile applications are ran in _local-persistent_ mode. In this mode, the system first checks if a file with the same name as the application's package but with the _.vad_ (Volatile Application's Data) exists. If so, it opens this file as the application's storage. Then, when the application wants to store some data, it is stored inside this data file.

Note that VAD files are disguised [VST](../technical/file-formats.md#virtual-storages) files.

Volatile applications running as persistent do not appear in the applications list and can only be managed through a specific option in the _Control Center_. Their executable files are not stored anywhere and stay in the application's package, while only their data are stored on the disk. This allows to run the same application several times without losing any data and without worrying about a data file. This also allows to store common data between users.

Note that the store has an option for installing applications as volatile.

## Permissions

See the [permissions document](../features/permissions.md).

## Name and slug

Each application has a name as well as a slug. The name can any valid UTF-8 string, while the slug must respect several rules:

- Only lowercase letters, underscores and digits
- Must not start by a digit
- Must not be the name of a native shell command
- Must not be the name of a native shell function
- Must not be the name of a shell type

By default, the slug is auto-generated from the name, but it can also be customized.

## Application Identifier

From the slug is generated the _Application's IDentifier_ (AID), which is prefixed by the developer's identifier (DID) specified in the application's manifest (it must match the publisher's identifier on the store), and followed by two double points. The DID is submitted to the same rules as the application's slug.

For instance, an application with a slug of `utils` made by a developer whose DID is `superdev` will get an AID of `utils::superdev`.

The AID is unique across the store as well as in a single NightOS installation. As malicious application may provide the DID and the slug of a legit application (which is called _AID spoofing_), sideloading is [verified by default](#sideloading).

As AID are text-based and can be quite long (up to 512 bytes), programs can instead use the _Application's Numeric IDentifier_ (ANID), which is a 32-bit unique number randomly generated by the system to refer to this particular application. On two different systems, the ANID of a given application will likely be very different, and so cannot be guessed. It is provided by the system during the application's launch through the [context](#application-context).

## Application Context

When an application starts, it can retrieve its _context_, which are data indicating the execution context of the application.
Detailed informations can be found in the related [specifications document](../specs/applications/context.md).

## Commands

Application can expose [shell commands](../technical/shell.md). Multiple commands can be exposed without any risk of clashing as the command name must be prefixed by the AID first.

For instance, if an application with AID `superdev.utils` exposes an `get_time` command, the final usable command will be `:superdev.utils.get_time`.

This is quite a long name but allows to prevent any clashing between commands. It's common for shell scripts to use imports at the beginning of the script to refer more easily to applications' commands.

Commands work by launching the application with a specific [context](#application-context).

## System applications

Some [native applications](../applications/) are part of the system itself and are called _system applications_ as such. They get a few specific features:

- Access to system-reserved features
- Ability to create [system services](#services)
- They cannot be uninstalled

System applications cannot be removed in any way, as some of them are critical for the system to function properly.  
Native applications which are _not_ system applications can be removed, though.

## Services

Application can provide a [service](../technical/services.md) by specifying it in their [manifest](../specs/applications/manifest.md).
The service will be run at startup with the usual application's permissions.

When an application uses a service, there is exactly one service process running per active user.
