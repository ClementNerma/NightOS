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

A process can open a pipe with another process using the [`OPEN_WRITE_PIPE`](syscalls.md#0x40-open_write_pipe) (it send data) or the [`OPEN_READ_PIPE`](syscalls.md#0x41-open_read_pipe) (to receive data) syscall.

The other process will then respectively receive either the [`RECV_READ_PIPE`](signals.md#0x40-recv_read_pipe) or the [`RECV_WRITE_PIPE`](signals.md#0x41-recv_write_pipe) signal. If no handler is set when the signal is sent, the opening syscall fails.

### Pipes' pending data

When a pipe is written to, the data is written to a memory zone. This zone is called the _pipe's buffer_ and it's content is called the _pending data_.  
When a pipe is read from, the pending data is progressively retrieved, erased as the read progresses.

The default size of the pipe's buffer is 64 KB, but this can be extended to up to 16 MB during its creation.
When it is reached, no data can be written to the pipe anymore, meaning the other process must read data from it in order to free space to write it.

### Pipes locking

When a pipe is being written to or read from, it is _locked_, which means no other writing or reading can happen during this time. This prevents data races which are a common source of bugs which are complex to debug, while not compromising performances.

### Closing pipes

Any of the two processes (be it the receiver or the sender) can close a pipe using the [`CLOSE_PIPE`](syscalls.md#0x46-close_pipe) syscall, providing its SC or RC identifier. The pipe is immediatly closed on both sides, and the other process receives the [`PIPE_CLOSED`](signals.md#0x42-pipe_closed) signal.

### Message pipes

Pipes are designed to transmit streams of data, but sometimes we need to use them to transmit messages. This is why there are specific [syscalls](syscalls.md) and [signals](signals.md) to deal with this problem.

A _message pipe_ is a pipe that only sends and receives dynamic-sized messages instead of a stream of bytes.  
They have a maximum length of 64 KB, which is the pipes' buffer's minimal capacity. Messages must always be sent at once and cannot be sent partially.  
Their length is determined when the message is sent which, coupled to [pipes locking](#pipes-locking), allows to retrieve complete messages directly.

It's not possible to send "non-message" data through a message pipe, as the action of writing to a pipe will automatically check if it's a message pipe and ensure the size and "send at once" requirement are met.

### Interactive usage

When an application process' [execution context](applications/context.md#execution-context) is started from a command, it gets access to several pipes called the _standard pipes_:

| Pipe identifier | Standard pipe name | Pipe type | Format  | Description                                                                                                |
| --------------- | ------------------ | --------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| CMDIN           | Typed input        | Raw       | _typed_ | Data coming either from a command pipe (`|`) or, if the input format is `buffer`, from an input pipe (`<`) |
| CMDUSR          | Interactive input  | Message   | UTF-8   | Data coming from a terminal session (e.g. user inputs)                                                     |
| CMDMSG          | Messages output    | Message   | UTF-8   | Messages to display in the console, which won't be redirected by default                                   |
| CMDERR          | Errors output      | Message   | UTF-8   | Messages to display as errors in the console, which won't be redirected by default                         |
| CMDRAW          | Raw bytes          | Raw       | Buffer  | Output data, which will be redirected if an output pipe (`>`) is used                                      |
| CMDOUT          | Typed output       | Raw       | _typed_ | Typed output data, which will be used by [shell scripts](shell-scripting.md))                              |

The process that launched the command gets the ability to:

- Send data to the callee's CMDIN/CMDUSR pipe ;
- Read data from the callee's CMDMSG/CMDERR/CMDRAW/CMDOUT pipes

If the process terminates before the return value has been fully transmitted through CMDOUT or if it closes the CMDOUT pipe before fully transmitting the value, the process is considered as faulty and killed immediatly (if still alive). The calling script (if any) exits with an error message, unless the error is caught with `catch`, the error message being generated by the system.

Even if the process closes its CMDMSG or CMDRAW pipe properly (by calling the [`CLOSE_PIPE`](syscalls.md#0x46-close_pipe)), the command is not considered as finished until the process itself did not terminate.

Note that when a return value has been fully transmitted through CMDOUT, all pipes are closed and the command is considered as finished.

## Shared Memory

**TODO**
