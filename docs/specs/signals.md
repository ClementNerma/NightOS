# Signals

_Signals_ are the second type of [KPC](../technical/kpc.md). They are used by the kernel to send informations to processes about a specific event.

When a process is created, the kernel associates it:

* A _signals handler table_ (SHT) ;
* A _signals queue_ ;
* A _readiness indicator_

Each signal has a 8-bit code that identifies it, as well as a 64-bit _datafield_ which is used to attach additional informations about the signal.

When the kernel sends a signal to a process, it first checks if an handler is already running. If so, it simply pushes the signal to the queue.

Else, it checks the readiness indicator. If it is `false` (so if the process did not sent the [`READY`](signals.md#0x04-ready) syscall yet), the signal is pushed to the queue.

Else, it checks in the SHT if the signal has a handler. If there is no handler, depending on the specific signal, it may either be ignored or use a default behaviour (this is documented for each signal).

If a handler is found, the kernel checks if the pointer points to a memory area that is executable by the current process. If it isn't, the signal is converted to an [`HANDLER_FAULT`](#0x01-handlerfault) one. If the signal that was being sent was already an `HANDLER_FAULT`, the process is killed.

The kernel then makes the program jump to the handler's address, and resumes it.

When the handler returns (or the default behaviour completes), the kernel checks if the signals queue is empty. If it is, the kernel simply makes the process jump back to the address it was to before the signal was emitted.

Else, it interrupts the process again and proceeds to treat the first signal on the queue after removing it.

You can find below the exhaustive list of signals.

### `0x01` HANDLER_FAULT

Default: kills the process
Datafield: faulty signal ID

Sent when a signal is sent to a process but the registered handler points to a memory zone that is not executable by the current process.

### `0x10` SUSPEND

Default: -
Datafield: delay before suspension, in milliseconds (16-bit)

Sent when the process is asked to suspend. If it is not suspended after the provided delay, the process is suspended.

### `0x11` TERMINATE

Default: kills the process
Datafield: delay before forced termination, in milliseconds (16-bit)

Sent when the process is asked to terminate. If it does not terminate by itself before the provided delay, the process is killed.

### `0x12` KILL

Default: kills the process
Datafield: [registry](registry.md)'s `system.signals.kill_delay` key (default: 500ms)

Kills the process after the provided amount of time.
