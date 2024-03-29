# Specifications

This folder contains _specification documents_, whose purpose is to describe fully a specific concept or feature.
Think of these as reference documents - they are not meant to be easily understood without a solid knowledge of how NightOS works.
For more informations about low-level concepts these documents refer to, you can check the [technical documents](../technical/README.md) first.

- [Applications and libraries](applications-libraries.md) - document describing common things between applications and libraries
- [Applications](applications.md) - how applications are structured and behave
- [Libraries](libraries.md) - what are libraries
- [Filesystem](filesystem.md) - how the filesystem works
- [Storage permissions](storage-permissions.md) - how permissions are managed on filesystem elements
- [The boot process](boot-process.md) - how the system starts
- [Update processes](update-processes.md) - how updates are performed
- [Containers](containers.md) - process isolation system
- [Permissions](permissions.md) - list of applications' permissions
- [The registry](registry.md) - exhaustive specification of the registry's content
- [Vocabulary](vocabulary.md) - the list of NightOS-related terms
- [The shell](shell.md) - how [Hydre](../technical/shell.md) works
- [Shell scripting](shell-scripting.md) - [Hydre](../technical/shell.md)'s scripting language
- [Crash saves](crash-saves.md) - what are crash saves and how they are handled
- [Kernel](kernel/README.md) - complete specifications of the kernel
- [Services](services.md) - specifications about services work and behave
- [Translations](translations.md) - how content translation is handled

## [Integration services](services/integration/README.md)

* [Desktop environment](services/integration/desktop-environments.md)
* [File managers](services/integration/file-managers.md)
* [File openers](services/integration/file-openers.md)
* [Filesystem interfaces](services/integration/filesystem-interfaces.md)

## [Driver services](services/drivers/README.md)

* [Storage driver service](services/drivers/storage.md)

## [System services](services/system/README.md)

* [`sys::fs`](services/system/fs.md): filesystem management
* [`sys::fsh`](services/system/fsh.md): high-level filesystem management
* [`sys::hw`](services/system/hw.md): hardware communication
* [`sys::perm`](services/system/perm.md): permissions management
* [`sys::net`](services/system/net.md): network communications
* [`sys::crypto`](services/system/crypto.md): cryptography utilities
* [`sys::crashsave`](services/system/crashsave.md): [crash saves](../features/crash-saves.md) management
* [`sys::hydre`](services/system/hydre.md): [Hydre](shell.md) shell service
* [`sys::ui`](services/system/ui.md): user interface service
* [`sys::app`](services/system/app.md): applications management service
* [`sys::process`](services/system/process.md): processes management service
