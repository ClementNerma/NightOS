# I/O nano-manager

The _Input/Output Nano-manager_, formerly known as _Ion_, is a part of the system which treats input/output requests from processes.

It is concretely represented by the [`sys::hw`](../specs/services/system/hw.md) service.

- [Hardware access](#hardware-access)
- [Requests priority](#requests-priority)

## Hardware access

When a process tries to access the hardware, it must go through Ion, which will allow it or not to interact with the desired component.

[System services](services.md) such as [`sys::fs`](../specs/services/system/fs.md) or [`sys::net`](../specs/services/system/net.md) use Ion to deal with the related hardware components.

# Agnosticity

Ion only permits agnostic access to hardware, meaning it does not have knowledge of the performed action (filesystem access, sensor reading, ...). It can only be accessed by [drivers](../specs/services/system/hw.md#drivers).

Non-agnostic access can be performed through various services, such as [`sys::fs`](../specs/services/system/fs.md).

## Requests priority

Requests are treated by priority, which is made both of its arrival timestamp (first one, first out) but also of the process' priority: a process with an higher priority will see its I/O requests treated more quickly.
