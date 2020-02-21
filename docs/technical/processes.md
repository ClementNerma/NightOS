# Processes

NightOS _processes_ are implemented a bit like Linux' ones, with additional features.
There are several types of processes:

* _System processes_, which are created by the system ;
* _Application processes_, in which applications run ;
* _Worker processes_, in which applications' workers run

The base and system processes are called _low-level processes_, while application and worker ones are called _userland processes_.

## User permissions

Each process is ran as a specific user, which determines the maximum allowed scope for [controller requests](controller.md), and with a list of initial permissions (the ones given to the application).

## Child processes

A process can create _child processes_ (it's called a _fork_). The child process will roughly be a 1:1 copy of the parent process, but with its own unique PID.

Child processes automatically inherit their parent's permissions.

When a process exits, all its child processes are immediatly killed. It's up to the process to ensure its children are properly terminated before it.

## Automatic permissions inheritance

When an application process gets a new permission, all other processes from the same application inherit it, unless this permission is granted only for this instance of the application.

## Inter-process Uni-directional Channels

_Inter-process Uni-directional Channels_ (IUC) allow two distinct processes to communicate.

IUS are made of two uni-directional parts:

* A _sender channel_ (SC) which can only be written to (write-only)
* A _receiver channel_ (RC), which can only be read from (read-only)

Note that there may be multiple SC or RC as they can be [cloned](#TODO).

The two processes sharing an IUS are:

* The _sender process_, which uses the SC to send data to the other process
* The _receiver process_, which uses the RC to retrieve data sent by the other process

The process that creates the IUS gets both the SC and the RC, and is expected to provide one of them to another process.

When a process is created, it gets several de-facto IUS:

* The standard input ;
* The standard normal output ;
* The standard error output ;

Each SC and RC has a unique identifier.

An IUC is considered _closed_ as soon as all its SC _or_ all its RC were provided to processes 

IUC are the base of [Inter-Process Communication](ipc.md).
