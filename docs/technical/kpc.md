# Kernel-Process Communication

The _Kernel-Process Communication_ (KPC) describes how a process can interact with the kernel, and vice-versa.

There are two types of KPC:

* [System calls](../specs/syscalls.md), which are used by a process to ask the kernel to perform an action ;
* [Signals](../specs/signals.md), which are used by the kernel to send informations about an event to a process

For more advanced features, like permissions management or filesystem, check [IPC](ipc.md).