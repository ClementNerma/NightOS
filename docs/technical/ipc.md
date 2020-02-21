# Inter-Process Communication

The _Inter-Process Communication_ (IPC) is the way processes communicate with each others, based on [Inter-process Uni-directional Channels](processes.md#inter-process-uni-directional-channels).

## Communication permissions

A non-administrator process can communicate with another through IPC if the target process is either:

* Run by the same user and originates from the same application
* A [_service_](services.md) through a [RC/SC couple](processes.md#inter-process-uni-directional-channels) provided by the [`CONNECT_SERVICE`](../specs/syscalls.md#0x20-connect_service) system call.

Administrator processes can communicate freely with every [userland process](processes.md).

## IPC modes

IPC can be performed through:

* [Pipes](../specs/ipc.md#pipes)
* [Shared memory](../specs/ipc.md#shared-memory)

## Implementation details

You can check how IPC actually works in the [specifications document](../specs/ipc.md).
