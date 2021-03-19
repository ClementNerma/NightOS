# Processes

Apart from the kernel itself, all programs run in _processes_.

- [Why processes](#why-processes)
- [Types of processes](#types-of-processes)
- [Process identifier](#process-identifier)
- [Process attributes](#process-attributes)
- [Drivable devices](#drivable-devices)
- [Raw permissions](#raw-permissions)

## Why processes

Separating programs in threads presents several advantages:

1. This allows to take advantage of multi-core architectures by running multiple programs in parallel
2. Each program has its own data space and does not share its data with other programs
3. Each process has its own permissions and thus cannot bypass what the user chosen

## Types of processes

There are two types of processes:

* [System services](../services.md#system-services), which are handled by the system and have a fixed [PID](#process-identifier)
* Userland processes, which are [application](../../concepts/applications.md) processes

This implies it is not possible to run an executable as standalone in its own process.

## Process identifier

Each process is identified by a 64-bit number, which is guaranteed to be unique until the system restarts. When a process terminates, the PID is not freed. The PID is not randomly generated, but retrieved from a system-wide counter incremented when a new process starts. PID cannot be equal to 0.

System services can be identified by a PID strictly smaller than 100, while userland processes have a PID greater or equal to 100.

## Process attributes

Each process has a set of _attributes_ which contains critical informations on it (lists are usually [PLL](data-structures.md#packed-linked-lists)):

- PID (8 bytes)
- Priority (1 byte)
- System marker (1 byte) to indicate if the process comes from a system program
- [Running user](../../concepts/users.md)'s ID (8 bytes)
- Parent application [ANID](../applications-libraries.md#application-identifier) (8 bytes) - `0` for system services
- Pointer to the [execution context](../applications/context.md) (8 bytes) - `0` for system services
- `PLL(e=32)` for memory mappings
- `PLL(e=32)` for [raw permissions](#raw-permissions)
- `PLL(e=32)` for [drivable devices](#drivable-devices)

## Drivable devices

The drivable devices attribute contains the list of all devices' [KDI](hardware.md#kernel-device-identifier) the current process can drive.

The goal of this attribute is to determine if the process is allowed to map a device's memory by creating an [AMS](memory.md#abstract-memory-segments) from it using the [`DEVICE_AMS`](syscalls.md#0x63-device_ams) syscall, as well as using DMA-related instructions in the CPU.

This attribute is managed by the [`sys::hw`](../services/system/hw.md) service and can only be updated by it.

## Raw permissions

_Raw permissions_ are used by system services to determine the permissions of a process without [sending a message](ipc.md#exchanges-and-messages) to the [`sys::perm`](../services/system/perm.md) service and waiting for its answer, which would be costly in terms of performance.

These permissions use a specific structure, specified in the [related service's specifications document](../services/system/perm.md#list-of-permissions).

Permissions can be managed using the [`sys::perm`](../services/system/perm.md) service.