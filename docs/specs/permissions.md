# Permissions

Permissions are used to [control what applications can do or not](../features/permissions.md). They have no effect by themselves, but allow different [system services](services/system/README.md) to ensure an application has enough permissions to perform a specific action.

**WARNING:** This document is **far from being complete**, and as such may be edited in any way at any moment.

## Levels of permissions

Permissions are split across five different levels:

- Level 1: non-sensitive permission like creating a window ; these are granted automatically by defualt
- Level 2: accessing and modifying non-critical parts of the state of the system, like controlling the global volume
- Level 3: performing sensitive actions, like reading files or accessing the network
- Level 4: performing highly-sensitive actions, like accessing the microphone or the webcam

There are also [domain-controlled permissions](../features/domains.md) as well as [application proxies](../technical/dev-mode.md#application-proxies) which influence how permissions are granted.

When using visual applications, requesting interactive, sensitive and privacy permissions will show a popup asking the user if they want to grant the permission:

- Only one time
- For the active application (until it stops)
- For the current session (until the user logs out or the system is shutdown)
- Forever

By default, it is set to "forever". But for the privacy level, this choice is set by default to "forever while the application is active", which prevents the application from accessing them from background tasks.

_NOTE:_ If the application is uninstalled and re-installed later, all the granted permissions will have been dropped, so confirmation will be required again.

_NOTE:_ Permissions granted to volatile applications are saved using the application's hash, so while the exact same application is opened volatilely, permissions are kept in memory.

_NOTE:_ Permissions are specific to the current user (the AUC is not taken in account here), so in the case of a global application, each user will have to approve the permission manually (unless the administrator set it otherwise).

## User privileges

Some permissions require the user to be an [administrator](../concepts/users.md#user-permissions-level). These permissions are marked in this document with an `{A}`.

## List of permissions

Below is the exhaustive list of all available permissions, with their level between parenthesis (e.g. `(5)` for level 5, etc.).

Many permissions require to have an associated _scope_, indicating the resources they can access. Each scope is a path or filesystem with a set of permissions that apply on this specific path/filesystem.

### Devices

**Scope:** list of [device patterns](services/system/hw.md#patterns) the permission applies on

- (4) `devices.enum`: enumerate devices
- (4) `devices.subscribe`: subscribe to devices
- (4) `devices.register_driver`: register a device driver
- (4) `devices.ask_driver`: ask a device's driver to perform a [normalized method](services/system/hw.md#normalization)

For praticity purpose, the list of device patterns is converted to a human-readable format, with more or less informations depending on the [user's complexity level](../concepts/users.md#complexity-level).

### Filesystems

**Scope**: filesystems the permission applies on

- (2) `fs.filesystems.mounted`: check if a given filesystem is mounted (all other `fs.filesystems.*` permissions imply this one)
- (3) `fs.filesystems.metadata`: get metadata on a given filesystem
- (3) `fs.filesystems.list`: enumerate mounted filesystems
- (3) `fs.filesystems.mount`: mount an existing filesystem
- (3) `fs.filesystems.unmount`: unmount filesystems mounted by other applications
- (3) `fs.filesystems.watch`: be notified when a filesystem is mounted / unmounted
- (3) `fs.filesystems.format`: format an existing filesystem

### Filesystem elements

**Scope**: [paths](services/integration/filesystem-interfaces.md#split-paths) the permission applies on

These permissions are automatically granted if their scope is one of the application's own data directories.

- (3) `fs.feid.path`: convert a given [FEID](filesystem.md#element-unique-identifier) to a [split path](services/integration/filesystem-interfaces.md#split-paths)
- (3) `fs.feid.exists`: check if a given [FEID](filesystem.md#element-unique-identifier) exists in a filesystem

- (3) `fs.path.canonicalize`: canonicalize a [split path](services/integration/filesystem-interfaces.md#split-paths)

- (3) `fs.items.exists`: check if an item exists at a given path
- (3) `fs.items.metadata`: get metadata on a given item
- (3) `fs.items.create`: create new filesystem elements
- (3) `fs.items.move`: rename and move existing filesystem elements
- (3) `fs.items.remove.trash`: send items to the current user's trash
- (3) `fs.items.remove`: delete items permanently
- (3) `fs.items.read`: read an existing filesystem element's content
- (3) `fs.items.write`: update an existing filesystem element's content

- (3) `fs.dir.read`: list items contained inside given directories
- (3) `fs.dir.read.hidden`: list hidden items in directories
- (3) `fs.dir.lock`: lock a full directory's content to prevent modifications from other processes
- (3) `fs.dir.lock.full`: lock a full directory's content to prevent modifications and access from other processes

- (3) `fs.symlinks.create`: create symbolic links
- (3) `fs.symlinks.update`: update existing symbolic links
- (3) `fs.symlinks.read`: read the target of a symbolic link

#### Flows

- (3) `flow.list`: list flows opened by all applications
- (3) `flow.metadata`: get metadata on flows
- (1) `flow.create`: create flows
- (3) `flow.read`: read from flows
- (3) `flow.write`: write to flows

### Network

- (3) `net.fetch`: fetch a resource  
  **Scope:** list of domains (wildcards supported for subdomains), list of protocols
- (3) `net.expose`: listen to a specific port or a range of ports
  **Scope:** range of ports (may cover a single port)

### User accounts

- (1) `users.current.level`: get the current user's [permission level](../concepts/users.md#user-permissions-level)
- (1) `users.current.name`: get the name of the current user account
- (1) `users.current.icon`: get the icon associated to the current user account
- (4) `users.current.photo`: get the (optional) photo associated to the current user account
- (3) `users.current.lastconn`: get the timestamp of the current user's last login

All these permissions have a variant to get informations about other user accounts (replace `current` with `all`). These have the same permission level but require the current user to be administrator.

### System

- (1) `system.clock.date.read`: get the current date
- (1) `system.clock.time.read`: get the current time
- (1) `system.clock.timezone.read`: get the current timezone
- (1) `system.clock.uptime`: get the system's uptime

- (1) `system.hw.cpu.count`: get the number of CPUs
- (1) `system.hw.cpu.list`: list CPUs (model, frequency, etc.)
- (1) `system.hw.mem.total`: get the amount of total memory
- (1) `system.hw.mem.available`: get the amount of available memory
- (1) `system.hw.mem.slots`: get the number of RAM slots
- (1) `system.hw.mem.list`: list RAM slots (model, frequency, etc.)

### Hardware interfaces

- (4) `hwmid.keyboard.write`: simulate key presses
- (5) `hwmid.keyboard.read`: read key presses from the keyboard
- (4) `hwmid.pointer.write`: simulate actions from pointer devices
- (5) `hwmid.pointer.read`: read actions from pointer devices
- (5) `hwmid.video.read`: access video input streams (cameras, ...)
- (5) `hwmid.audio.read`: access audio input streams (microphones, ...)
- (5) `hwmid.screen.read`: read portions of the screen as image buffers (screenshots, ...)
- (1) `hwmid.screen.read_self`: read portions of the current application's windows (screenshots, ...)

### State

- (1) `state.laptop.is`: check if the device is a laptop
- (1) `state.laptop.is_open`: check if the laptop is physically opened
- (1) `state.battery.has`: check if the device has a battery
- (1) `state.battery.level`: check the battery level
- (1) `state.battery.is_charging`: check if the battery is charging
- (1) `state.battery.is_full`: check if the battery is considered full
- (1) `state.battery.is_critical`: check if the battery is at a critically low level
- (1) `state.battery.estimated_remaining`: get the remaining running time estimated by the system in minutes

### Programs

- (5) + {A} `programs.running.processes`: get the list of all running processes
- (5) + {A} `programs.running.windows`: get informations on each running application's windows
- (5) `programs.running.apps`: get the list of running applications

### System-reserved permissions

These permissions are reserved to processes [marked as system](kernel/processes.md#process-attributes).

- `sysapp.process.kill`: suspend or kill external processes
- `sysapp.process.signal`: send a signal to an external process
