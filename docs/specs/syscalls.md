# System calls

_System calls_, abbreviated _syscalls_, are the first type of KPC. They allow a process to ask the kernel to perform an action.

A syscall is made of a 8-bit code, as well as arguments, whose size will vary depending on their type.
When performing a syscall, the process will put in a specific CPU register an address poiting to a memory address containing in a row the syscall's code and its arguments. The maximum size of code and arguments combined is 128 bits (16 bytes).

Some syscalls require the process to send a buffer of data. In such case, the process simply provides a pointer to the said buffer - so the argument's size will vary depending on the length of memory addresses.

After preparing the syscall's code and arguments, the process raises a specific exception that is caught by the kernel. When the syscall is complete, the kernel puts the result values in specific registers and resumes the process. This means that **all syscalls are synchronous**.

System calls always return two numbers: a 8-bit one (errcode) and a 64-bit one (result code). If the errcode is not null, then an error occured during the syscall. The specific value indicate the encountered type of error:

* `0x00`: cannot read syscall's code or arguments (error while reading memory)
* `0x01`: the requested syscall does not exist
* `0x02`: at least one argument is invalid (e.g. providing a pointer to the `0` address)

Some syscalls have specific error codes (starting from `0x10`).

Note that advanced actions like permissions management or filesystem access are achieved through the use of [IPC](ipc.md).

You can find below the exhaustive list of system calls.

## `0x01` HANDLE_SIGNAL

Arguments: Code of the signal (8 bits), pointer to the handler function
Return value: -

Errors:
* `0x10`: the requested signal does not exist

Register a [signal handler](#signals).
If the address pointed by this syscall's is not executable by the current process when this signal is sent to the process, the signal will be converted to an [`HANDLER_FAULT`](#0x01-handlerfault) signal instead.

## `0x02` UNHANDLE_SIGNAL

Arguments: Code of the signal (8 bits)
Return value: -

Errors:
* `0x10`: the requested signal does not exist
* `0x11`: the requested signal does not have an handler

Unregister a signal handler, falling back to the default signal reception behaviour if this signal is sent to the process.

## `0x03` IS_SIGNAL_HANDLED

Arguments: Code of the signal (8 bits)
Return value: `0` if the signal is not handled, `1` if it is

Errors:
* `0x10`: the requested signal does not exist

Check if a signal has a registered handler.

## `0x04` READY

Arguments: -
Return value: -
Errors:
* `0x10`: The process already told it was ready

Indicate the system this process has set up all its event listeners, so it can start dequeuing [signals](signals.md).

**NOTE:** When this signal is sent, all queued signals will be treated at once, so the instructions following the sending of this signal may not be ran until quite a bit of time in the worst scenario.

**WARNING:** Signals will not be treated until this syscall is sent by the process!

## `0x10` GET_PID

Arguments: -
Return value: Current process' PID
Errors: -

Get the current process' PID.

## `0x12` SUSPEND

Arguments: -
Return value: Amount of time the process was suspended, in milliseconds (64-bit)
Errors: -

[Suspend](../features/balancer.md#processes-suspension) the current process.

## `0x13` EXIT

Arguments: -
Return value: - (never)
Errors: -

Kill the current process.
