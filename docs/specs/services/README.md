# System services

This folder contains documentation for each [system service](../services.md).

Each service is a system application, with the `sys` [DID](../../concepts/applications.md#application-identifier).

They are referred to as `sys::` services.

## Nomenclature

All [methods and notifications](../ipc.md#methods-and-notifications) describe the required permissions to use them, their arguments.

They also use common error codes:

- `0x00`: Insufficient permissions
- `0x10` to `0x1F`: invalid arguments provided (e.g. value is too high)
- `0x20` to `0x2F`: arguments are not valid in the current context (e.g. provided ID does not exist)
- `0x30` to `0x3F`: resource errors (e.g. file not found)
- `0x40` to `0xFF`: other types of errors

## List of system services

- [`sys::fs`](fs.md): filesystem management
- [`sys::hw`](hw.md): hardware communication
- [`sys::grid`](grid.md): permissions management
- [`sys::net`](net.md): network communications
- [`sys::crypto`](crypto.md): cryptography utilities
- [`sys::crashsave`](crashsave.md): [crash saves](../../features/crash-saves.md) management
- [`sys::flow`](flow.md): [flows](../../technical/fs-abslayer.md#flows) management
- [`sys::hydre`](hydre.md): [Hydre](../shell.md) shell service
