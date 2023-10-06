# Services

This directory contains documentation for the different types of services.

## Conventions

Services' methods' and notifications' [exchanges](../kernel/ipc.md#exchanges-and-messages) are always made of two messages (one method request or notification, and one answer) unless stated otherwise.

### Error codes

Below is a list of all categorized error codes returned by services, split into three categories:

* _System_ error codes are specific to [system services](system/README.md) and not shown in the their specification, as they are common to each and every method
* _Implicit_ error codes are not shown in the related services' specification, as they are common to each and every method
* _Conventional_ error codes are always shown in the specifications


Note that some of these cotes are optional, which means they must be used for specific types of errors, but some services may not support the required check to return them.

Conventional error codes use an increasing importance order ; checkings should always be performed so that a raised error is always of the lowest error code in the list.

#### System error codes

- `0x0000`: Internal error while [communicating with the kernel](../kernel/kpc.md)
- `0x0001`: Insufficient permissions

#### Implicit error codes

- `0x0100`: Fatal error while communicating with a [`sys::hw`](system/hw.md)
- `0x0101`: Fatal error while communicating with a [driver](system/hw.md#drivers)
- `0x0102`: Fatal error while communicating with a [hardware device](../kernel/syscalls.md)

#### Conventional error codes

- `0x1000` to `0x1FFF`: Invalid argument(s) provided (constant checking)
- `0x2000` to `0x2FFF`: Provided arguments are not valid in the current context (in relation with other arguments)
- `0x3000` to `0x3FFF`: Provided arguments are not valid (after resources checking, e.g. requested file was not found)
- `0x4000` to `0x4FFF`: Resource access or modification error
- `0x5000` to `0x5FFF`: Handled hardware errors
- `0x6000` to `0x6FFF`: Other types of errors

## [Integration services](integration/README.md)

* [Desktop environment](integration/desktop-environments.md)
* [File managers](integration/file-managers.md)
* [File openers](integration/file-openers.md)

## [Driver services](drivers/README.md)

* [Storage driver service](drivers/storage.md)

## [System services](system/README.md)

* [`sys::fs`](system/fs.md): filesystem management
* [`sys::fsh`](system/fsh.md): high-level filesystem management
* [`sys::hw`](system/hw.md): hardware communication
* [`sys::perm`](system/perm.md): permissions management
* [`sys::net`](system/net.md): network communications
* [`sys::crypto`](system/crypto.md): cryptography utilities
* [`sys::crashsave`](system/crashsave.md): [crash saves](../../features/crash-saves.md) management
* [`sys::hydre`](system/hydre.md): [Hydre](../shell.md) shell service
* [`sys::ui`](system/ui.md): user interface service
* [`sys::app`](system/app.md): applications management service
* [`sys::process`](system/process.md): processes management service
