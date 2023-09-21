# Documentation

Welcome to the documentation of NightOS. This directory contains all design and specification documents of the project.

The rendered documentation can be found on [`https://clementnerma.github.io/NightOS`](https://clementnerma.github.io/NightOS).

A global, technical overview of the system's architecture can be found [here](docs/technical/../../technical/overview.md).

## [Foreword](FOREWORD.md)

## [Project](project/README.md)

- [Roadmap](project/roadmap.md) - the project's roadmap
- [Development](project/development.md) - how the project will be developped
- [Hardware requirements](project/hw-requirements.md) - hardware required in order to install and run NightOS

## [Concepts](concepts/README.md)

- [Applications](concepts/applications.md) - the way to run software on NightOS
- [Libraries](concepts/libraries.md) - sharing identical behaviours between multiple applications
- [Users](concepts/users.md) - sharing a computer between multiple persons

## [Features](features/README.md)

- [The balancer](features/balancer.md) - improve performances by balancing processes' priority
- [Crash saves](features/crash-saves.md) - prevent data loss at maximum with crash-proof data saving
- [Domains](features/domains.md) - manage a network of computers
- [Encryption](features/encryption.md) - encrypt the whole storage and individual user accounts
- [Freeze-prevention system](features/freeze-prevention.md) - prevent the system from freezing when all RAM and CPU power are used
- [Parental control](features/parental-control.md) - manage children access to the computer
- [Permissions system](features/permissions.md) - prevent applications and users from doing whatever they want
- [Sandboxes](features/sandboxes.md) - isolate applications to prevent them from harming important data
- [Synchronization](features/synchronization.md) - synchronize settings between multiple computers

## [Applications](applications/README.md)

The list of default applications and their description can be found [here](applications/README.md).

## [Technical](technical/README.md)

- [Overview](technical/overview.md) - a global overview of the system
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

## [Specifications](specs/README.md)

- [Applications and libraries](specs/applications-libraries.md) - document describing common things between applications and libraries
- [Applications](specs/applications.md) - how applications are structured and behave
- [Filesystem](specs/filesystem.md) - how the filesystem works
- [Storage permissions](specs/storage-permissions.md) - how permissions are managed on filesystem elements
- [Libraries](specs/libraries.md) - what are libraries
- [Containers](specs/containers.md) - process isolation system
- [Permissions](specs/permissions.md) - list of applications' permissions
- [The registry](specs/registry.md) - exhaustive specification of the registry's content
- [Vocabulary](specs/vocabulary.md) - the list of NightOS-related terms
- [The shell](specs/shell.md) - the native shell of NightOS
- [Shell scripting](specs/shell-scripting.md) - [Hydre](technical/shell.md)'s scripting language
- [Crash saves](specs/crash-saves.md) - what are crash saves and how they are handled
- [Services](specs/services.md) - specifications about services work and behave
- [Translations](specs/translations.md) - how content translation is handled

### [Kernel](specs/kernel/README.md)

- [Hardware](specs/kernel/hardware.md) - how the kernel interacts with hardware
- [Memory](specs/kernel/memory.md) - memory organization and management
- [Processes](specs/kernel/processes.md) - processes concept and management
- [Scheduling](specs/kernel/scheduling.md) - tasks scheduling
- [Data structures](specs/kernel/data-structures.md) - data structures used by the kernel to represent things in memory
- [Kernel-process communication](specs/kernel/kpc.md) - how the kernel communicate with processes and vice-versa
- [Inter-process communication](specs/kernel/ipc.md) - communication between processes
- [Signals](specs/kernel/signals.md) - complete specification of [signals](specs/kernel/kpc.md)
- [System calls](specs/kernel/syscalls.md) - complete specification of [system calls](specs/kernel/kpc.md)

### [Integration services](specs/services/integration/README.md)

- [Desktop environments](specs/services/integration/desktop-environments.md) - how the user interface is handled by applications
- [File managers](specs/services/integration/file-managers.md) - how file managers are integrated into the system
- [File openers](specs/services/integration/file-openers.md) - how files are associated to applications
- [Filesystem interfaces](specs/services/integration/filesystem-interfaces.md) - how filesystems are handled by third-party services

### [Driver services](specs/services/drivers/README.md)

- [Storage driver service](specs/services/drivers/storage.md)

### [System services](specs/services/system/README.md)

- [`sys::fs`](specs/services/system/fs.md) - the filesystem service
- [`sys::fsh`](specs/services/system/fsh.md) - the high-level filesystem service
- [`sys::hw`](specs/services/system/hw.md) - the hardware service
- [`sys::perm`](specs/services/system/perm.md) - the permissions service
- [`sys::net`](specs/services/system/net.md) - the network service
- [`sys::crypto`](specs/services/system/crypto.md) - the cryptography service
- [`sys::crashsave`](specs/services/system/crashsave.md) - the [crash saves](features/crash-saves.md) service
- [`sys::flow`](specs/services/system/flow.md) - the [flows](specs/filesystem.md#flows) service
- [`sys::hydre`](specs/services/system/hydre.md) - the [shell (Hydre)](specs/shell.md) service
- [`sys::app`](specs/services/system/app.md) - the [applications](concepts/applications.md) management service
- [`sys::process`](specs/services/system/process.md) - the [processes](technical/processes.md) management service

## User Experience

- [Desktop environments](ux/desktop-environment.md)
- [Notifications](ux/notifications.md)
- [Sound](ux/sound.md)