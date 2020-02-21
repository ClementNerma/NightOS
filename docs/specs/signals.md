# Signals

_Signals_ are the second type of [KPC](../technical/kpc.md). They are used by the kernel to send informations to processes about a specific event.

When a process is created, the kernel associates it:

* A _signals handler table_ (SHT) ;
* A _signals queue_ ;
* A _readiness indicator_

Each signal has a 8-bit code that identifies it, as well as a 8 bytes _datafield_ which is used to attach additional informations about the signal.

When the kernel sends a signal to a process, it first checks if an handler is already running. If so, it simply pushes the signal to the queue.

Else, it checks the readiness indicator. If it is `false` (so if the process did not sent the [`READY`](syscalls.md#0x04-ready) syscall yet), the signal is pushed to the queue.

Else, it checks in the SHT if the signal has a handler. If there is no handler, depending on the specific signal, it may either be ignored or use a default behaviour (this is documented for each signal).

If a handler is found, the kernel checks if the pointer points to a memory area that is executable by the current process. If it isn't, the signal is converted to an [`HANDLER_FAULT`](#0x01-handler_fault) one. If the signal that was being sent was already an `HANDLER_FAULT`, the process is killed.

The kernel then makes the program jump to the handler's address, and resumes it.

When the handler returns (or the default behaviour completes), the kernel checks if the signals queue is empty. If it is, the kernel simply makes the process jump back to the address it was to before the signal was emitted.

Else, it interrupts the process again and proceeds to treat the first signal on the queue after removing it.

You can find below the exhaustive list of signals.

## `0x01` HANDLER_FAULT

Default: kills the process  
Datafield: faulty signal ID (8 bytes)

Sent when a signal is sent to a process but the registered handler points to a memory zone that is not executable by the current process.
If the sending of this signal to the process results to another fault, it's called a _double handler fault_ and the process is immediatly killed.

## `0x10` SUSPEND

Default: -  
Datafield: [registry](registry.md)'s `system.signals.suspend_delay` key (default: 500ms) (2 bytes)

Sent when the process is asked to suspend. If it is not suspended after the provided delay, the process is suspended.

## `0x11` TERMINATE

Default: kills the process  
Datafield: delay before forced termination, in milliseconds (2 bytes)

Sent when the process is asked to terminate. If it does not terminate by itself before the provided delay, the process is killed.

## `0x12` KILL

Default: kills the process  
Datafield: [registry](registry.md)'s `system.signals.kill_delay` key (default: 500ms) (2 bytes)

Kills the process after the provided amount of time.

## `0x20` SERVICE_CLOSED

Default: -  
Datafield: connection's unique request ID (8 bytes)

Sent to a process that previously established a connection with a service, to indicate the associated service thread closed before the connection was properly terminated.

## `0x30` SERVICE_CONN_REQUEST

Default: kills the process  
Datafield:
* Callee process' ID (8 bytes)
* Connection's unique request ID (8 bytes)
* [registry](registry.md)'s `system.signals.service_answer_delay` key (default: 1000ms) (2 bytes)

Sent to a service process' [dispatcher threads](services.md#thread-types) when another process tries to etablish a connection through the [`CONNECT_SERVICE`](syscalls.md#0x20-connect_service) syscall.

The process is expected to answer using the [`ACCEPT_SERVICE_CONNECTION`](syscalls.md#0x30-accept_service_conn) under the provided delay, else it's considered as a rejection.

## `0x31` SERVICE_CLIENT_CONN_END

Default: -  
Datafield: -

Sent to a [client thread](services.md#thread-types) to indicate its client asked to close the connection.
The associated RC and SC are immediatly closed.

## `0x32` SERVICE_CLIENT_CLOSED

Default: -  
Datafield: -

Sent to a [client thread](services.md#thread-types) to indicate its client closed before the connection was properly terminated.
The thread is expected to terminate as soon as possible (there is no time limit though).

## `0x40` RECV_IUC_RC

Default: -  
Datafield: [Pipe](ipc.md#pipes) SC identifier (8 bytes), command code (2 bytes)

Sent to a process when another process of the same application and running under the same user opened an IUC with this process, giving it the readable part.
The command code can be used to determine what the other process is expecting this one to do. This code does not follow any specific format.

## `0x41` RECV_IUC_SC

Default: -  
Datafield: [Pipe](ipc.md#pipes) RC identifier (8 bytes), command code (2 bytes)

Sent to a process when another process of the same application and running under the same user opened an IUC with this process, giving it the writable part.
The command code can be used to determine what the other process is expecting this one to do. This code does not follow any specific format.

## `0x42` IUC_CLOSED

Default: -  
Datafield:
* `0x00` if the IUC was closed properly using the [CLOSE_IUC](syscalls.md#0x42-close_iuc) syscall, or `0x01` if the other process brutally terminated (1 byte)
* `0x00` if this process contained the RC part, `0x01` if it contained the SC part
* RC/SC identifier (8 bytes)

Sent to a process when an [pipe](ipc.md#pipes) shared with another process is closed.

**NOTE:** This does not apply to service IUC.
