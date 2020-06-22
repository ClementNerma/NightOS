# System calls

_System calls_, abbreviated _syscalls_, are the first type of [KPC](kernel/kpc.md). They allow a process to ask the kernel to perform an action.

A syscall is made of a 8-bit code, as well as up to 8 arguments with up to 64-bit value each.  
When performing a syscall, the process will put in a specific CPU register an address poiting to a memory address containing in a row the syscall's code and its arguments. For most syscalls, code and arguments will be not be longer than 128 bits, but some may use larger arguments.

Some syscalls require the process to send a buffer of data. In such case, the process simply provides a pointer to the said buffer - so the argument's size will vary depending on the length of memory addresses.

After preparing the syscall's code and arguments, the process raises a specific exception that is caught by the kernel. When the syscall is complete, the kernel puts the result values in specific registers and resumes the process. This means that **all syscalls are synchronous**.

System calls always return two numbers: a 8-bit one (errcode) and a 8 bytes one (result code). If the errcode is not null, then an error occured during the syscall. The specific value indicate the encountered type of error:

- `0x00`: cannot read syscall's code or arguments (error while reading memory)
- `0x01`: the requested syscall does not exist
- `0x02`: at least one argument is invalid (e.g. providing a pointer to the `0` address)

Errors are encoded this way:

- `0x00` to `0x0F`: generic errors (see above)
- `0x10` to `0x1F`: invalid arguments provided (e.g. value is too high)
- `0x20` to `0x2F`: arguments are not valid in the current context (e.g. provided ID does not exist)
- `0x30` to `0x3F`: resource errors (e.g. file not found)
- `0x40` to `0xFF`: other types of errors

Note that advanced actions like permissions management or filesystem access are achieved through the use of [IPC](ipc.md).

You can find below the exhaustive list of system calls.

_NOTE:_ _"CPU-dependent size"_ indicates a data that will be 16-bit long on a 16-bit CPU, 32-bit long on a 32-bit CPU, and so on.

## `0x01` HANDLE_SIGNAL

**Arguments:**

- Code of the signal to handle (1 byte)
- Pointer to the handler function (CPU-dependent size)

**Return value:**

_Empty_

**Errors:**

- `0x10`: The requested signal does not exist

**Description:**

Register a [signal handler](signals.md).  
If the address pointed by this syscall's is not executable by the current process when this signal is sent to the process, the signal will be converted to an [`HANDLER_FAULT`](signals.md#0x01-handler_fault) signal instead.

## `0x02` UNHANDLE_SIGNAL

**Arguments:**

- Code of the signal to stop handling (1 byte)

**Return value:**

_Empty_

**Errors:**

- `0x10`: The requested signal does not exist
- `0x20`: The requested signal does not have an handler

**Description:**

Unregister a signal handler, falling back to the default signal reception behaviour if this signal is sent to the process.

## `0x03` IS_SIGNAL_HANDLED

**Arguments:**

- Code of the signal (1 byte)

**Return value:**

- `0` if the signal is not handled, `1` if it is (1 byte)

**Errors:**

- `0x10`: The requested signal does not exist

**Description:**

Check if a signal has a registered handler.

## `0x04` READY

**Arguments:**

_None_

**Return value:**

_Empty_

**Errors:**

- `0x20`: The process already told it was ready

**Description:**

Indicate the system this process has set up all its event listeners, so it can start dequeuing [signals](signals.md).

**NOTE:** When this signal is sent, all queued signals will be treated at once, so the instructions following the sending of this signal may not be ran until quite a bit of time in the worst scenario.

**WARNING:** Signals will not be treated until this syscall is sent by the process!

## `0x10` GET_PID

**Arguments:**

_None_

**Return value:**

- Current process' PID (8 bytes)

**Errors:**

_None_

**Description:**

Get the current process' PID.

## `0x12` SUSPEND

**Arguments:**

_None_

**Return value:**

- Amount of time the process was suspended, in milliseconds (8 bytes)

**Errors:**

- `0x20`: the current process is not an application process

**Description:**

