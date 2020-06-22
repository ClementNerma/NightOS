# Services

A _service_ is a process that launches at startup and may receive [IPC](ipc.md) messages from any process.

## System services

System services are of processes with a fixed PID. They have system permissions and as such are allowed to perform any task.
Their purpose is to allow processes to perform specific actions like permissions management or filesystem access without hunging up the [kernel](../specs/kernel/README.md).

Each system service is a system application, exposing a service. Most also expose command-line tools.

You can find the list of system services in the [specifications document](../specs/services.md).

## Application services

Application services, also called _userland services_, are provided by [applications themselves](../concepts/applications.md#services).
