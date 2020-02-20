# Libraries

_Libraries_ allow to share a program between multiple applications.

## How libraries work

Unlike applications, libraries can be installed in multiple versions. This means you can have three versions of the same library installed at the same time on your computer.

When an application wants to use a library, it explicitly indicates the list of versions it is compatible with. The system then gets the related version and provides it to the application.

A library by itself cannot do itself: no background process, no installation nor uninstallation script, no permission granting. Applications simply use libraries as helpers to achieve specific tasks.

For instance, the system library `fs` which is natively available allows to manipulate files and directories easily.

## Dependencies management and resolving

Each application indicates in its [manifest](../technical/applications/package.md#manifest) the list of libraries it requires.

When the application is installed, the system will also check if the required libaries are already installed, and with the matching versions. If this is not the case, the library will be downloaded and installed as well (even if it's a volatile application).

When an application is removed, the system looks for each of its dependencies. If the dependency is not used by any application anymore, it is removed by default.

## Commands exposing

Just like applications, libraries have a unique slug and an identifier equivalent to AID called LID (for _Library IDentifier_).
Commands are exposed the same way ; if a library's LID is `utils` and the DID is `superdev`, the exposed commands will be prefixed by `:utils.superdev`.

For more informations about this part, see how [applications expose commands](applications.md#commands).

## System libraries

The system provides several _system libraries_, which work are libraries that communicate with the system through signals to enable system-related and hardware-related features.
Note that's it's possible to use signals directly to deal with the system and the hardware, but it's a lot more complicated than just using these system libaries.

* `fs`        : Filesystem management
* `net`       : Network communications
* `ipm`       : Inter-process management (create processes, workers, IPC, shared memory, ...)
* `gui`       : Graphical user interface library (relies on `desktop`)
* `apps`      : Applications management
* `grid`      : Permissions controller
* `shell`     : Shell interface (run commands, ...)
* `input`     : Input interface (keyboard, mouse, microphone, ...)
* `sound`     : Sound interface
* `system`    : System interface (control panel, low-level changes, updates, ...)
* `sandbox`   : Sandboxes management (run applications in sandboxes, ...)
* `desktop`   : Desktop management (desktop, windows, notifications, ...)
* `hardware`  : Hardware management (drivers and devices)
* `reactive`  : Reactive (relies on `reactive`, includes Reactive Markup Language, ...)
* `sysver`    : Exposes the system version, its main purpose to indicate which system version is required for an application
