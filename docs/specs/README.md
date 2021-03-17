# Specifications

This folder contains _specification documents_, whose purpose is to describe fully a specific concept or feature.
Think of these as reference documents - they are not meant to be easily understood without a solid knowledge of how NightOS works.
For more informations about low-level concepts these documents refer to, you can check the [technical documents](../technical/README.md) first.

- [Applications and libraries](applications-libraries.md) - document describing common things between applications and libraries
- [Application context](applications/context.md) - launch an application to directly perform a specific task
- [Applications package](applications/package.md) - files representing a whole application
- [Applications manifest](applications/manifest.md) - how applications describe themselves in their package
- [Filesystem](filesystem.md) - how the filesystem works
- [Libraries](libraries.md) - what are libraries
- [The registry](registry.md) - exhaustive specification of the registry's content
- [Vocabulary](vocabulary.md) - the list of NightOS-related terms
- [The shell](shell.md) - how [Hydre](../technical/shell.md) works
- [Shell scripting](shell-scripting.md) - [Hydre](../technical/shell.md)'s scripting language
- [Kernel](kernel/README.md) - complete specifications of the kernel
- [Services](services.md) - specifications about services work and behave

## Integration services

* [Desktop environment](services/integration/desktop-environments.md)
* [File managers](services/integration/file-managers.md)
* [File openers](services/integration/file-openers.md)

## Driver services

* [Filesystem driver service](services/drivers/filesystem.md)

## System services

* [`sys::fs`](services/system/fs.md): filesystem management
* [`sys::fsh`](services/system/fsh.md): high-level filesystem management
* [`sys::hw`](services/system/hw.md): hardware communication
* [`sys::perm`](services/system/perm.md): permissions management
* [`sys::net`](services/system/net.md): network communications
* [`sys::crypto`](services/system/crypto.md): cryptography utilities
* [`sys::crashsave`](services/system/crashsave.md): [crash saves](../features/crash-saves.md) management
* [`sys::flow`](services/system/flow.md): [flows](filesystem.md#flows) management
* [`sys::hydre`](services/system/hydre.md): [Hydre](shell.md) shell service
* [`sys::ui`](services/system/ui.md): user interface service
* [`sys::app`](services/system/app.md): applications management service
* [`sys::process`](services/system/process.md): processes management service
