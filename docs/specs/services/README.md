# System services

This folder contains documentation for each [system service](../services.md).

Each service is a system application, with the `sys` [DID](../../concepts/applications.md#application-identifier).

They are referred to as `sys::` services.

**NOTE:** A large part of how the system works can be found in the different services' documentation, such as the exact way hardware devices and network communications are handled, or how the filesystem is managed.

## Nomenclature

All [methods and notifications](../ipc.md#methods-and-notifications) describe the required permissions to use them, their arguments.

They also use common error codes:

- `0x00`: cannot read syscall's code or arguments (error while reading memory)
- `0x01`: the requested syscall does not exist
- `0x02`: at least one argument is invalid (e.g. providing a pointer to the `0` address)
- `0x03`: unmapped memory pointer (e.g. provided a pointer to a memory location that is not mapped yet)
- `0x04`: memory permission error (e.g. provided a writable buffer to an allocated but non-writable memory address)
- `0x05`: insufficient permissions
- `0x10` to `0x1F`: invalid arguments provided (e.g. value is too high)
- `0x20` to `0x2F`: arguments are not valid in the current context (e.g. provided ID does not exist)
- `0x30` to `0x3F`: resource errors (e.g. file not found)
- `0x40` to `0xFF`: other types of errors

All methods return an answer, though it may be empty (indicated by a _None_). System services' answers always [conclude the exchange](../ipc.md#concluding-exchanges).

## List of system services

- [`sys::fs`](fs.md): filesystem management
- [`sys::hw`](hw.md): hardware communication
- [`sys::perm`](perm.md): permissions management
- [`sys::net`](net.md): network communications
- [`sys::crypto`](crypto.md): cryptography utilities
- [`sys::crashsave`](crashsave.md): [crash saves](../../features/crash-saves.md) management
- [`sys::flow`](flow.md): [flows](../../technical/fs-abslayer.md#flows) management
- [`sys::hydre`](hydre.md): [Hydre](../shell.md) shell service
