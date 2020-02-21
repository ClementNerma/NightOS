# Processes

**WARNING: This document is far from being complete and may lack a good description of what processes are, and/or the features they offer.**

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