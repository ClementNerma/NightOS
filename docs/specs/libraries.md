# Libraries

Libraries are NightOS' way to share code between multiple applications.

- [Manifest](#manifest)
- [The system library](#the-system-library)
  - [System library modules](#system-library-modules)
- [System applications' libraries](#system-applications-libraries)

## Manifest

As libaries are only meant to share code, there manifest is a lot simplier than [applications' manifest](applications.md#application-manifest) as it is only made of the [common fields](applications-libraries.md#the-manifest).

## The system library

The system provides a single _system library_ with the `sys::lib` [AID](applications-libraries.md#application-identifier), which is built in the system and not removable. Apart from these points, it acts like a standard library. Its version is identical to the system itself, allowing applications and libraries to specify a minimum system version in their dependencies field.

### System library modules

The library contains several _modules_ (called **SLM** for _**S**ystem **L**ibrary **M**odule_), which act like language namespaces to expose specific features:

- `fs` : Filesystem management
- `net` : Network communications
- `ipm` : Inter-process management (create processes, workers, IPC, shared memory, ...)
- `gui` : Graphical user interface library (relies on `desktop`)
- `apps` : Applications management (installation, removal, ...)
- `perm` : Permissions controller
- `hydre` : Shell interface (run commands, ...)
- `input` : Input interface (keyboard, mouse, microphone, ...)
- `sound` : Sound interface
- `system` : System interface (low-level changes, updates, ...)
- `sandbox` : Sandboxes management (run applications in sandboxes, ...)
- `desktop` : Desktop management (desktop, windows, notifications, ...)
- `hardware` : Hardware management (drivers and devices)

## System applications' libraries

Each [system application](../concepts/applications.md#system-applications) also exposes a library with the `sysl::<app name lowercased>` AID which applications can rely on, as these applications are not removable. These are abbreviated SAL for _**S**ystem **A**pplication **L**ibrary_.