# System services

As NightOS' [kernel](../../kernel/README.md) is not monolithic but a microkernel, it only handles the most fundamental tasks of the system, like memory and processes management, as well as direct hardware communication.

The vast majority of its features can be found in system [services](../../services.md), run by the system itself under the `sys` [DID](../../applications-libraries.md#application-identifier).

This splitting implies that most low-level features of the system are documented in the individual services' specifications documents, which you will find here.

## Nomenclature

System services are referred to as the `sys::` services.

All [methods and notifications](../../kernel/ipc.md#methods-and-notifications) describe the required permissions to use them, their arguments.

They also use common error codes:

- `0x00`: cannot read syscall's code or arguments (error while reading memory)
- `0x01`: the requested syscall does not exist
- `0x02`: at least one argument is invalid (e.g. providing a pointer to the `0` address)
- `0x03`: unmapped memory pointer (e.g. provided a pointer to a memory location that is not mapped yet)
- `0x04`: memory permission error (e.g. provided a writable buffer to an allocated but non-writable memory address)
- `0x05`: insufficient permissions
- `0x06`: driver error
- `0x10` to `0x1F`: invalid arguments provided (e.g. value is too high)
- `0x20` to `0x2F`: arguments are not valid in the current context (e.g. provided ID does not exist)
- `0x30` to `0x3F`: resource errors (e.g. file not found)
- `0x40` to `0xFF`: other types of errors

All methods return an answer, though it may be empty (indicated by a _None_). System services' answers always [conclude the exchange](../../kernel/ipc.md#concluding-exchanges).

## List of system services

- PID 10: [`sys::fs`](fs.md): filesystem management
- PID 11: [`sys::fsh`](fsh.md): high-level filesystem management
- PID 12: [`sys::hw`](hw.md): hardware communication
- PID 13: [`sys::perm`](perm.md): permissions management
- PID 14: [`sys::net`](net.md): network communications
- PID 15: [`sys::crypto`](crypto.md): cryptography utilities
- PID 16: [`sys::crashsave`](crashsave.md): [crash saves](../../../features/crash-saves.md) management
- PID 17: [`sys::flow`](flow.md): [flows](../../../specs/filesystem.md#flows) management
- PID 18: [`sys::hydre`](hydre.md): [Hydre](../../shell.md) shell service
- PID 19: [`sys::ui`](ui.md): user interface service
- PID 20: [`sys::app`](app.md): applications management service
- PID 21: [`sys::process`](process.md): processes management service
