# Filesystem Abstraction Layer

A _filesystem_ is the way to deal with a storage device, for instance to store files and directories.

NightOS supports many different filesystems, but as not all support all of the features we want them to, a _filesystem abstraction layer_ (FAL) is added to ensure the filesystem supports specific features. It's basically an interface that runs when dealing with the internal storage, that ensures its capabilities.

## Structure

The filesystem structure of a NightOS installation can be found in the related [specifications document](../specs/fs-structure.md).

## Symbolic links

_Symbolic links_, abbreviated _symlinks_, are files that point to another location.

### Concept

A symlink points to a specific item: file, folder, device, anything. It's just not a shortcut, though, as the symlink will still work if its target is moved.

When a symlink is accessed, the system will transparently access its target item instead.

When a symlink is removed, it does not affect the original target. Also, any number of symlinks can target the same item, and symlinks can target other symlinks to. When accessing a symlink, if its target item is a symlink itself, the latter's target will be accessed instead, and so on, until we do not encounter a symlink anymore.

This can be explicitly disabled when interacting with the filesystem, or limited to a specific number of children.

Also, symbolic links may point to a location on another storage.

### Cyclic symlinks

Given the following situation:

1. We create a symlink `A` which points to a random file
2. We create a symlink `B` which points to `A`
3. We update the target of `A` to be `B`

When we will try to access `A`, the system will access `B`, then `A`, then `B`, and so on. This is called a _cyclic symlink chain_. In such case, the chain is reduced to the minimum (for instance, if we had `C` pointing to `A`, the minimum chain would not be `C` `A` `B` but just `A` `B`), and marked as erroneous. The process that tried to access the symlink will receive a specific error code to indicate a cyclic symlink chain was encountered.

## Flows

_Flows_ are a simple and efficient way for processes (mostly [services](services.md)) to allow treating flows of data.

### Concept

A flow is a file without extension, located in the `/fl` directory, that can either send data to reader processes (_read-only_) or receive data from writer processes (_write-only_).

To understand the concept better, here is the list of native flow files that are always available:

| Flow file    | Type       | Description                                                                                       |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------- |
| `/fl/zero`   | Read-only  | Outputs zeroes all the time ; useful to zero a file or device or to benchmark a storage           |
| `/fl/rand`   | Read-only  | Outputs cryptographically-secure random numbers. Useful to randomly fill a storage or memory area |
| `/fl/ucrand` | Read-only  | Outputs non-cryptographically-secure random numbers, thus faster that `/fl/rand`                  |
| `/fl/null`   | Write-only | Receives data but does nothing with them                                                          |

Processes are based on [pipes](ipc.md).

### Creating a flow

When a process wants to create a flow, it follows the following procedure:

1. The process asks the [`sys:flow`](../specs/services.md#sysflow) service to create a flow
2. The service creates the related flow file in `/fl`
3. When a process reads from the (readable) flow file, all data is continuely retrieved from the creator's SC (until the flow is closed)
4. When a process writes to the (writable) flow file, all data is continuely written to the creator's RC (the flow is not closed after that though)
5. When the creator closes its SC/RC, the IPC channels duo is closed and the flow file is removed

### Connecting to a flow

When a process wants to read from or write to a file, it first asks the [`sys:flow`](../specs/services.md#sysflow) service to connect to this file. If accepted, it receives a [SC or RC](../specs/ipc.md#pipes) to interact with the flow.

