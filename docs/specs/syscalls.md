# System calls

_System calls_, abbreviated _syscalls_, are the first type of [KPC](kernel/kpc.md). They allow a process to ask the kernel to perform an action.

A syscall is made of a 8-bit code, as well as arguments, whose size will vary depending on their type.
When performing a syscall, the process will put in a specific CPU register an address poiting to a memory address containing in a row the syscall's code and its arguments. For most syscalls, code and arguments will be not be longer than 128 bits, but some may use larger arguments.

Some syscalls require the process to send a buffer of data. In such case, the process simply provides a pointer to the said buffer - so the argument's size will vary depending on the length of memory addresses.

After preparing the syscall's code and arguments, the process raises a specific exception that is caught by the kernel. When the syscall is complete, the kernel puts the result values in specific registers and resumes the process. This means that **all syscalls are synchronous**.

System calls always return two numbers: a 8-bit one (errcode) and a 8 bytes one (result code). If the errcode is not null, then an error occured during the syscall. The specific value indicate the encountered type of error:

- `0x00`: cannot read syscall's code or arguments (error while reading memory)
- `0x01`: the requested syscall does not exist
- `0x02`: at least one argument is invalid (e.g. providing a pointer to the `0` address)

Some syscalls have specific error codes (starting from `0x10`).

Note that advanced actions like permissions management or filesystem access are achieved through the use of [IPC](ipc.md).

You can find below the exhaustive list of system calls.

_NOTE:_ _"CPU-dependent size"_ indicates a data that will be 16-bit long on a 16-bit CPU, 32-bit long on a 32-bit CPU, and so on.

## `0x01` HANDLE_SIGNAL

Arguments: Code of the signal (1 byte), pointer to the handler function (CPU-dependent size)  
Return value: -  
Errors:

- `0x10`: the requested signal does not exist

Register a [signal handler](signals.md).
If the address pointed by this syscall's is not executable by the current process when this signal is sent to the process, the signal will be converted to an [`HANDLER_FAULT`](signals.md#0x01-handler_fault) signal instead.

## `0x02` UNHANDLE_SIGNAL

Arguments: Code of the signal (1 byte)  
Return value: -  
Errors:

- `0x10`: the requested signal does not exist
- `0x11`: the requested signal does not have an handler

Unregister a signal handler, falling back to the default signal reception behaviour if this signal is sent to the process.

## `0x03` IS_SIGNAL_HANDLED

Arguments: Code of the signal (1 byte)  
Return value: `0` if the signal is not handled, `1` if it is (1 byte)  
Errors:

- `0x10`: the requested signal does not exist

Check if a signal has a registered handler.

## `0x04` READY

Arguments: -  
Return value: -  
Errors:

- `0x10`: The process already told it was ready

Indicate the system this process has set up all its event listeners, so it can start dequeuing [signals](signals.md).

**NOTE:** When this signal is sent, all queued signals will be treated at once, so the instructions following the sending of this signal may not be ran until quite a bit of time in the worst scenario.

**WARNING:** Signals will not be treated until this syscall is sent by the process!

## `0x10` GET_PID

Arguments: -  
Return value: Current process' PID (8 bytes)  
Errors: -

Get the current process' PID.

## `0x12` SUSPEND

Arguments: -  
Return value: Amount of time the process was suspended, in milliseconds (8 bytes)  
Errors: `0x10` if the current process is not an application process

