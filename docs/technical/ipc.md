# Inter-Process Communication

The _Inter-Process Communication_ (IPC) is the way processes communicate with other ones.

- [Communication permissions](#communication-permissions)
- [IPC modes](#ipc-modes)
- [Implementation details](#implementation-details)

## Communication permissions

A non-administrator process can communicate with another through IPC if the target process is either:

- Run by the same user and originates from the same application
- A [_service_](services.md) through a [pipe](../specs/kernel/ipc.md#pipes) provided by the [`CONNECT_SERVICE`](../specs/kernel/syscalls.md#0x2a-connect_service) system call.

Administrator processes can communicate freely with every [userland process](processes.md).

## IPC modes

IPC can be performed through:

- [Pipes](../specs/kernel/ipc.md#pipes)
- [Service sockets](../specs/kernel/ipc.md#service-sockets)
- [Shared memory](../specs/kernel/ipc.md#shared-memory)

## Implementation details

You can check how IPC actually works in the [specifications document](../specs/kernel/ipc.md).
