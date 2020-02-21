# Services

This document describes the architecture of [services](../technical/services.md), as well as the list of all system services and their main features.

## Architecture of a service

Application services have exactly one running instance per active user, to prevent a user to connect to the service of a user with more privileges than itself. System services, on their side, only have one global instance.

An application process can tell if it was started as a service or not by looking at its [execution context](applications/context.md).

Once a service process indicates it's ready using the [`READY`](syscalls.md#0x04-ready) syscall, other processes will be able to _connect_ to this service.

### Connections

A _connection_ is the opening of two communication [IUC](../technical/processes.md#inter-process-uni-directional-channels) (one for reading and one for writing) between a service and another process called its _client_.

When a process wants to connect to a service, it uses the [`CONNECT_SERVICE`](syscalls.md#0x20-connectservice) to send a _connection request_ to this service.

The service process then receives the request through the [`SERVICE_CONN_REQUEST`](signals.md#0x30-serviceconnrequest).

It is expected to answer under a short delay specified in the [registry](registry.md)'s `system.signals.service_answer_delay` key (1000 ms by default).

If the service refuses the connection, it provides its answer through the [`REJECT_SERVICE_CONN`](signals.md#0x31-rejectserviceconn) signal, and the procedure stops here.

Else, it accepts it through the [`ACCEPT_SERVICE_CONN`](signals.md#0x30-acceptserviceconn) signal. A new thread is then created in the service's process, and the signal returns with a code indicating if the current thread is the one that was just created.

### Thread types

A service process' threads are called _dispatcher threads_, except threads that are created using the [`ACCEPT_SERVICE_CONN`](signals.md#0x30-acceptserviceconn) signal, which are called _client threads_.

### Closing a connection

The service cannot terminate a connection by itself.
If a client thread terminates brutally, the [`SERVICE_CLOSED`](signals.md#0x21-serviceclosed) signal will be sent to its client.

Only clients can properly close a connection to a service, using the [`END_SERVICE_CONN`](syscalls.md#0x21-endserviceconn) syscall. The IUC communication channels immediatly close (on both the client and the thread's sides).

The service then receives the [`SERVICE_CLIENT_CONN_END`](signals.md#0x31-serviceclientconnend) signal.

If the client terminates brutally (before the connection was properly ended), the client thread receives the [`SERVICE_CLIENT_CLOSED`](signals.md#0x32-serviceclientclosed) signal.

When a client thread receives on these two signals, it is expected to end as soon as possible (though there is no time limit).

## System services

You can find below the list of system services, as well as the list of their features.

**TODO**
