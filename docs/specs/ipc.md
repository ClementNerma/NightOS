# Inter-Process Communication

This document describes the way [Inter-Process Communication (IPC)](../technical/ipc.md) works.

## Pipes

_Inter-process Uni-directional Channels_ (IUC), also called _pipes_, allow two distinct processes to communicate.

Pipes are made of two uni-directional parts:

- A _sender channel_ (SC) which can only be written to (write-only)
- A _receiver channel_ (RC), which can only be read from (read-only)

The two processes sharing a pipes are:

- The _sender process_, which uses the SC to send data to the other process
- The _receiver process_, which uses the RC to retrieve data sent by the other process

The process that creates the pipe gets both the SC and the RC, and is expected to provide one of them to another process.

Each SC and RC has a unique identifier, which is binded to the process that created it.  
The process receiving an SC or RC receives another identifier for it, unique to that process, which prevents IDs collisions.

### Opening pipes

A process can open a pipe with another process using the [`OPEN_PIPE`](syscalls.md#0x20-open_pipe) syscall.

The other process will then receive the [`RECV_PIPE`](signals.md#0x20-recv_pipe) signal. If no handler is set when the signal is sent, the opening syscall fails.

### Pipes' pending data

When a pipe is written to, the data is written to a memory zone. This zone is called the _pipe's buffer_ and it's content is called the _pending data_.  
When a pipe is read from, the pending data is progressively retrieved, erased as the read progresses.

The default size of the pipe's buffer is 64 KB, but this can be extended to up to 16 MB during its creation.
When it is reached, no data can be written to the pipe anymore, meaning the other process must read data from it in order to free space to write it.

### Pipes locking

When a pipe is being written to or read from, it is _locked_, which means no other writing or reading can happen during this time. This prevents data races which are a common source of bugs which are complex to debug, while not compromising performances.

### Closing pipes

Any of the two processes (be it the receiver or the sender) can close a pipe using the [`CLOSE_PIPE`](syscalls.md#0x25-close_pipe) syscall, providing its SC or RC identifier. The pipe is immediatly closed on both sides, and the other process receives the [`PIPE_CLOSED`](signals.md#0x21-pipe_closed) signal.

### Message pipes

Pipes are designed to transmit streams of data, but sometimes we need to use them to transmit messages. This is why there are specific [syscalls](syscalls.md) and [signals](signals.md) to deal with this problem.

A _message pipe_ is a pipe that only sends and receives dynamic-sized messages instead of a stream of bytes.  
They have a maximum length of 64 KB, which is the pipes' buffer's minimal capacity. Messages must always be sent at once and cannot be sent partially.  
Their length is determined when the message is sent which, coupled to [pipes locking](#pipes-locking), allows to retrieve complete messages directly.

It's not possible to send "non-message" data through a message pipe, as the action of writing to a pipe will automatically check if it's a message pipe and ensure the size and "send at once" requirement are met.

### Interactive usage

You can find more informations on interactive usage in the [shell specifications](shell.md#interactivity).

## Service sockets

_Service sockets_ allow a process to communicate with a [service](services.md).

## Shared Memory

Shared memory allows a process to share a part of its memory with another process. It has multiple advantages over pipes:

- Data is not copied twice, as the sender process directly shares a part of its own memory
- There is no pipe management, which results in saving operations and less memory accesses
- There is no pipe buffer to manage which means all the data can be sent at once

Its main disadvantage being that all data is shared at once, so there is no synchronization or "asynchronous sending" mechanism, which is the purpose of pipes.

It works by asking the kernel to share the memory through the [`SHARE_MEM`](syscalls.md#0x34-share_mem) syscall, the target process receiving the [`RECV_SHARED_MEM`](signals.md#0x34-recv_shared_mem) signal.

There are two types of sharing:

- _Mutual_ sharing allows both the sharer and the receiver processes to access the shared memory ;
- _Exclusive_ sharing unmaps the shared memory from the sharer and only allows the receiver process to access it

Exclusive mode has several advantages: the sender process to not have to care about managing this memory and avoid overwriting it by accident, but it also ensures the receiving process that the sender will not perform malicious modifications on the shared buffer while the data is processed on its side.

Mutual memory sharing can be stopped using the [`UNSHARE_MEM`](syscalls.md#0x35-unshare_mem) syscall, while exclusive sharing are left to the receiver process.
