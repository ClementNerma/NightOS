# Permissions

Permissions are used to [control what applications can do or not](../features/permissions.md). They have no effect by themselves, but allow different [system services](services/README.md) to ensure an application has enough permissions to perform a specific action.

**WARNING:** This document is **far from being complete**, and as such may be edited in any way at any moment.

## Levels of permissions

Permissions are split across different categories:

- _Basic_ (B): basic permissions, like windows creation, which are granted automatically by default ;
- _Implicit_ (I): permissions implied by the usage of an application, like opening a file with an application grants it an access while the application is running ;
- _Global_ (G): accessing and modifying non-critical parts of the state of the system, like controlling the global volume or reading
- _Sensitive_ (S): accessing sensitive informations, like filesystem or network access ;
- _Privacy_ (P): accessing privacy-related data, like microphone or webcam access

There are also [domain-controlled permissions](../features/domains.md) as well as [application proxies](../technical/dev-mode.md#application-proxies)) which influence how permissions are granted.

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

Some permissions require the user to have specific privileges, such as being [administrator](../concepts/users.md#users-type). These permissions are marked in this document with an `{A}`.

## List of permissions

Below is the exhaustive list of all available permissions, with their category between parenthesis (e.g. `(P)` for _privacy_, etc.).

Note that many permissions have a _scope_, indicating what they can or cannot do. When an application requests a single permission, it must provide a scope that will eventually be shown to the end user.

### Devices

**Scope:** list of [device patterns](services/hw.md#patterns) the permission applies on

- (P) `devices.enum`: enumerate devices
- (P) `devices.subscribe`: subscribe to devices
- (P) `devices.register_driver`: register a device driver
- (P) `devices.ask_driver`: ask a device's driver to perform a [normalized method](services/hw.md#normalized-methods)

For praticity purpose, the list of device patterns is converted to a human-readable format, with more or less informations depending on the [user's complexity level](../concepts/users.md#complexity-level).

### Filesystem

**Scope**: paths the permission applies on

- (S) `fs.create.dir`: create directories
- (S) `fs.create.file`: create files
- (S) `fs.create.symlink`: create symlinks
- (S) `fs.create.symlink.scoped`: create symlinks whose target is in the application's available paths
- (S) `fs.create.flow`: create flows
- (S) `fs.remove.file_dir`: remove files and directories
- (S) `fs.remove.symlink`: remove symlinks
- (S) `fs.remove.flow`: remove flows
- (S) `fs.remove.self`: remove items created by the application itself
- (S) `fs.read.dir`: list all items inside directories
- (S) `fs.read.dir.hidden`: list hidden items in directories
- (S) `fs.read.symlink`: read from symlinks (= knowing the symlink's target)
- (S) `fs.read.symlink.scoped`: read from symlinks whose target is in the application's available paths (= knowing the symlink's target)
- (S) `fs.read.flow`: read from flows
- (S) `fs.write.file`: change files' content
- (S) `fs.write.symlink`: write to symlinks (= updating the symlink's target)
- (S) `fs.write.flow`: write to flows
- (S) `fs.meta.dir`: get metadata on directories
- (S) `fs.meta.file`: get metadata on files
- (S) `fs.meta.symlink`: get metadata on symlinks
- (S) `fs.meta.symlink.scoped`: get metadata on symlinks whose target is in the application's available paths
- (S) `fs.meta.flow`: get metadata on flows
- (S) `fs.watch.dir`: be notified of any change to a directory's content (including its items)
- (S) `fs.watch.dir.recursive`: be notified of any change to a directory's content (including its items, recursively)
- (S) `fs.watch.file`: be notified of any change to a file's content

### Network

- (S) `net.fetch`: fetch a resource  
  **Scope:** list of domains (wildcards supported for subdomains), list of protocols
- (S) `net.expose`: listen to a specific port or a range of ports
  **Scope:** range of ports (may cover a single port)

### System

- (B) `system.clock.date.read`: get the current date
- (B) `system.clock.time.read`: get the current time
- (B) `system.clock.timezone.read`: get the current timezone
- (B) `system.clock.uptime`: get the system's uptime
- (S) `system.user.name.read`: get the current user's name
- (S) `system.user.avatar.read`: get the current user's avatar

- (B) `system.hw.cpu.count`: get the number of CPUs
- (G) `system.hw.cpu.list`: list CPUs (model, frequency, etc.)
- (B) `system.hw.mem.total`: get the amount of total memory
- (B) `system.hw.mem.available`: get the amount of available memory
- (G) `system.hw.mem.slots`: get the number of RAM slots
- (G) `system.hw.mem.list`: list RAM slots (model, frequency, etc.)

### Hardware interfaces

- (S) `hwmid.keyboard.write`: simulate key presses
- (P) `hwmid.keyboard.read`: read key presses from the keyboard
- (S) `hwmid.pointer.write`: simulate actions from pointer devices
- (P) `hwmid.pointer.read`: read actions from pointer devices
- (P) `hwmid.video.read`: access video input streams (cameras, ...)
- (P) `hwmid.audio.read`: access audio input streams (microphones, ...)
- (P) `hwmid.screen.read`: read portions of the screen as image buffers (screenshots, ...)
- (I) `hwmid.screen.read_self`: read portions of the current application's windows (screenshots, ...)

### State

- (B) `state.laptop.is`: check if the device is a laptop
- (B) `state.laptop.is_open`: check if the laptop is physically opened
- (B) `state.battery.has`: check if the device has a battery
- (B) `state.battery.level`: check the battery level
- (B) `state.battery.is_charging`: check if the battery is charging
- (B) `state.battery.is_full`: check if the battery is considered full
- (B) `state.battery.is_critical`: check if the battery is at a critically low level
- (B) `state.battery.estimated_remaining`: get the remaining running time estimated by the system in minutes

### Programs

- (S) + {A} `programs.running.processes`: get the list of running processes
- (S) + {A} `programs.running.windows`: get informations on each running application's windows
- (S) `programs.running.apps`: get the list of running applications

### System-reserved permissions

These permissions are reserved to processes [marked as system](kernel/processes.md#process-attributes).

- `sysapp.process.kill`: suspend or kill external processes
- `sysapp.process.signal`: send a signal to an external process
