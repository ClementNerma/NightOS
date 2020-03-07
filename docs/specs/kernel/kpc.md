# Kernel-Process Communication

The _Kernel-Process Communication_ (KPC) describes how a process can interact with the kernel, and vice-versa.

There are two types of KPC:

* [System calls](../syscalls.md), which are used by a process to ask the kernel to perform an action ;
* [Signals](../signals.md), which are used by the kernel to send informations about an event to a process

Note that, unlike many operating systems like Linux, it's not possible for a process to send a signal to another. Only the kernel is allowed to emit signals.

For more advanced features, like permissions management or filesystem, check [IPC](../../technical/ipc.md).