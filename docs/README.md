# Documentation

Welcome to the documentation of NightOS. This directory contains all design and specification documents of the project.

The rendered documentation can be found on [`https://clementnerma.github.io/NightOS`](https://clementnerma.github.io/NightOS).

## [Foreword](FOREWORD.md)

## [Project](project/)

- [Roadmap](project/roadmap.md) - the project's roadmap
- [Development](project/development.md) - how the project will be developped
- [Hardware requirements](project/hw-requirements.md) - hardware required in order to install and run NightOS

## [Concepts](concepts/)

- [What are applications?](concepts/applications.md) - the way to run software on NightOS
- [What are libraries?](concepts/libraries.md) - sharing identical behaviours between multiple applications
- [What are users?](concepts/users.md) - sharing a computer between multiple persons

## [Features](features/)

- [The balancer](features/balancer.md) - improve performances by balancing processes' priority
- [Crash saves](features/crash-saves.md) - prevent data loss at maximum with crash-proof data saving
- [Domains](features/domains.md) - manage a network of computers
- [Encryption](features/encryption.md) - encrypt the whole storage and individual user accounts
- [Freeze-prevention system](features/freeze-prevention.md) - prevent the system from freezing when all RAM and CPU power are used
- [Parental control](features/parental-control.md) - manage children access to the computer
- [Permissions system](features/permissions.md) - prevent applications and users from doing whatever they want
- [Sandboxes](features/sandboxes.md) - isolate applications to prevent them from harming important data
- [Synchronization](features/synchronization.md) - synchronize settings between multiple computers

## [Applications](applications/)

The list of default applications and their description can be found [here](applications/README.md).

## [Technical](technical/)

- [The controller](technical/controller.md) - permissions management system
- [Developer mode](technical/dev-mode.md) - enable powerful development options
- [Devices](technical/devices.md) - manage hardware devices
- [File formats](technical/file-formats.md) - description of all native file formats
- [Integrity checker](technical/integrity-checker.md) - ensure the system hasn't been corrupted
- [I/O manager](technical/io-manager.md) - manage input/output requests
- [Multi-platform management](technical/multi-platform.md) - how the NightOS ecosystem can be used on other operating systems
- [Performances](technical/performances.md) - system tweaks used to optimize general and specific-case performances
- [Pre-compiling applications](technical/pre-compiling.md) - pre-compiling applications to improve installation time and size
- [Processes](technical/processes.md) - low-level view of how code runs in a concurrent way
- [The registry](technical/registry.md) - configure the system's behaviour and features
- [Services](technical/services.md) - special processes that run in the background and allow other applications to perform specific tasks
- [The shell](technical/shell.md) - the de-facto way to run complex and/or automatized tasks on NightOS

## [Specifications](specs/)

- [Applications and libraries](specs/applications-libraries.md) - document describing common things between applications and libraries
- [Application context](specs/applications/context.md) - launch an application to directly perform a specific task
- [Applications package](specs/applications/package.md) - files representing a whole application
- [Applications manifest](specs/applications/manifest.md) - how applications describe themselves in their package
- [Filesystem](specs/filesystem.md) - how the filesystem works
- [Libraries](specs/libraries.md) - what are libraries
- [The registry](specs/registry.md) - exhaustive specification of the registry's content
- [Vocabulary](specs/vocabulary.md) - the list of NightOS-related terms
- [The shell](specs/shell.md) - the native shell of NightOS
- [Shell scripting](specs/shell-scripting.md) - [Hydre](technical/shell.md)'s scripting language
- [Services](specs/services.md) - specifications about services work and behave

### [Kernel](specs/kernel/)

- [Hardware](specs/kernel/hardware.md) - how the kernel interacts with hardware
- [Memory](specs/kernel/memory.md) - memory organization and management
- [Processes](specs/kernel/processes.md) - processes concept and management
- [Data structures](specs/kernel/data-structures.md) - data structures used by the kernel to represent things in memory
- [Kernel-process communication](specs/kernel/kpc.md) - how the kernel communicate with processes and vice-versa
- [Inter-process communication](specs/kernel/ipc.md) - communication between processes
- [Signals](specs/kernel/signals.md) - complete specification of [signals](specs/kernel/kpc.md)
- [System calls](specs/kernel/syscalls.md) - complete specification of [system calls](specs/kernel/kpc.md)

### [Scoped services](specs/scoped-services/)

- [Desktop environments](specs/scoped-services/desktop-environments.md) - how the user interface is handled by applications
- [File managers](specs/scoped-services/file-managers.md) - how file managers are integrated into the system
- [Filesystem openers](specs/scoped-services/filesystem-openers.md) - how files are associated to applications

### [System services](specs/system-services/)

- [`sys::fs`](specs/system-services/fs.md) - the filesystem service
- [`sys::fsh`](specs/system-services/fsh.md) - the high-level filesystem service
- [`sys::hw`](specs/system-services/hw.md) - the hardware service
- [`sys::perm`](specs/system-services/perm.md) - the permissions service
- [`sys::net`](specs/system-services/net.md) - the network service
- [`sys::crypto`](specs/system-services/crypto.md) - the cryptography service
- [`sys::crashsave`](specs/system-services/crashsave.md) - the [crash saves](features/crash-saves.md) service
- [`sys::flow`](specs/system-services/flow.md) - the [flows](specs/filesystem.md#flows) service
- [`sys::hydre`](specs/system-services/hydre.md) - the [shell (Hydre)](specs/shell.md) service
- [`sys::app`](specs/system-services/app.md) - the [applications](concepts/applications.md) management service

## User Experience

- [Desktop environments](ux/desktop-environment.md)
- [Notifications](ux/notifications.md)
- [Sound](ux/sound.md)