# Processes

**WARNING: This document is far from being complete and may lack a good description of what processes are, and/or the features they offer.**

NightOS _processes_ are implemented a bit like Linux' ones, with additional features.
There are several types of processes:

- _System processes_, which are created by the system ;
- _Application processes_, in which applications run ;
- _Worker processes_, in which applications' workers run

The base and system processes are called _low-level processes_, while application and worker ones are called _userland processes_.

You can find the implementation details of processes in the [kernel document](../specs/kernel/processes.md).

- [User permissions](#user-permissions)
- [Child processes](#child-processes)
- [Threading](#threading)
  - [Main thread](#main-thread)
  - [Thread-local storage](#thread-local-storage)
- [Automatic permissions inheritance](#automatic-permissions-inheritance)

## User permissions

Each process is ran as a specific user, which determines the maximum allowed scope for [controller requests](controller.md), and with a list of initial permissions (the ones given to the application).

## Child processes

A process can create _child processes_ (it's called a _fork_). The child process will roughly be a 1:1 copy of the parent process, but with its own unique PID.

Child processes automatically inherit their parent's permissions.

When a process exits, all its child processes are immediatly killed. It's up to the process to ensure its children are properly terminated before it.

## Threading

A process can create _threads_, which are still a part of the process. Threads allow to run multiple part of a process concurrently, as the kernel may run several threads in different processor cores.

All threads share the same address space and memory, although they all have a reserved space called the [_thread-local storage_](#thread-local-storage).

Threads work as a hierarchy ; when a thread creates another, it is called the new thread's _parent_, while the new thread is its _child_. When a thread terminates, all its children are instantly destroyed.

### Main thread

When a process starts, its instruction run its _main thread_. Due to threads being hierarchised, exiting the main thread will result in all other threads being closed immediatly, which is why the main thread should always first terminate its children properly to ensure all data are synchronized for instance.

### Thread-local storage

Threads have a reserved portion of memory in their address space called the _thread-local storage_ (TLS).

## Automatic permissions inheritance

When an application process gets a new permission, all other processes from the same application inherit it, unless this permission is granted only for this instance of the application.
