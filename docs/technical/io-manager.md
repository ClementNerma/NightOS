# I/O nano-manager

The _Input/Output Nano-manager_, formerly known as *Ion*, is a part of the system which treats input/output requests from processes.

## Hardware access

When a process tries to access the hardware, it must go through Ion, which will allow it or not to interact with the desired component.

[System services](services.md) like [`sys:fs`](../specs/services.md#sysfs) or [`sys:net`](../specs/services.md#sysnet) use Ion to deal with the related hardware components.

## Requests

When a process tries to access, for instance, the filesystem, it sends an I/O request to the manager which is pushed in an internal queue. The manager sorts incoming requests and treat them depending on their arrival.

## Permissions

To ensure a process has the required permissions to make a specific I/O request, the manager asks the [controller](controller.md) to verify its permissions. The controller's response makes the manager accept or reject the request.

## Requests priority

Requests are treated by priority, which is made both of its arrival timestamp (first one, first out) but also of the process' priority: a process with an higher priority will see its I/O requests treated more quickly.
