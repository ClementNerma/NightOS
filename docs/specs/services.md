# Services

This document describes the architecture of [services](../technical/services.md), as well as the list of all system services and their main features.

- [Architecture of a service](#architecture-of-a-service)
  - [Connections](#connections)
  - [Communication](#communication)
  - [Thread types](#thread-types)
  - [Closing a connection](#closing-a-connection)
- [System services](#system-services)
- [Third-party communication](#third-party-communication)

## Architecture of a service

Application services have exactly one running instance per active user, to prevent a user to connect to the service of a user with more privileges than itself. System services, on their side, only have one global instance.

An application process can tell if it was started as a service or not by looking at its [execution context](applications/context.md#execution-context).

Once a service process indicates it's ready using the [`READY`](kernel/syscalls.md#0x04-ready) syscall, other processes will be able to _connect_ to this service.

### Connections

A _connection_ essentially consists of a [service socket](kernel/ipc.md#service-sockets) between a service and another process called its _client_.

When a process wants to connect to a service, it uses the [`CONNECT_SERVICE`](kernel/syscalls.md#0x2a-connect_service) to send a _connection request_ to this service.

The service process then receives the request through the [`SERVICE_CONN_REQUEST`](kernel/signals.md#0x2a-service_conn_request).

It is expected to answer under a short delay specified in the [registry](registry.md)'s `system.signals.service_answer_delay` key (1000 ms by default).

If the service refuses the connection, it provides its answer through the [`REJECT_SERVICE_CONN`](kernel/syscalls.md#0x2d-reject_service_conn) syscall, and the procedure stops here.

Else, it accepts it through the [`ACCEPT_SERVICE_CONN`](kernel/syscalls.md#0x2c-accept_service_conn) syscall. A new thread is then created in the service's process, and the signal returns with a code indicating if the current thread is the one that was just created.

### Communication

The service and its client(s) communicate through the service socket created during the connection.

The different message formats a client can send to a service are a called the service's _methods_, while the different message formats the service may send to a client are called the service's _notifications_.

### Thread types

A service process' main thread is called its _dispatcher threads_, while threads created using the [`ACCEPT_SERVICE_CONN`](kernel/syscalls.md#0x2c-accept_service_conn) syscall are called _client threads_.

### Closing a connection

The service cannot terminate a connection by itself.
If a client thread terminates brutally, the [`SERVICE_SERVER_QUITTED`](kernel/signals.md#0x2d-service_server_quitted) signal will be sent to its client.

Only clients can properly close a connection to a service, using the [`END_SERVICE_CONN`](kernel/syscalls.md#0x2b-end_service_conn) syscall. The service socket is then immediatly closed (on both the client and the thread's side).

The service then receives the [`SERVICE_CLIENT_QUITTED`](kernel/signals.md#0x2c-service_client_quitted) signal.

If the client terminates brutally (before the connection was properly ended), the client thread receives the [`SERVICE_CLIENT_CLOSED`](kernel/signals.md#0x2b-service_client_closed) signal.

When a client thread receives on these two signals, it is expected to end as soon as possible (though there is no time limit).

## System services

You can find the list of all system services in the [related directory](services/README.md).

## Third-party communication

An application can enable communication to and from other applications thanks to a service.

For instance, let's consider two applications, A and B. If A wants to be able to be contacted by other applications (such as B), it sets up a service and subscribes to it. Then, when B sends a message to the service, it is forwarded to A through a notification by the service itself.

It can also work the other way: B subscribes to the service, and when A wants to contact B, it simply sends a message to B.

The downside of this structure is that latency is approximately doubled compared to a direct A-B communication. But as they use messages and notifications, which are based on hardware interrupts, the latency is extremely low, mainly composed of the time the kernel spends to ensure the communication between A and the service and then the service and B (or the other way around) is allowed.