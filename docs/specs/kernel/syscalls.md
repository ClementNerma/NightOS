# System calls

_System calls_, abbreviated _syscalls_, are a type of [KPC](kpc.md). They allow a process to ask the kernel to perform an action.

- [Technical overview](#technical-overview)
- [List of syscalls](#list-of-syscalls)
  - [`0x01` HANDLE_SIGNAL](#0x01-handle_signal)
  - [`0x02` UNHANDLE_SIGNAL](#0x02-unhandle_signal)
  - [`0x03` IS_SIGNAL_HANDLED](#0x03-is_signal_handled)
  - [`0x04` READY](#0x04-ready)
  - [`0x20` OPEN_PIPE](#0x20-open_pipe)
  - [`0x21` SEND_PIPE](#0x21-send_pipe)
  - [`0x22` PIPE_WRITE](#0x22-pipe_write)
  - [`0x23` PIPE_READ](#0x23-pipe_read)
  - [`0x24` PIPE_INFO](#0x24-pipe_info)
  - [`0x25` CLOSE_PIPE](#0x25-close_pipe)
  - [`0x26` OPEN_SERV_SOCK](#0x26-open_serv_sock)
  - [`0x27` SEND_SOCK_MSG](#0x27-send_sock_msg)
  - [`0x28` READ_SOCK_MSG](#0x28-read_sock_msg)
  - [`0x29` CLOSE_SERV_SOCK](#0x29-close_serv_sock)
  - [`0x2A` CONNECT_SERVICE](#0x2a-connect_service)
  - [`0x2B` END_SERVICE_CONN](#0x2b-end_service_conn)
  - [`0x2C` ACCEPT_SERVICE_CONN](#0x2c-accept_service_conn)
  - [`0x2D` REJECT_SERVICE_CONN](#0x2d-reject_service_conn)
  - [`0x2E` HAS_SCOPED_SERVICE](#0x2e-has_scoped_service)
  - [`0x30` MEM_ALLOC](#0x30-mem_alloc)
  - [`0x31` MEM_FREE](#0x31-mem_free)
  - [`0x32` VIRT_MEM_AMS](#0x32-virt_mem_ams)
  - [`0x33` BACKED_AMS](#0x33-backed_ams)
  - [`0x34` DEVICE_AMS](#0x34-device_ams)
  - [`0x35` SHARE_AMS](#0x35-share_ams)
  - [`0x36` AMS_SHARING_INFO](#0x36-ams_sharing_info)
  - [`0x37` UNSHARE_AMS](#0x37-unshare_ams)
  - [`0x38` MAP_AMS](#0x38-map_ams)
  - [`0x39` UNMAP_AMS](#0x39-unmap_ams)
  - [`0x3A` SET_DMA_MEM_ACCESS](#0x3a-set_dma_mem_access)
  - [`0x40` CREATE_PROCESS](#0x40-create_process)
  - [`0x41` WAIT_CHILD_PROCESS](#0x41-wait_child_process)
  - [`0x42` KILL_CHILD_PROCESS](#0x42-kill_child_process)
  - [`0x43` GET_PID](#0x43-get_pid)
  - [`0x44` SUSPEND](#0x44-suspend)
  - [`0x45` UNSUSPEND](#0x45-unsuspend)
  - [`0x46` HAND_OVER](#0x46-hand_over)
  - [`0x4F` EXIT](#0x4f-exit)
  - [`0x50` CREATE_THREAD](#0x50-create_thread)
  - [`0x51` CREATE_TLS_SLOT](#0x51-create_tls_slot)
  - [`0x52` READ_TLS_SLOT](#0x52-read_tls_slot)
  - [`0x53` WRITE_TLS_SLOT](#0x53-write_tls_slot)
  - [`0x54` DELETE_TLS_SLOT](#0x54-delete_tls_slot)
  - [`0x5F` EXIT_THREAD](#0x5f-exit_thread)
  - [`0xA0` EXECUTION_CONTEXT](#0xa0-execution_context)
  - [`0xD0` SYS_CREATE_PROCESS](#0xd0-sys_create_process)
  - [`0xD1` SYS_MANAGE_PROCESS](#0xd1-sys_manage_process)
  - [`0xD2` SYS_PROCESS_ATTRIBUTES](#0xd2-sys_process_attributes)
  - [`0xD3` SYS_SET_PRIORITY](#0xd3-sys_set_priority)
  - [`0xD4` SYS_ENUM_DEVICES](#0xd4-sys_enum_devices)
  - [`0xD5` SYS_DEVICE_INFOS](#0xd5-sys_device_infos)

## Technical overview

Syscalls are performed using CPU interruptions to notify the kernel.

A syscall is made of a 8-bit code, as well as up to 8 arguments with up to 64-bit value each.  
When performing a syscall, the process will put in a specific CPU register an address poiting to a memory address containing in a row the syscall's code and its arguments. For most syscalls, code and arguments will be not be longer than 128 bits, but some may use larger arguments.

Some syscalls require the process to send a buffer of data. In such case, the process simply provides a pointer to the said buffer - so the argument's size will vary depending on the length of memory addresses.

After preparing the syscall's code and arguments, the process raises a specific exception that is caught by the kernel. When the syscall is complete, the kernel puts the result values in specific registers and resumes the process. This means that **all syscalls are synchronous**.

System calls always return two numbers: a 8-bit one (errcode) and a 8 bytes one (return value). If the errcode is not null, then an error occured during the syscall. The specific value indicate the encountered type of error:

- `0x00`: cannot read syscall's code or arguments (error while reading memory)
- `0x01`: the requested syscall does not exist
- `0x02`: at least one argument is invalid (e.g. providing a pointer to the `0` address)
- `0x03`: unmapped memory pointer (e.g. provided a pointer to a memory location that is not mapped yet)
- `0x04`: memory permission error (e.g. provided a writable buffer to an allocated but non-writable memory address)

Errors are encoded this way:

- `0x00` to `0x0F`: generic errors (see above)
- `0x10` to `0x1F`: invalid arguments provided (e.g. value is too high)
- `0x20` to `0x2F`: arguments are not valid in the current context (e.g. provided ID does not exist)
- `0x30` to `0x3F`: resource errors (e.g. file not found)
- `0x40` to `0xFF`: other types of errors

System calls' code are categorized as follows:

- `0x00` to `0x0F`: signal handling
- `0x10` to `0x1F`: process management
- `0x20` to `0x29`: pipes
- `0x2A` to `0x2F`: services communication
- `0x30` to `0x3F`: memory management
- `0x40` to `0x4F`: processes management
- `0x50` to `0x5F`: threads management
- `0xA0` to `0xAF`: applications-related syscalls
- `0xD0` to `0xDF`: reserved to system services

Note that advanced actions like permissions management or filesystem access are achieved through the use of [IPC](ipc.md).

## List of syscalls

You can find below the exhaustive list of system calls.

### `0x01` HANDLE_SIGNAL

Register a [signal handler](signals.md).  
If the address pointed by this syscall's is not executable by the current process when this signal is sent to the process, the signal will be converted to an [`HANDLER_FAULT`](signals.md#0x01-handler_fault) signal instead.

**Arguments:**

- Code of the signal to handle (1 byte)
- Pointer to the handler function (8 bytes)

**Return value:**

_Empty_

**Errors:**

- `0x10`: The requested signal does not exist

### `0x02` UNHANDLE_SIGNAL

Unregister a signal handler, falling back to the default signal reception behaviour if this signal is sent to the process.

**Arguments:**

- Code of the signal to stop handling (1 byte)

**Return value:**

_Empty_

**Errors:**

- `0x10`: The requested signal does not exist
- `0x20`: The requested signal does not have an handler

### `0x03` IS_SIGNAL_HANDLED

Check if a signal has a registered handler.

**Arguments:**

- Code of the signal (1 byte)

**Return value:**

- `0` if the signal is not handled, `1` if it is (1 byte)

**Errors:**

- `0x10`: The requested signal does not exist

### `0x04` READY

Indicate the system this process has set up all its event listeners, so it can start dequeuing [signals](signals.md).

**NOTE:** When this signal is sent, all queued signals will be treated at once, so the instructions following the sending of this signal may not be ran until quite a bit of time in the worst scenario.

**WARNING:** Signals will not be treated until this syscall is sent by the process!

**Arguments:**

_None_

**Return value:**

_Empty_

**Errors:**

- `0x20`: The process already told it was ready

### `0x20` OPEN_PIPE

Open a pipe with a process of the same application and running under the same user and get its SC.  
The buffer size multiplier indicates the size of the pipe's buffer, multiplied by 64 KB. The default (`0`) falls back to a size of 64 KB.  
The command code can be used to indicate to the target process which action is expected from it. It does not follow any specific format.  
The target process will receive the SC/RC's counterpart through the [`RECV_PIPE`](signals.md#0x20-recv_pipe) signal, unless notification mode states otherwise.

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

### `0x21` SEND_PIPE

Share an RC or SC identifier with another process.  
This will trigger in the target process the [`RECV_PIPE`](signals.md#0x20-recv_pipe) signal, unless the notification mode tells otherwise.

When the target process writes through the received SC or read from the received RC, the performance will be equal to writing or reading through the original RC/SC identifier.

**Arguments:**

- [Pipe](ipc.md#pipes) RC or SC identifier (8 bytes)
- Target PID (8 bytes)
- Notification mode (1 byte): `0x00` to notify the process with a pipe reception signal, `0x01` to skip the signal

**Return value:**

_None_

**Errors:**

- `0x10`: Notification mode is enabled but the target process does not have a handler registered for the [`RECV_PIPE`](signals.md#0x20-recv_pipe) signal

### `0x22` PIPE_WRITE

Write data through a pipe.  
Messages will always be sent at once when writing to message pipes.  
If the data is 0-byte long, this pipe will return successfully without waiting, even if the target pipe's buffer is full or locked.

**Arguments:**

- [Pipe](ipc.md#pipes) SC identifier (8 bytes)
- Number of bytes to write (4 bytes)
- Pointer to a readable buffer (8 bytes)
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

### `0x23` PIPE_READ

Read pending data or message from a pipe.  
If the pipe was closed while the buffer was not empty, this syscall will still be able to read the remaining buffer's data - but the pipe will not be able to receive any additional data. Then, once the buffer is empty, the pipe will be made unavailable.

**Arguments:**

- [Pipe](ipc.md#pipes) RC identifier (8 byte)
- Mode (1 byte): `0x00` = block until there are enough data to read, `0x01` = fail if there is not enough data to read or if the pipe is locked, `0x02` = read as much as possible
- Number of bytes to read (4 bytes): `0` = read as much data as possible
- Pointer to a writable buffer (8 bytes)

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

### `0x24` PIPE_INFO

Get informations on a pipe from its RC or SC identifier.

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

### `0x25` CLOSE_PIPE

Close a pipe properly. The RC and SC parts will be immediatly closed.  
The other process this pipe was shared with will receive the [`PIPE_CLOSED`](signals.md#0x21-pipe_closed) signal unless this pipe was created during a [service connection](#0x2c-accept_service_conn).  
If this syscall is not performed on a pipe before the process exits, the other process will receive the same signal with a specific argument to indicate the communication was brutally interrupted.

**Arguments:**

- [Pipe](ipc.md#pipes) RC or SC identifier (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x10`: The provided RC/SC identifier does not exist
- `0x11`: The target process already terminated
- `0x20`: The provided RC/SC identifier is part of a service pipe

### `0x26` OPEN_SERV_SOCK

Open a [service socket](ipc.md#service-sockets).  
Triggers the [`RECV_SERV_SOCK`](signals.md#0x26-recv_serv_sock) signal on the receiver process' side.

**Arguments:**

- Client process PID (8 bytes)
- Buffer size multiplier by 4 KB (2 bytes) - `0` fall backs to 4KB

**Return value:**

- Socket identifier (8 bytes)

### `0x27` SEND_SOCK_MSG

Send a message through a [service socket exchange](ipc.md#exchanges-and-messages).  
This syscall can also be used to create a new exchange.

**Arguments:**

- Socket identifier (8 bytes)
- Exchange identifier (8 bytes) - `0` creates a new exchange
- Method or notification code (1 byte) - non-zero value if not creating an exchange to close it with a non-error message
- Error code (2 bytes)
- Number of bytes to write (4 bytes)
- Pointer to the message's content (8 bytes)

**Return value:**

- Exchange identifier (8 bytes)
- Message counter for this exchange (4 bytes)

**Errors:**

- `0x20`: Unknown socket identifier
- `0x21`: Socket is already closed
- `0x22`: Unknown exchange identifier
- `0x23`: Exchange has already been concluded

### `0x28` READ_SOCK_MSG

Read the pending message of a [service socket](ipc.md#service-sockets).

**Arguments:**

- Socket identifier (8 bytes)
- Address of a writable buffer (8 bytes)

**Return value:**

- Number of written bytes (4 bytes)
- `0x01` if a message was retrieved, `0x00` if none was pending (1 byte)
- Status (1 byte):
  - Bit 0: set if this message did create a new exchange
  - Bit 1: set if this message is an error message
  - Bit 2: set if this message closed the socket

**Errors:**

- `0x20`: Unknown socket identifier
- `0x21`: Socket is already closed
- `0x22`: Unknown exchange identifier
- `0x23`: Exchange has already been concluded

### `0x29` CLOSE_SERV_SOCK

Close a [service socket](ipc.md#service-sockets).  
Triggers the [`SERV_SOCK_CLOSED`](signals.md#0x29-serv_sock_closed) signal on the receiver process' side.

**Arguments:**

- Socket identifier (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x20`: Unknown socket identifier
- `0x21`: Socket is already closed

### `0x2A` CONNECT_SERVICE

Ask a service to etablish connection. The current process is called the service's _client_.

If the current process already has an active connection (a connection that hasn't been closed) to the target service, it will fail unless the flexible mode argument is set.

**NOTE:** When this signal is sent, the service's answer will be waited, so the instructions following the sending of this signal may not be ran until several seconds in the worst scenario.

**Arguments:**

- Target application's [ANID](../applications-libraries.md#application-identifier) (4 bytes)
- [Scope name](../services.md#types-of-services) - filled with zeroes to access the default service (8 bytes)
- Command code (2 bytes)

**Return value:**

- Unique connection ID (8 bytes)
- [Service socket](ipc.md#service-sockets) identifier (8 bytes)
- Flexible mode (1 byte): `0x00` by default, `0x01` returns the existing connection ID if an active connection is already in place with the service instead of failing

**Errors:**

- `0x10`: Invalid flexible mode provided
- `0x20`: The provided ANID does not exist
- `0x21`: Target application does not [expose the provided service](../../concepts/applications.md#services)
- `0x22`: Current process already has an active connection to the target service and flexible mode is not set
- `0x30`: Failed to send the [`SERVICE_CONN_REQUEST`](signals.md#0x2a-service_conn_request) due to a [double handler fault](signals.md#0x01-handler_fault)
- `0x31`: Service rejected the connection request

### `0x2B` END_SERVICE_CONN

Tell a service to properly close the connection. The associated [service socke](ipc.md#service-sockets) will immediatly be closed.

**Arguments:**

- Unique connection ID (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x10`: The provided connection ID does not exist
- `0x20`: This connection was already closed
- `0x21`: The associated service thread already terminated

### `0x2C` ACCEPT_SERVICE_CONN

Confirm the current service accepts the connection with a client.  
A dedicated service socket identifier will be provided to communicate with the client.

This will create a new [client thread](../services.md#thread-types) in the current process, which is meant to be dedicated to this specific client.  
The client thread will not receive any [`SERVICE_CONN_REQUEST`](signals.md#0x2a-service_conn_request) signal, only [dispatcher thread](../services.md#thread-types) will.

When the associated client terminates, the [`SERVICE_CLIENT_CLOSED`](signals.md#0x2b-service_client_closed) signal is sent to this thread.

**Arguments:**

- Connection's unique request ID (8 bytes)

**Return value:**

- `0x00` if the current process is now the associated client's thread, `0x01` else
- [Service socket](ipc.md#service-sockets) identifier (8 bytes)

**Errors:**

- `0x10`: This request ID does not exist
- `0x20`: The process which requested the connection already terminated
- `0x30`: Answer was given after the delay set in the [registry](../registry.md)'s `system.processes.service_answer_delay` key (default: 2000ms)

### `0x2D` REJECT_SERVICE_CONN

Reject a connection request to the current service.

**Arguments:**

- Connection's unique request ID (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x10`: This request ID does not exist
- `0x20`: The process which requested the connection already terminated
- `0x30`: Answer was given after the delay set in the [registry](../registry.md)'s `system.processes.service_answer_delay` key (default: 2000ms)

### `0x2E` HAS_SCOPED_SERVICE

**Arguments:**

- Target application's [ANID](../applications-libraries.md#application-identifier) (4 bytes)
- [Scope name](../services.md#types-of-services) (8 bytes) - fill with zeroes to check the default service

**Return value:**

- `0x01` if the application has a service for the provided scope, `0x00` otherwise

**Errors:**

- `0x20`: The provided ANID does not exist
- `0x21`: Target application does not [expose the provided service](../../concepts/applications.md#services)

### `0x30` MEM_ALLOC

Allocate a linear block of memory.

**WARNING:** Allocated memory will not be rewritten, thus it may contain non-zero data. Therefore the caller process shall ensure memory is used correctly.

**Arguments:**

- The number of [pages](memory.md#pages) to allocate (8 bytes)

**Return value:**

- Pointer to the newly-allocated block of memory (8 bytes)

**Errors:**

- `0x30`: The kernel could not find a linear block of memory of the requested size

### `0x31` MEM_FREE

Unallocate a linear block of memory.

Shared memory pages must first be unshared through the [`UNSHARE_AMS`](#0x37-unshare_ams) syscall.  
Mapped memory pages must be unmapped through the [`UNMAP_AMS`](#0x39-unmap_ams) syscall.

**WARNING:** Memory will not be zeroed, therefore the caller process shall ensure critical informations are zeroed or randomized before freeing the memory.

**Arguments:**

- Pointer to the start address to unallocate the memory from (8 bytes)
- The number of [pages](memory.md#pages) to unallocate (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x10`: The provided start address it not aligned with a page
- `0x20`: The provided start address is out of the process' range
- `0x21`: The provided size, added to the start address, would exceed the process' range
- `0x22`: One or more of the provided pages was not allocated (e.g. unmapped page or memory-mapped page)
- `0x23`: One or more of the provided pages are shared with another process

### `0x32` VIRT_MEM_AMS

Create an [abstract memory segment (AMS)](memory.md#abstract-memory-segments) from a part of the current process' address space.

**Arguments:**

- Address of the first page to register in the AMS (8 bytes)
- Number of bytes to register (8 bytes)

**Return value:**

- AMS ID (4 bytes)

**Errors:**

- `0x10`: Start address is unaligned
- `0x11`: Number of bytes is unaligned
- `0x22`: Address is out of range

### `0x33` BACKED_AMS

Create an [abstract memory segment (AMS)](memory.md#abstract-memory-segments) backed by the [`READ_BACKED_AMS`](signals.md#0x33-read_backed_ams) and [`WRITE_BACKED_AMS`](signals.md#0x34-write_backed_ams) signals.

Copy-on-write support can be enabled to allow the receiver process to write data in its own memory space. Written pages will be allocated by the kernel and won't be backed anymore by the [`READ_BACKED_AMS`](signals.md#0x33-read_backed_ams) signal. The backer process won't be able to see these changes, and the [`WRITE_BACKEND_AMS`](signals.md#0x34-write_backed_ams) signal won't be trigerred on its side.

**Arguments:**

- Length of the AMS (8 bytes)
- Copy-on-write mode (1 byte): `0x00` to disable, `0x01` to enable

**Errors:**

- `0x10`: Invalid COW mode provided
- `0x11`: Provided length is unaligned

### `0x34` DEVICE_AMS

Create an [abstract memory segment (AMS)](memory.md#abstract-memory-segments) from a device's memory through _Mapped Memory Input/Output_ (MMIO).

Requires the current process to have the device in its [drivable devices attribute](processes.md#drivable-devices).

**Arguments:**

- [SDI](hardware.md#session-device-identifier) of the device to map in memory (4 bytes)
- Start address in the device's memory (8 bytes)
- Number of bytes to map (8 bytes)
- Start address to map in this process' memory (8 bytes)

**Return value:**

- AMS ID (8 bytes)

**Errors:**

- `0x10`: The mapping's start address is not aligned with a page
- `0x11`: The mapping's length is not a multiple of a page's size
- `0x12`: The mapping's size is null (0 bytes)
- `0x20`: The provided device SDI was not found
- `0x21`: The provided device is not compatible with MMIO
- `0x22`: This device is not registered in this process' [drivable devices attribute](processes.md#drivable-devices)

### `0x35` SHARE_AMS

Share an [abstract memory segment (AMS)](memory.md#abstract-memory-segments) with another process.

This will trigger in the target process the [`RECV_SHARED_MEM`](signals.md#0x35-recv_shared_ams) with the provided command code, unless the notification mode states otherwise.

The _mutual mode_ allows both processes to access the memory, with the sharer setting the permissions for the receiver to limit its access. Copy-on-write can also be enabled to allow the receiver process to write data without affecting the sharer process' memory.

The _exclusive mode_ allows, only when sharing AMS [made from existing memory pages](#0x32-virt_mem_ams) from its original process, to unmap the original pages from the said process to let the exclusive access to the target process. This is useful when transferring temporarily large chunks of data to another process. Also, access permissions are ignored when using exclusive mode.

**Arguments:**

- Target process' PID (8 bytes)
- Command code (2 bytes)
- Notification mode (1 byte): `0x00` to notify the process with the [`RECV_SHARED_AMS`](signals.md#0x35-recv_shared_ams) signal, `0x01` to skip it
- Mode (1 byte):
  - Mutual: `0 b 0 0 0 0 <1 to enable copy-on-write> <1 to enable read> <1 to enable write> <1 to enable exec>`
  - Exclusive: `0 b 0 0 0 0 1 0 0 <1 to unmap original pages>`

**Return value:**

- AMS ID (8 bytes)

**Errors:**

- `0x10`: Invalid notification mode provided
- `0x11`: Invalid mode provided
- `0x12`: Access permissions were not set but the sharing mode is set to mutual
- `0x13`: Access permissions were provided but the sharing mode is set to exclusive
- `0x14`: Invalid exclusive mode provided
- `0x30`: There is not enough contiguous space in the receiver process' memory space to map the shared memory

### `0x36` AMS_SHARING_INFO

Get informations about a [shared](#0x35-share_ams) [abstract memory segment (AMS)](memory.md#abstract-memory-segments).

**Arguments:**

- AMS ID (8 bytes)

**Return value:**

- Sharer process' PID (8 bytes)
- Receiver process' PID (8 bytes)
- Sharing mode (1 byte): `0x00` for mutual mode, `0x01` for exclusive mode
- Shared buffer's start address (8 bytes)
- Sharer buffer's length (8 bytes)
- Command code (2 bytes)
- Access permissions (1 byte): for mutual sharings, strongest bit for read, next for write, next for exec ; for exclusive sharings, `0x00`

**Errors:**

- `0x10`: Unknwon AMS ID provided

### `0x37` UNSHARE_AMS

Stop sharing an [abstract memory segment (AMS)](memory.md#abstract-memory-segments) started by [`SHARE_AMS`](#0x35-share_ams). Note that exlusive sharings cannot be unmapped.

This will trigger in the target process the [`UNSHARED_AMS`](signals.md#0x37-unshared_ams) signal.

**Arguments:**

- AMS ID (8 bytes)
- PID to stop sharing with (8 bytes) - `0` to stop sharing with all processes

**Return value:**

_None_

**Errors:**

- `0x10`: Unknown AMS ID provided
- `0x20`: Provided AMS ID is exclusive
- `0x21`: Provided AMS was not shared with the provided process

### `0x38` MAP_AMS

Map an [abstract memory segment (AMS)](memory.md#abstract-memory-segments) in the current process' address space.

**Arguments:**

- AMS ID (8 bytes)
- Start mapping address in the AMS (8 bytes)
- Address to map the AMS (8 bytes)
- Number of bytes to map (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x10`: Unknown AMS ID provided
- `0x20`: Provided mapping address or address+length is out-of-range in the AMS
- `0x21`: Provided address to map or address+length is out-of-orange in this process' address space

### `0x39` UNMAP_AMS

Unmap an [abstract memory segment (AMS)](memory.md#abstract-memory-segments) from the current process' address space.  
If the AMS is mapped at multiple addresses of this process, only one of the mappings will be unmapped by default.

**Arguments:**

- AMS ID (8 bytes)
- Mapping address (8 bytes) - `0` to unmap from all addresses

**Return value:**

_Empty_

**Errors:**

- `0x10`: Unknown AMS ID provided
- `0x20`: Provided AMS it not mapped at this address

### `0x3A` SET_DMA_MEM_ACCESS

Allow or disallow a device to access a range of addresses through _Direct Memory Access_ (DMA) in the current process' address space.

Requires the current process to have the device in its [drivable devices attribute](processes.md#drivable-devices).

**Arguments:**

- [SDI](hardware.md#session-device-identifier) of the device to map in memory (4 bytes)
- Start address in the current process' address space (8 bytes)
- Length (8 bytes)
- Authorization (1 byte): `0x00` to allow the device to use this range, `0x01` to cancel an authorization

**Return value:**

_None_

**Errors:**

- `0x10`: The range's start address is not aligned with a page
- `0x11`: The range's length is not a multiple of a page's size
- `0x12`: The range's size is null (0 bytes)
- `0x20`: The provided device SDI was not found
- `0x21`: The provided device is not compatible with DMA
- `0x22`: This device is not registered in this process' [drivable devices attribute](processes.md#drivable-devices)

### `0x40` CREATE_PROCESS

Create a child process from the current one. The new process gets a separate memory space.

Communication can be done through [standard IPC](ipc.md).

The initialization data is joined as part of the [application's context](../applications/context.md).

**Arguments:**

- Initialization data (8 bytes)

**Return value:**

- Child process identifier (8 bytes)
- Identity (1 byte): `0x00` if the current thread is the parent, `0x01` for the child
- Initialization data (8 bytes) - `0` for the parent

**Errors:**

- `0x20`: The current process is not an application process
- `0x30`: Failed to create a new process due to hardware problem (cannot allocate memory, ...)

### `0x41` WAIT_CHILD_PROCESS

Wait for a child process to terminate.

**Arguments:**

- Process identifier (8 bytes)
- Timeout in milliseconds (2 bytes)

**Return value:**

_Empty_

**Errors:**

- `0x20`: The provided PID does not exist or does not belong to the current application

### `0x42` KILL_CHILD_PROCESS

Kill a child process, which will first receive the [`WILL_TERMINATE`](signals.md#0x4f-will_terminate) signal.

**Arguments:**

- Process identifier (8 bytes)
- Timeout in milliseconds (2 bytes) - if `0`, will use the system's global default value ([registry's](../registry.md) `system.processes.terminate_delay`)

**Return value:**

- Process' exit data (provided through [`EXIT_PROCESS`](#0x4f-exit), `0` otherwise)

**Errors:**

- `0x30`: Failed to create a new process due to hardware problem (cannot allocate memory, ...)

### `0x43` GET_PID

Get the current process' PID.

**Arguments:**

_None_

**Return value:**

- Current process' PID (8 bytes)

**Errors:**

_None_

### `0x44` SUSPEND

[Suspend](../../features/balancer.md#application-processes-suspension) the current process or a child process.

**Arguments:**

- PID to suspend (8 bytes) - `0` for the current process

**Return value:**

- Amount of time the process was suspended, in milliseconds (8 bytes)

**Errors:**

- `0x20`: the current process is not an application process
- `0x21`: the current PID was not found or is not a child of the current process

### `0x45` UNSUSPEND

[Unsuspend](../../features/balancer.md#application-processes-suspension) a child process.

Will trigger the [`UNSUSPENDED`](signals.md#0x46-unsuspended) signal on the child process' side.

**Arguments:**

- PID to unsuspend (8 bytes) - `0` for the current process

**Return value:**

- Amount of time the process was suspended, in milliseconds (8 bytes)

**Errors:**

- `0x20`: the current process is not an application process
- `0x21`: the current PID was not found or is not a child of the current process

### `0x46` HAND_OVER

End this process' [cycle](scheduling.md#cycles-and-context-switching).

Used to indicate to the kernel the current process has no additional work to do for now (e.g. waiting for asynchronous I/O data).

**Arguments:**

_None_

**Return value:**

_None_

**Errors:**

_None_

### `0x4F` EXIT

Kill the current process.

A [`SERVICE_CLIENT_CLOSED`](signals.md#0x2b-service_client_closed) signal is sent to all services connection the process has.  
If the current process is a service, a [`SERVICE_SERVER_QUITTED`](signals.md#0x2d-service_server_quitted) signal is sent to all active clients.

**Arguments:**

- Exit data (8 bytes)

**Return value:**

_None_ (never returns)

**Errors:**

_None_

### `0x50` CREATE_THREAD

Create a thread from the current one. The new thread will share the current one's memory space.

**Arguments:**

- Initialization data (8 bytes)

**Return value:**

- Child thread identifier (8 bytes)
- Identity (1 byte): `0x00` if the current thread is the parent, `0x01` for the child
- Initialization data (8 bytes) - `0` for the parent

**Errors:**

- `0x30`: Failed to create a new process due to hardware problem (cannot allocate memory, ...)

### `0x51` CREATE_TLS_SLOT

Create a [TLS slot](../../technical/processes.md#thread-local-storage).

**Arguments:**

_None_

**Return value:**

- TLS slot identifier (8 bytes)

**Errors:**

_None_

### `0x52` READ_TLS_SLOT

Read from a [TLS slot](../../technical/processes.md#thread-local-storage).

**Arguments:**

- TLS slot identifier (8 bytes)
- Writable buffer (8 bytes)
- Number of bytes to read (8 bytes) - `0` to read everything

**Return value:**

- Number of bytes written (8 bytes)

**Errors:**

- `0x20`: Unknown TLS identifier

### `0x53` WRITE_TLS_SLOT

Write to a [TLS slot](../../technical/processes.md#thread-local-storage).

**Arguments:**

- TLS slot identifier (8 bytes)
- Readable buffer (8 bytes)
- Number of bytes to write (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x20`: Unknown TLS identifier
- `0x30`: Failed to allocate enough memory for the written data

### `0x54` DELETE_TLS_SLOT

Delete a [TLS slot](../../technical/processes.md#thread-local-storage).

**Arguments:**

- TLS slot identifier (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x20`: Unknown TLS identifier

### `0x5F` EXIT_THREAD

Kill the current thread and all of its children threads.

**Arguments:**

- Exit data (4 bytes)

**Return value:**

_None_ (never returns)

**Errors:**

_None_

### `0xA0` EXECUTION_CONTEXT

Get informations from the application's [execution context](../applications/context.md).

**Arguments:**

- Information to get (1 byte):
  - `0x00`: all the context
  - `0x01`: startup reason
  - `0x02`: context header
  - `0x03`: command-line arguments

- Pointer to a writable buffer (8 bytes)

**Return value:**

- Number of written bytes (8 bytes)

**Errors:**

- `0x10`: invalid information number provided
- `0x20`: caller process is a system service

### `0xD0` SYS_CREATE_PROCESS

System service-only syscall.

Create a [userland process](processes.md#types-of-processes).

**Arguments:**

- Code location token from the [`sys::fs`](../system-services/fs.md) service
- [Application context](../applications/context.md)

**Return value:**

- [PID](processes.md#process-identifier) (8 bytes)

**Errors:**

- `0x20`: Caller process is not the [`sys::process`](../system-services/process.md) service
- `0x30`: Code location token was not accepted by the [`sys::fs`](../system-services/fs.md)
- `0x31`: Application context is not valid

### `0xD1` SYS_MANAGE_PROCESS

System service-only syscall.

Manage a [userland process](processes.md#types-of-processes).

**Arguments:**

- [PID](processes.md#process-identifier) (8 bytes)
- Action (1 byte):
  - `0x01`: [Ask for suspension](signals.md#0x44-suspend)
  - `0x02`: [Force suspension](signals.md#0x45-will_suspend)
  - `0x03`: [Unsuspend](signals.md#0x46-unsuspended)
  - `0x04`: [Ask for termination](signals.md#0x4e-terminate)
  - `0x05`: [Force termination](signals.md#0x4f-will_terminate)

**Return value:**

_None_

**Errors:**

- `0x10`: Invalid action code provided
- `0x20`: Caller process is not the [`sys::process`](../system-services/process.md) service
- `0x21`: Unknown PID
- `0x22`: Process is already in the requested state

### `0xD2` SYS_PROCESS_ATTRIBUTES

System service-only syscall.  
Get a process' [attributes](processes.md#process-attributes).

**Arguments:**

_For value-based attributes:_

- Attribute code (1 byte):
  - `0x00`: PID
  - `0x01`: Process' priority
  - `0x02`: Running user's ID
  - `0x03`: Parent application ID
  - `0x04`: Execution context (startup reason)
  - `0x05`: Execution context (header)
  - `0x06`: Execution context (arguments)

- Action code:
  - `0x00`: Read the information (followed by a writable address on 8 bytes)
  - `0x01`: Write the information (followed by the value to write)

_For list-based attributes:_

- Attribute code (1 byte):
  - `0x00`: Memory mappings
  - `0x01`: Permissions
  - `0x02`: Drivable devices

- Action code (1 byte) followed by its optional arguments:
  - `0x00`: Get the number of elements
  - `0x01`: Get the value at a given index => index (4 bytes)
  - `0x02`: Update the value at a given index => index (4 bytes) + value (? bytes)
  - `0x03`: Insert a value at a given index => index (4 bytes) + value (? bytes)
  - `0x04`: Push a value at the end of the list => value (? bytes)
  - `0x05`: Remove a value from the list => index (4 bytes)
  - `0x06`: Remove the last value from the list
  - `0x10`: Check if the list contains a given item => value to look for (? bytes)

- Address to a writable buffer (8 bytes)

**Return value:**

- Number of written bytes (if applies) (8 bytes)

**Errors:**

- `0x10`: Invalid action code provided
- `0x11`: Invalid attribute number provided
- `0x20`: Caller process is not the [`sys::process`](../system-services/process.md) service
- `0x21`: This system service is not allowed to access or edit this attribute
- `0x22`: Provided index is out-of-bounds

### `0xD3` SYS_SET_PRIORITY

System service-only syscall.  
Set the priority of a process.  
If the set priority is different than `0`, the kernel won't adjust the priority automatically anymore.  
Setting it to `0` will reset it to the kernel's choice.

**Arguments:**

- Process PID (8 bytes)
- Priority to set (1 byte) with `0` to let the kernel set it automatically

**Return value:**

_None_

**Errors:**

- `0x10`: Provided priority is higher than `20`
- `0x20`: Caller process is not the [`sys::process`](../system-services/process.md) service
- `0x21`: Provided PID was not found

### `0xD4` SYS_ENUM_DEVICES

System service-only syscall.  
List devices matching a provided CII.

For each device, its SDI (4 bytes) is written to the provided address.

**Arguments:**

- [CII](hardware.md#connection-interface-identifier) of the devices to list (4 bytes)
  `0` will list all devices
- Address of a writable buffer (8 bytes)

**Return value:**

- Number of devices found with the provided criterias (4 bytes)

**Errors:**

- `0x10`: Invalid connection type in CII
- `0x20`: Caller process is not the [`sys::hw`](../system-services/hw.md) service

### `0xD5` SYS_DEVICE_INFOS

System service-only syscall.  
Get the [raw device descriptor](hardware.md#raw-device-descriptor) of a single device.

**Arguments:**

- [SDI](hardware.md#session-device-identifier) of the device to get informations from (4 bytes)
- Address of a writable buffer (8 bytes)

**Return value:**

- Number of written bytes (1 byte)

**Errors:**

- `0x20`: Caller process is not the [`sys::hw`](../system-services/hw.md) service
- `0x21`: No device was found with this SDI
