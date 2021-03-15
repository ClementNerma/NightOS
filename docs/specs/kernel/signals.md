# Signals

_Signals_ are a type of [KPC](kpc.md). They are used by the kernel to send informations to processes about a specific event.

- [Technical overview](#technical-overview)
- [List of signals](#list-of-signals)
  - [`0x01` HANDLER_FAULT](#0x01-handler_fault)
  - [`0x02` MEM_FAULT](#0x02-mem_fault)
  - [`0x20` RECV_PIPE](#0x20-recv_pipe)
  - [`0x21` PIPE_CLOSED](#0x21-pipe_closed)
  - [`0x26` RECV_SERV_SOCK](#0x26-recv_serv_sock)
  - [`0x27` RECV_SOCK_MSG](#0x27-recv_sock_msg)
  - [`0x29` SERV_SOCK_CLOSED](#0x29-serv_sock_closed)
  - [`0x2A` SERVICE_CONN_REQUEST](#0x2a-service_conn_request)
  - [`0x2B` SERVICE_CLIENT_CLOSED](#0x2b-service_client_closed)
  - [`0x2C` SERVICE_CLIENT_QUITTED](#0x2c-service_client_quitted)
  - [`0x2D` SERVICE_SERVER_QUITTED](#0x2d-service_server_quitted)
  - [`0x33` READ_BACKED_AMS](#0x33-read_backed_ams)
  - [`0x34` WRITE_BACKED_AMS](#0x34-write_backed_ams)
  - [`0x35` RECV_SHARED_AMS](#0x35-recv_shared_ams)
  - [`0x37` UNSHARED_AMS](#0x37-unshared_ams)
  - [`0x44` SUSPEND](#0x44-suspend)
  - [`0x45` WILL_SUSPEND](#0x45-will_suspend)
  - [`0x4E` TERMINATE](#0x4e-terminate)
  - [`0x4F` WILL_TERMINATE](#0x4f-will_terminate)

## Technical overview

When a process is created, the kernel associates it:

- A _signals handler table_ (SHT) ;
- A _signals queue_ ;
- A _readiness indicator_

Each signal has a 8-bit code that identifies it, as well as a 32 bytes _datafield_ which is used to attach additional informations about the signal.

When the kernel sends a signal to a process, it first checks if an handler is already running. If so, it simply pushes the signal to the queue.

Else, it checks the readiness indicator. If it is `false` (so if the process did not sent the [`READY`](syscalls.md#0x04-ready) syscall yet), the signal is pushed to the queue.

Else, it checks in the SHT if the signal has a handler. If there is no handler, depending on the specific signal, it may either be ignored or use a default behaviour (this is documented for each signal).

If a handler is found, the kernel checks if the pointer points to a memory area that is executable by the current process. If it isn't, the signal is converted to an [`HANDLER_FAULT`](#0x01-handler_fault) one. If the signal that was being sent was already an `HANDLER_FAULT`, the process is killed.

The kernel then switches the process to its [main thread](../../technical/processes.md#main-thread) and makes it jump to the handler's address, then resumes it.

When the handler returns (or the default behaviour completes), if the signal was expecting an answer, the kernel reads it from specific registries and does whatever it needs to do. Then, itchecks if the signals queue is empty. If it is, the kernel simply makes the process jump back to the address it was to before the signal was emitted, and switch to the original thread.

Else, it interrupts the process again and proceeds to treat the first signal on the queue after removing it.

On the performances side, signals use interrupts, meaning the process' current tasks are instantly interrupted to let it handle the signal without delay. Also, the datafield and answer are provided through CPU registers, avoiding memory accesses.

## List of signals

You can find below the exhaustive list of signals.

### `0x01` HANDLER_FAULT

Sent when a signal is sent to a process but the registered handler points to a memory zone that is not executable by the current process.
If the sending of this signal to the process results to another fault, it's called a _double handler fault_ and the process is immediatly killed.

If no handler is registered for this signal, it will kill the process when received.

**Datafield:**

- Faulty signal ID (8 bytes)

### `0x02` MEM_FAULT

Sent when the process tried to perform an unauthorized access on a memory address.

**Datafield:**

- Faulty address (8 bytes)
- Access error (1 byte):
  - `0x01`: tried to read memory
  - `0x02`: tried to write memory
  - `0x03`: tried to execute memory

### `0x20` RECV_PIPE

Sent to a process when another process of the same application and running under the same user opened an pipe with this process, giving it the other part.  
The command code can be used to determine what the other process is expecting this one to do. This code does not follow any specific format.

**Datafield:**

- Pipe creator's PID (8 bytes)
- Pipe creator's application's [ANID](../applications-libraries.md#application-identifier) (4 bytes)
- [Pipe](ipc.md#pipes) SC or RC identifier (8 bytes)
- Command code (2 bytes)
- Pipe identifier type (1 byte): `0x00` if the pipe identifier is an RC, `0x01` if it's an SC
- Mode (1 byte): `0x00` if it's a raw pipe, `0x01` if it's a message pipe
- Size hint in bytes (8 bytes), with `0` being the 'no size hint' value

### `0x21` PIPE_CLOSED

Sent to a process when a [pipe](ipc.md#pipes) shared with another process is closed.

**NOTE:** This does not apply to service pipes.

**Datafield:**

- Closing type (1 byte):
  - `0x00` if the pipe was closed properly using the [CLOSE_PIPE](syscalls.md#0x25-close_pipe) syscall
  - `0x01` if the other process brutally terminated |
- Pipe identity (1 byte): `0x00` if this process contained the RC part, `0x01` if it contained the SC part (1 byte)
- RC or SC identifier (8 bytes)

### `0x26` RECV_SERV_SOCK

Sent to a process when another process opened a [service socket](ipc.md#service-sockets) with this one.

**Datafield:**

- Service socket creator's PID (8 bytes)
- Service socket creator's application's [ANID](../applications-libraries.md#application-identifier) (4 bytes)
- Service socket identifier (8 bytes)
- Size of the buffer, multiplied by 4KB (2 bytes)

### `0x27` RECV_SOCK_MSG

Sent to a process when a message has been sent through a [service socket](ipc.md#service-sockets).  
To read the message, the process must use the [`READ_SOCK_MSG`](syscalls.md#0x28-read_sock_msg) syscall.

**Datafield:**

- Servive socket identifier (8 bytes)
- Exchange identifier (8 bytes)
- Exchange method (1 byte)
- Size of the message (4 bytes)
- Status (1 byte):
  - Bit 0: set if this message did create a new exchange
  - Bit 1: set if this message is an error message
  - Bit 2: set if this message closed the socket

### `0x29` SERV_SOCK_CLOSED

(was there a message sent before that closed the socket)

Sent to a process when a [pipe](ipc.md#pipes) shared with another process is closed.

**NOTE:** This does not apply to service pipes.

**Datafield:**

- Closing type (1 byte):
  - `0x00` if the pipe was closed properly using the [CLOSE_PIPE](syscalls.md#0x25-close_pipe) syscall
  - `0x01` if the other process brutally terminated |
- Pipe identity (1 byte): `0x00` if this process contained the RC part, `0x01` if it contained the SC part (1 byte)
- RC or SC identifier (8 bytes)

### `0x2A` SERVICE_CONN_REQUEST

Sent to a service process' [dispatcher thread](../services.md#thread-types) when another process tries to etablish a connection through the [`CONNECT_SERVICE`](syscalls.md#0x2a-connect_service) syscall.

The process is expected to answer using the [`ACCEPT_SERVICE_CONNECTION`](syscalls.md#0x2c-accept_service_conn) under the provided delay, else it's considered as a rejection.

If no handler is registered for this signal, it will kill the process when received.

**NOTE:** This signal cannot be received if the application does not [expose a service](../../concepts/applications.md#services).

**Datafield:**

- Callee process' ID (8 bytes)
- Connection's unique request ID (8 bytes)
- Command code (2 bytes)
- [Registry](../registry.md)'s `system.signals.service_answer_delay` key (default: 1000ms) (2 bytes)

### `0x2B` SERVICE_CLIENT_CLOSED

Sent to a [client thread](../services.md#thread-types) to indicate its client closed before the connection was properly terminated.
The thread is expected to terminate as soon as possible (there is no time limit though).

### `0x2C` SERVICE_CLIENT_QUITTED

Sent to a [client thread](../services.md#thread-types) to indicate its client asked to close the connection.
The associated RC and SC are immediatly closed.

### `0x2D` SERVICE_SERVER_QUITTED

Sent to a process that previously established a connection with a service, to indicate the associated service thread closed before the connection was properly terminated.

**Datafield:**

- Connection's unique request ID (8 bytes)

### `0x33` READ_BACKED_AMS

Sent to a process when a [signal-backed](syscalls.md#0x33-backed_ams) [abstract memory segment (AMS)](memory.md#abstract-memory-segments) is accessed in read mode.

**Datafield:**

- AMS ID (8 bytes)
- Relative address accessed in the segment (8 bytes)
- Access mode (1 byte): `0x00` for read, `0x01` for execution

**Expected answer:**

- Associated data for this file (4 bytes)
- Page fault (1 byte):
  - `0x00`: no page fault
  - `0x01`: address is out-of-range
  - `0x02`: hardware fault

### `0x34` WRITE_BACKED_AMS

Sent to a process when a [signal-backed](syscalls.md#0x33-backed_ams) [abstract memory segment (AMS)](memory.md#abstract-memory-segments) is accessed in write mode.

**Datafield:**

- AMS ID (8 bytes)
- Relative address accessed in the segment (8 bytes)
- Data to write (4 bytes)

**Expected answer:**

- Page fault (1 byte):
  - `0x00`: no page fault
  - `0x01`: address is out-of-range
  - `0x02`: hardware fault

### `0x35` RECV_SHARED_AMS

Sent to a process when an [abstract memory segment (AMS)](memory.md#abstract-memory-segments) is [shared](ipc.md#shared-memory) by another process.

**Datafield:**

- Sender PID (8 bytes)
- Command code (2 bytes)
- AMS ID (8 bytes)
- Sharing mode (1 byte): `0x00` for mutual sharing, `0x01` for exclusive sharing
- Access permissions (1 byte):
  - For mutual sharings: strongest bit for read, next for write, next for exec
  - For exclusive sharings: `0b11100000`

### `0x37` UNSHARED_AMS

Sent to a process when an[abstract memory segment (AMS)](memory.md#abstract-memory-segments) is unshared by the sharer process.

**Datafield:**

- Unsharing type (1 byte):
  - `0x00` if the shared memory was unshared properly using the [UNSHARE_AMS](syscalls.md#0x37-unshare_ams) syscall
  - `0x01` if the other process brutally terminated

### `0x44` SUSPEND

Sent when the process is asked to suspend. It's up to the process to either ignore this signal or suspend itself using the [`SUSPEND`](syscalls.md#0x44-suspend) syscall.

### `0x45` WILL_SUSPEND

Sent when the process is asked to suspend. If it is not suspended after the provided delay, the process is suspended.

**Datafield:**

- [Registry](../registry.md)'s `system.signals.suspend_delay` key (default: 500ms) (2 bytes)

### `0x4E` TERMINATE

Sent when the process is asked to terminate. It's up to the process to either ignore this signal or terminate itself (preferably by using the [`EXIT`](syscalls.md#0x4f-exit) syscall).

### `0x4F` WILL_TERMINATE

Sent when the process is asked to terminate. If it does not terminate by itself before the provided delay, the process is killed.

If no handler is registered for this signal, it will kill the process when received.

**Datafield:**

- [Registry](../registry.md)'s `system.signals.terminate_delay` key (default: 2s) (2 bytes)
