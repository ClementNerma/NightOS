# Documentation

Welcome to the documentation of NightOS. This directory contains all design and specification documents of the project.

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
- [Filesystem Abstraction Layer](technical/fs-abslayer.md) - how the system ensures specific features on less powerful filesystems
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

- [Application context](specs/applications/context.md) - launch an application to directly perform a specific task
- [Applications package](specs/applications/package.md) - files representing a whole application
- [Applications manifest](specs/applications/manifest.md) - how applications describe themselves in their package
- [Filesystem structure](specs/fs-structure.md) - list of file and directories and their meaning
- [Inter-process communication](specs/ipc.md) - communication between processes
- [Libraries](specs/libraries.md) - what are libraries
- [The registry](specs/registry.md) - exhaustive specification of the registry's content
- [Vocabulary](specs/vocabulary.md) - the list of NightOS-related terms
- [The shell](specs/shell.md) - the native shell of NightOS
- [Shell scripting](specs/shell-scripting.md) - [Hydre](technical/shell.md)'s scripting language
- [Signals](specs/signals.md) - complete specification of [signals](specs/kernel/kpc.md)
- [System calls](specs/syscalls.md) - complete specification of [system calls](specs/kernel/kpc.md)

### [Kernel](specs/kernel/)

- [Hardware](specs/kernel/hardware.md) - how the kernel interacts with hardware
- [Kernel-process communication](specs/kernel/kpc.md) - how the kernel communicate with processes and vice-versa
- [Memory](specs/kernel/memory.md) - memory organization and management
- [Processes](specs/kernel/processes.md) - processes concept and management
