# Inter-Process Communication

This document describes the way [Inter-Process Communication (IPC)](../technical/ipc.md) works.

## Pipes

_Inter-process Uni-directional Channels_ (IUC), also called _pipes_, allow two distinct processes to communicate.

Pipes are made of two uni-directional parts:

* A _sender channel_ (SC) which can only be written to (write-only)
* A _receiver channel_ (RC), which can only be read from (read-only)

The two processes sharing a pipes are:

* The _sender process_, which uses the SC to send data to the other process
* The _receiver process_, which uses the RC to retrieve data sent by the other process

The process that creates the pipe gets both the SC and the RC, and is expected to provide one of them to another process.

When a process is created, it gets several de-facto IUC:

* The standard input ;
* The standard normal output ;
* The standard error output ;

Each SC and RC has a unique identifier.

## Shared Memory

**TODO**