[Suspend](../features/balancer.md#application-processes-suspension) the current process.

## `0x13` EXIT

**Arguments:**

_None_

**Return value:**

_None_ (never returns)

**Errors:**

_None_

**Description:**

Kill the current process.

A [`SERVICE_CLIENT_CLOSED`](signals.md#0x2b-service_client_closed) signal is sent to all services connection the process has.  
If the current process is a service, a [`SERVICE_SERVER_QUITTED`](signals.md#0x2d-service_server_quitted) signal is sent to all active clients.

## `0x20` OPEN_PIPE

**Arguments:**

- Target process' PID (8 bytes)
- Command code (2 bytes)
- Pipe type (1 byte): `0x00` to create a write pipe, `0x01` to create a read pipe
- Buffer size multiplier (1 byte)
- Transmission mode (1 byte): `0x00` to create a raw pipe, `0x01` to create a message pipe
- Notification mode (1 byte): `0x00` to notify the process with the [`RECV_PIPE`](signals.md#0x20-recv_pipe) signal, `0x01` to skip it
- Size hint in bytes (8 bytes), with `0` being the 'no size hint' value

**Return value:**

- [Pipe](ipc.md#pipes) SC identifier (8 bytes)

**Errors:**

- `0x10`: Invalid transmission mode provided
- `0x11`: Invalid notification mode provided
- `0x20`: The provided PID does not exist
- `0x21`: The target process is not part of this application
- `0x22`: The target process runs under another user
- `0x23`: Notification mode is enabled but the target process does not have a handler registered for the [`RECV_PIPE`](signals.md#0x20-recv_pipe) signal

**Description:**

Open a pipe with a process of the same application and running under the same user and get its SC.  
The buffer size multiplier indicates the size of the pipe's buffer, multiplied by 64 KB. The default (`0`) falls back to a size of 64 KB.  
The command code can be used to indicate to the target process which action is expected from it. It does not follow any specific format.  
The target process will receive the SC/RC's counterpart through the [`RECV_PIPE`](signals.md#0x20-recv_pipe) signal, unless notification mode states otherwise.

## `0x21` SEND_PIPE

**Arguments:**

- [Pipe](ipc.md#pipes) RC or SC identifier (8 bytes)
- Target PID (8 bytes)
- Notification mode (1 byte): `0x00` to notify the process with a pipe reception signal, `0x01` to skip the signal

**Return value:**

_None_

**Errors:**

- `0x10`: Notification mode is enabled but the target process does not have a handler registered for the [`RECV_PIPE`](signals.md#0x20-recv_pipe) signal

**Description:**

Share an RC or SC identifier with another process.  
This will trigger in the target process the [`RECV_PIPE`](signals.md#0x20-recv_pipe) signal, unless the notification mode tells otherwise.

When the target process writes through the received SC or read from the received RC, the performance will be equal to writing or reading through the original RC/SC identifier.

## `0x22` PIPE_WRITE

**Arguments:**

- [Pipe](ipc.md#pipes) SC identifier (8 bytes)
- Number of bytes to write (CPU-dependent size)
- Pointer to a readable buffer (CPU-dependent size)
- Mode (1 byte): `0x00` = block until there is enough space to write, `0x01` = fail if there is not enough space to write or if the pipe is locked, `0x02` = write as much as possible

**Return value:**

Encoded on 4 bytes:

- If mode is `0x00`: remaining capacity of the pipe
- If mode is `0x01`: `0x00` if the cause of failure was because the pipe was locked, `0x01` if it was because of of a lack of space in the target buffer
- If mode is `0x02`: number of bytes written

**Errors:**

- `0x10`: Invalid mode provided
- `0x20`: The provided SC identifier does not exist
- `0x21`: The provided SC was already closed
- `0x22`: The provided SC refers to a message pipe but the provided size is larger than 64 KB
- `0x23`: The provided SC refers to a message pipe but the `0x02` mode was provided
- `0x30`: There is not enough space in the pipe to write all the provided data and the mode argument was set to `0x01`

**Description:**

Write data through a pipe.  
Messages will always be sent at once when writing to message pipes.  
If the data is 0-byte long, this pipe will return successfully without waiting, even if the target pipe's buffer is full or locked.

## `0x23` PIPE_READ

**Arguments:**

- [Pipe](ipc.md#pipes) RC identifier (8 byte)
- Mode (1 byte): `0x00` = block until there are enough data to read, `0x01` = fail if there is not enough data to read or if the pipe is locked, `0x02` = read as much as possible
- Number of bytes to read (4 bytes): `0` = read as much data as possible
- Pointer to a writable buffer (CPU-dependent size)

**Return value:**

Encoded on 4 bytes:

- If mode is `0x00`: remaining bytes in the buffer
- If mode is `0x01`: `0x00` if the cause of failure was because the pipe was locked, `0x01` if it was because of of a lack of space in the target buffer
- If mode is `0x02`: number of read bytes

**Errors:**

- `0x10`: Invalid mode provided
- `0x20`: The provided RC identifier does not exist
- `0x21`: The provided RC was already closed
- `0x22`: There is no pending data in the pipe and the mode argument was set to `0x01`
- `0x23`: The provided RC refers to a message pipe but the `0x02` mode was provided

**Description:**

Read pending data or message from a pipe.  
If the pipe was closed while the buffer was not empty, this syscall will still be able to read the remaining buffer's data - but the pipe will not be able to receive any additional data. Then, once the buffer is empty, the pipe will be made unavailable.

## `0x24` PIPE_INFO

**Arguments:**

- [Pipe](ipc.md#pipes) RC or SC identifier (8 bytes)

**Return value:**

- Status (1 byte):
  - Bit 0 (strongest): indicates if the pipe is opened
  - Bit 1: indicates if the pipe is a message pipe
  - Bit 2: indicates if the pipe's buffer is full
  - Bit 3: indicates if the pipe is locked
  - Bit 4: indicates if a writing request is pending (waiting for the pipe to be unlocked)
  - Bit 5: indicates if a reading request is pending (waiting for the pipe to be unlocked)
  - Bit 6: indicates if the provided identifier is an SC
- Pipe's buffer's capacity (8 bytes)
- Remaining data before the pipe's buffer is full (8 bytes)
- Pipe's creator's PID (8 bytes)

**Errors:**

_None_

**Description:**

Get informations on a pipe from its RC or SC identifier.

## `0x25` CLOSE_PIPE

**Arguments:**

- [Pipe](ipc.md#pipes) RC or SC identifier (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x10`: The provided RC/SC identifier does not exist
- `0x11`: The target process already terminated
- `0x20`: The provided RC/SC identifier is part of a service pipe

**Description:**

Close a pipe properly. The RC and SC parts will be immediatly closed.  
The other process this pipe was shared with will receive the [`PIPE_CLOSED`](signals.md#0x21-pipe_closed) signal unless this pipe was created during a [service connection](#0x2c-accept_service_conn).  
If this syscall is not performed on a pipe before the process exits, the other process will receive the same signal with a specific argument to indicate the communication was brutally interrupted.

## `0x2A` CONNECT_SERVICE

**Arguments:**

- Target application's [ANID](../concepts/applications.md#application-identifier) (4 bytes)
- Command code (2 bytes)

**Return value:**

- Unique connection ID (8 bytes)
- [Pipe](ipc.md#pipes) SC identifier (8 bytes)
- [Pipe](ipc.md#pipes) RC identifier (8 bytes)

**Errors:**

- `0x10`: The provided ANID does not exist
- `0x20`: Target application does not [expose a service](../concepts/applications.md#services)
- `0x30`: Failed to send the [`SERVICE_CONN_REQUEST`](signals.md#0x2a-service_conn_request) due to a [double handler fault](signals.md#0x01-handler_fault)
- `0x31`: Service rejected the connection request

**Description:**

Ask a service to etablish connection. The current process is called the service's _client_.

**NOTE:** When this signal is sent, the service's answer will be waited, so the instructions following the sending of this signal may not be ran until several seconds in the worst scenario.

## `0x2B` END_SERVICE_CONN

**Arguments:**

- Unique connection ID (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x10`: The provided connection ID does not exist
- `0x20`: This connection was already closed
- `0x21`: The associated service thread already terminated

**Description:**

Tell a service to properly close the connection. The associated [pipe](ipc.md#pipes) SC and RC channels will immediatly be closed.

## `0x2C` ACCEPT_SERVICE_CONN

**Arguments:**

- Connection's unique request ID (8 bytes)

**Return value:**

- `0x00` if the current process is now the associated client's thread, `0x01` else
- [Pipe](ipc.md#pipes) RC identifier (8 bytes)
- [Pipe](ipc.md#pipes) SC identifier (8 bytes)

**Errors:**

- `0x10`: This request ID does not exist
- `0x20`: The process which requested the connection already terminated
- `0x30`: Answer was given after the delay set in the [registry](registry.md)'s `system.signals.service_answer_delay` key (default: 1000ms)

**Description:**

Confirm the current service accepts the connection with a client.  
A dedicated message pipe's SC and another's RC will be provided to communicate with the client.

This will create a new [client thread](services.md#thread-types) in the current process, which is meant to be dedicated to this specific client.  
The client thread will not receive any [`SERVICE_CONN_REQUEST`](signals.md#0x2a-service_conn_request) signal, only [dispatcher thread](services.md#thread-types) will.

When the associated client terminates, the [`SERVICE_CLIENT_CLOSED`](signals.md#0x2b-service_client_closed) signal is sent to this thread.

## `0x2D` REJECT_SERVICE_CONN

**Arguments:**

- Connection's unique request ID (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x10`: This request ID does not exist
- `0x20`: The process which requested the connection already terminated
- `0x30`: Answer was given after the delay set in the [registry](registry.md)'s `system.signals.service_answer_delay` key (default: 1000ms)

**Description:**

Reject a connection request to the current service.

## `0x30` MEM_ALLOC

**Arguments:**

- Pointer to the start address to map the allocated memory to (CPU-dependent size)
- The number of [pages](kernel/memory.md#pages) to allocate (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x10`: The provided start address is out of the process' range
- `0x11`: The provided size, added to the start address, would exceed the process' range
- `0x30`: The kernel could not find a linear block of memory of the requested size

**Description:**

Allocate a linear block of memory.

## `0x31` MEM_UNALLOC

**Arguments:**

- Pointer to the start address to unallocate the memory from (CPU-dependent size)
- The number of [pages](kernel/memory.md#pages) to unallocate (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x10`: The provided start address is out of the process' range
- `0x11`: The provided size, added to the start address, would exceed the process' range

**Description:**

Unallocate a linear block of memory.

## `0x32` SHARE_MEM

**Arguments:**

- Target process' PID (8 bytes)
- Pointer to the buffer to share (CPU-dependent size)
- Number of bytes to share (CPU-dependent size)
- Command code (2 bytes)
- Notification mode (1 byte): `0x00` to notify the process with the [`RECV_SHARED_MEM`](signals.md#0x32-recv_shared_mem) signal, `0x01` to skip it
- Sharing mode (1 byte): `0x00` to perform a mutual sharing, `0x01` to perform an exclusive sharing
- Access permissions (1 byte): Strongest bit for read, next for write, next for exec - other bits are considered invalid when set

**Return value:**

- Shared memory segment ID (8 bytes)

**Errors:**

- `0x10`: Invalid notification mode provided
- `0x11`: Invalid sharing mode provided
- `0x12`: Invalid access permissions provided
- `0x13`: Access permissions were not set but the sharing mode is set to mutual
- `0x14`: Access permissions were provided but the sharing mode is set to exclusive
- `0x15`: The buffer's start address is not aligned with a page
- `0x16`: The buffer's length is not a multiple of a page's size
- `0x17`: The buffer's size is null (0 bytes)
- `0x30`: There is not enough contiguous space in the receiver process' memory space to map the shared memory

**Description:**

Share memory pages of the current process with one or multiple external processes.  
In mutual sharing mode, the memory is available to both the sharer and the receiver. In exclusive mode, the memory is unmapped from the sharer process.  
The provided access permissions indicates how the receiver process will be able to access the shared memory when sharing in mutual mode.  
This will trigger in the target process the [`RECV_SHARED_MEM`](signals.md#0x32-recv_shared_mem) with the provided command code, unless the notification mode states otherwise.

When a process wants to transmit a set of data without getting it back later, the exclusive mode is to prefer. When the data needs to be accessed back by the sharer, the mutual mode should be used instead.

## `0x33` UNSHARE_MEM

**Arguments:**

- Shared memory segment ID (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x10`: Unknown shared memory segment ID provided
- `0x20`: Provided sharing ID is exclusive

**Description:**

Stop sharing a memory segment started by [`SHARE_MEM`](#0x32-share_mem). Note that only mutual sharing can be unmapped.  
This will trigger in the target process the [`UNSHARED_MEM`](signals.md#0x33-unshared_mem) signal.

## `0x34` MEM_SHARING_INFO

**Arguments:**

- Shared memory segment ID (8 bytes)

**Return value:**

- Sharer process' PID (8 bytes)
- Receiver process' PID (8 bytes)
- Sharing mode (1 byte): `0x00` for mutual mode, `0x01` for exclusive mode
- Shared buffer's start address (CPU-dependent size)
- Sharer buffer's length (CPU-dependent size)
- Command code (2 bytes)
- Access permissions (1 byte): for mutual sharings, strongest bit for read, next for write, next for exec ; for exclusive sharings, `0x00`

**Errors:**

- `0x10`: Unknwon shared memory segment ID provided

**Description:**

Get informations about a shared memory segment.