[Suspend](../features/balancer.md#application-processes-suspension) the current process.

## `0x13` EXIT

Arguments: -  
Return value: - (never)  
Errors: -

Kill the current process.

A [`SERVICE_CLIENT_CLOSED`](signals.md#0x32-service_client_closed) signal is sent to all services connection the process has.  
If the current process is a service, a [`SERVICE_CLOSED`](signals.md#0x20-service_closed) signal is sent to all active clients.

## `0x20` CONNECT_SERVICE

Arguments: null-terminated application's [AID](../concepts/applications.md#application-identifier) (256 bytes)
Return value:

- Unique connection ID (8 bytes)
- [Pipe](ipc.md#pipes) SC identifier (8 bytes)
- [Pipe](ipc.md#pipes) RC identifier (8 bytes)

Errors:

- `0x10`: the provided AID does not exist
- `0x11`: target application does not have a service
- `0x12`: failed to send the [`SERVICE_CONN_REQUEST`](signals.md#0x30-service_conn_request) due to a [double handler fault](signals.md#0x01-handler_fault)
- `0x20`: service rejected the connection request

Ask a service to etablish connection. The current process is called the service's _client_.

**NOTE:** When this signal is sent, the service's answer will be waited, so the instructions following the sending of this signal may not be ran until several seconds in the worst scenario.

## `0x21` END_SERVICE_CONN

Arguments: unique connection ID (8 bytes)  
Return value: -  
Errors:

- `0x10`: the provided connection ID does not exist
- `0x11`: this connection was already closed
- `0x12`: the associated service thread already terminated

Tell a service to properly close the connection. The associated [pipe](ipc.md#pipes) SC and RC channels will immediatly be closed.

## `0x30` ACCEPT_SERVICE_CONN

Arguments: connection's unique request ID (8 bytes)  
Return value:

- `0x00` if the current process is now the associated client's thread, `0x01` else
- [Pipe](ipc.md#pipes) RC identifier (8 bytes)
- [Pipe](ipc.md#pipes) SC identifier (8 bytes)

Errors:

- `0x10`: this request ID does not exist
- `0x11`: answer was given after the delay set in the [registry](registry.md)'s `system.signals.service_answer_delay` key (default: 1000ms)
- `0x12`: the process which requested the connection already terminated

Confirm the current service accepts the connection with a client.
A dedicated pipe's SC and another's RC will be provided to communicate with the client.

This will create a new [client thread](services.md#thread-types) in the current process, which is meant to be dedicated to this specific client.
The client thread will not receive any [`SERVICE_CONN_REQUEST`](signals.md#0x30-service_conn_request) signal, only [dispatcher thread](services.md#thread-types) will.

When the associated client terminates, the [`SERVICE_CLIENT_CLOSED`](signals.md#0x32-service_client_closed) signal is sent to this thread.

## `0x31` REJECT_SERVICE_CONN

Arguments: connection's unique request ID (8 bytes)  
Return value: -

Errors:

- `0x10`: this request ID does not exist
- `0x11`: answer was given after the delay set in the [registry](registry.md)'s `system.signals.service_answer_delay` key (default: 1000ms)
- `0x12`: the process which requested the connection already terminated

Reject a connection request to the current service.

## `0x40` OPEN_WRITE_PIPE

Arguments:

- Target process' PID (8 bytes)
- Command code (2 bytes)
- Buffer size multiplier (1 byte)
- Mode (1 byte): `0x01` to create a message pipe, `0x02` to create a raw pipe

Return value: [Pipe](ipc.md#pipes) SC identifier (8 bytes)

Errors:

- `0x10`: invalid mode provided
- `0x11`: the provided PID does not exist
- `0x12`: the target process is not part of this application
- `0x13`: the target process runs under another user
- `0x14`: the target process does not have a handler registered for the [`RECV_READ_PIPE`](signals.md#0x40-recv_read_pipe) signal

Open a PIPE with a process of the same application and running under the same user and get its SC.
The buffer size multiplier indicates the size of the pipe's buffer, multiplied by 64 KB. The default (`0`) falls back to a size of 64 KB.
The command code can be used to indicate to the target process which action is expected from it. It does not follow any specific format.
The target process will receive the [`RECV_READ_PIPE`](signals.md#0x40-recv_read_pipe) signal with the provided command code.

## `0x41` OPEN_READ_PIPE

Arguments:

- Target process' PID (8 bytes)
- Command code (2 bytes)
- Buffer size multiplier (1 byte)
- Mode (1 byte): `0x01` to create a message pipe, `0x02` to create a raw pipe

Return value: [Pipe](ipc.md#pipes) RC identifier (8 bytes)

Errors:

- `0x10`: invalid mode provided
- `0x11`: the provided PID does not exist
- `0x12`: the target process is not part of this application
- `0x13`: the target process runs under another user
- `0x14`: the target process does not have a handler registered for the [`RECV_WRITE_PIPE`](signals.md#0x41-recv_write_pipe) signal

Open a PIPE with a process of the same application and running under the same user and get its RC.
The buffer size multiplier indicates the size of the pipe's buffer, multiplied by 64 KB. The default (`0`) falls back to a size of 64 KB.
The command code can be used to indicate to the target process which action is expected from it. It does not follow any specific format.
The target process will receive the [`RECV_WRITE_PIPE`](signals.md#0x41-recv_write_pipe) signal with the provided command code.

## `0x42` PIPE_WRITE

Arguments:

- [Pipe](ipc.md#pipes) SC identifier (8 bytes)
- Number of bytes to write (CPU-dependent size)
- Pointer to a readable buffer (CPU-dependent size)
- Mode (1 byte):
  - `0x00` = block until there is enough space to write
  - `0x01` = fail if there is not enough space to write or if the pipe is locked
  - `0x02` = write as much as possible

Return value:

- If mode is `0x00`: remaining capacity of the pipe
- If mode is `0x01`: `0x00` if the cause of failure was because the pipe was locked, `0x01` if it was because of of a lack of space in the target buffer
- If mode is `0x02`: number of bytes written

Errors:

- `0x10`: invalid mode provided
- `0x11`: the provided SC identifier does not exist
- `0x12`: the provided SC was already closed
- `0x13`: the provided SC refers to a message pipe but the provided size is larger than 64 KB
- `0x14`: the provided SC refers to a message pipe but the `0x02` mode was provided
- `0x15`: there is not enough space in the pipe to write all the provided data and the mode argument was set to `0x01`

Write data through a pipe.  
Messages will always be sent at once when writing to message pipes.  
If the data is 0-byte long, this pipe will return successfully without waiting, even if the target pipe's buffer is full or locked.

## `0x43` PIPE_COUNT_WRITE

Arguments: [Pipe](ipc.md#pipes) SC identifier (8 bytes)
Return value: number of bytes that can be written to a pipe

Errors:

- `0x10`: the provided SC identifier does not exist
- `0x11`: the provided SC was already closed

Count the pipe's pending data's free size, which is the number of bytes this process can currently write to the pipe without blocking.

## `0x44` PIPE_READ

Arguments:

- [Pipe](ipc.md#pipes) RC identifier (8 bytes)
- Mode (1 byte):
  - `0x00` = block until there are enough data to read
  - `0x01` = fail if there is not enough data to read or if the pipe is locked
  - `0x02` = read as much as possible
- Number of bytes to read with `0` meaning to read as much data possible (2 bytes)
- Pointer to a writable buffer (CPU-dependent size)

Return value:

- If mode is `0x00`: remaining bytes in the buffer
- If mode is `0x01`: `0x00` if the cause of failure was because the pipe was locked, `0x01` if it was because of of a lack of space in the target buffer
- If mode is `0x02`: number of read bytes

Errors:

- `0x10`: invalid mode provided
- `0x11`: the provided RC identifier does not exist
- `0x12`: the provided RC was already closed
- `0x13`: there is no pending data in the pipe and the mode argument was set to `0x01`
- `0x14`: the provided RC refers to a message pipe but the `0x02` mode was provided

Read pending data or message from a pipe.

## `0x45` PIPE_COUNT_READ

Arguments: [Pipe](ipc.md#pipes) RC identifier (8 bytes)
Return value: number of bytes that can be read from the pipe

Errors:

- `0x10`: the provided RC identifier does not exist
- `0x11`: the provided RC was already closed

Count the pipe's pending data's size, which is the number of bytes this process can currently read from the pipe without blocking.

## `0x46` CLOSE_PIPE

Arguments: [Pipe](ipc.md#pipes) RC or SC identifier (8 bytes)  
Return value: -

Errors:

- `0x10`: the provided RC/SC identifier does not exist
- `0x11`: the target process already terminated
- `0x20`: the provided RC/SC identifier is part of a service PIPE

Close an PIPE properly. The RC and SC parts will be immediatly closed.
The other process this PIPE was shared with will receive the [`PIPE_CLOSED`](signals.md#0x42-pipe_closed) signal.
If this syscall is not performed on an PIPE before the process exits, the other process will receive the same signal with a specific argument to indicate the communication was brutally interrupted.

## `0x47` PIPE_INFO

Arguments: [Pipe](ipc.md#pipes) RC or SC identifier (8 bytes)
Return value: (1 byte)

- Bit 0 (strongest): indicates if the pipe is opened
- Bit 1: indicates if the pipe is a message pipe
- Bit 2: indicates if the pipe's buffer is full
- Bit 3: indicates if the pipe is locked
- Bit 4: indicates if a writing request is pending (waiting for the pipe to be unlocked)
- Bit 5: indicates if a reading request is pending (waiting for the pipe to be unlocked)
- Bit 6: indicates if the provided identifier is an SC

Get informations on a pipe from its RC or SC identifier.

## `0x50` MEM_ALLOC

Arguments:

- Pointer to the start address to map the allocated memory to (CPU-dependent size)
- The number of [pages](kernel/memory.md#pages) to allocate

Return value: -

Errors:

- `0x10`: the provided start address is out of the process' range
- `0x11`: the provided size, added to the start address, would exceed the process' range
- `0x12`: the kernel could not find a linear block of memory of the requested size

Allocate a linear block of memory.

## `0x51` MEM_UNALLOC

Arguments:

- Pointer to the start address to unallocate the memory from (CPU-dependent size)
- The number of [pages](kernel/memory.md#pages) to unallocate

Return value: -

Errors:

- `0x10`: the provided start address is out of the process' range
- `0x11`: the provided size, added to the start address, would exceed the process' range

Unallocate a linear block of memory.
