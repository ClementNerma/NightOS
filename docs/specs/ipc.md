# Inter-Process Communication

This document describes the way [Inter-Process Communication (IPC)](../technical/ipc.md) works.

## Pipes

_Inter-process Uni-directional Channels_ (IUC), also called _pipes_, allow two distinct processes to communicate.

Pipes are made of two uni-directional parts:

* A _sender channel_ (SC) which can only be written to (write-only)
* A _receiver channel_ (RC), which can only be read from (read-only)

The two processes sharing a pipes are:

* The _sender process_, which uses the SC to send data to the other process
* The _receiver process_, which uses the RC to retrieve data sent by the other process

The process that creates the pipe gets both the SC and the RC, and is expected to provide one of them to another process.

When a process is created, it gets several "forced" pipes:

* The standard input ;
* The standard normal output ;
* The standard error output ;

Each SC and RC has a unique identifier.

### Opening pipes

A process can open a pipe with another process using the [`OPEN_WRITE_PIPE`](syscalls.md#0x40-open_write_pipe) (it send data) or the [`OPEN_READ_PIPE`](syscalls.md#0x41-open_read_pipe) (to receive data) syscall.

The other process will then respectively receive either the [`RECV_READ_PIPE`](signals.md#0x40-recv_read_pipe) or the [`RECV_WRITE_PIPE`](signals.md#0x41-recv_write_pipe) signal. If no handler is set when the signal is sent, the opening syscall fails.

### Pipes' pending data

When a pipe is written to, the data is written to a memory zone. This zone's content is called the _pending data_.  
When a pipe is read from, the pending data is progressively retrieved, erased as the read progresses.

There is a size limit to pending data though, of 64 KB, called the pipe's _capacity_.  
When it is reached, no data can be written to the pipe anymore, meaning the other process must read data from it in order to free space to write it.

### Closing pipes

Any of the two processes (be it the receiver or the sender) can close a pipe using the [`CLOSE_PIPE`](syscalls.md#0x44-close_pipe) syscall, providing its SC or RC identifier. The pipe is immediatly closed on both sides, and the other process receives the [`PIPE_CLOSED`](signals.md#0x42-pipe_closed) signal.

## Shared Memory

**TODO**