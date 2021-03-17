# Processes

Apart from the kernel itself, all programs run in _processes_.

- [Why processes](#why-processes)
- [Types of processes](#types-of-processes)
- [Switching and cycles](#switching-and-cycles)
- [Process identifier](#process-identifier)
- [Process attributes](#process-attributes)
- [Performance balancing](#performance-balancing)
  - [Automatic priority attribution](#automatic-priority-attribution)
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

## Switching and cycles

To run processes, the kernel simply iterates over the list of existing processes, and allow them to run a given number of instructions. Then, the control is taken back by the kernel which runs the next process, and so goes on.

This happens as follows:

1. A process is selected
2. If the process is currently suspended, it is ignored
3. Its registers are restored by the kernel (if any)
4. The process runs a given number of instructions
5. The kernel takes back the control of the CPU
6. The process' registers are saved
7. Go to step 1

These steps are known as a _cycle_.

## Process identifier

Each process is identified by a 64-bit number, which is guaranteed to be unique until the system restarts. When a process terminates, the PID is not freed. The PID is not randomly generated, but retrieved from a system-wide counter incremented when a new process starts. PID cannot be equal to 0.

## Process attributes

Each process has a set of _attributes_ which contains critical informations on it (lists are usually [PLL](data-structures.md#packed-linked-lists)):

- PID (8 bytes)
- Priority (1 byte)
- System marker (1 byte) to indicate if the process comes from a system program
- Running user's ID (8 bytes)
- Parent application ID (8 bytes) - `0` for system services
- Pointer to the [execution context](../applications/context.md) (8 bytes) - `0` for system services
- `PLL(e=32)` for memory mappings
- `PLL(e=32)` for [raw permissions](#raw-permissions)
- `PLL(e=32)` for [drivable devices](#drivable-devices)

## Performance balancing

Each process has a _priority_ number, between 1 and 20, which indicates how much its performances must be prioritized compare to other processes.

The basics can be found [here](../../features/balancer.md).

More specifically, the higher the priority of a process is, the faster it will run. Here are the priority-dependant aspects of a process:

- Number of instructions run per cycle
- Priority when accessing I/O through services

Comparatively, when a process has a high priority, other processes will run a tad slower.

### Automatic priority attribution

Processes' priority is automatically adjusted by the kernel, unless it is manually assigned through the [`SYS_SET_PRIORITY`](syscalls.md#0xd3-sys_set_priority) syscall.

The priority is determined based on multiple factors:

- Does the process have a fullscreen window?
- Does the process owns the active window?
- Does the process owns a visible window?
- Is the process a driver or service? If so, how much is it used?

## Drivable devices

The drivable devices attribute contains the list of all devices' [SDI](hardware.md#session-device-identifier) the current process can drive.

The goal of this attribute is to determine if the process is allowed to map a device's memory by creating an [AMS](memory.md#abstract-memory-segments) from it using the [`DEVICE_AMS`](syscalls.md#0x34-device_ams) syscall, as well as using DMA-related instructions in the CPU.

This attribute is managed by the [`sys::hw`](../system-services/hw.md) service and can only be updated by this service.

## Raw permissions

_Raw permissions_ are used by system services to determine the permissions of a process without [sending a message](ipc.md#exchanges-and-messages) to the [`sys::perm`](../system-services/perm.md) service and waiting for its answer, which would be costly in terms of performance.

These permissions use a specific structure, specified in the [related service's specifications document](../system-services/perm.md#list-of-permissions).

Permissions can be managed using the [`sys::perm`](../system-services/perm.md) service.