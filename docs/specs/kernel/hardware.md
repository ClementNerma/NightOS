# Hardware management

This document describes how the kernel interacts with hardware.

- [Hardware detection](#hardware-detection)
- [Connection interface identifier](#connection-interface-identifier)
- [Connection-specific device descriptor](#connection-specific-device-descriptor)
- [Kernel device identifier](#kernel-device-identifier)
- [Raw device descriptor](#raw-device-descriptor)
- [Input/output ports](#inputoutput-ports)
  - [I/O ports identifiers](#io-ports-identifiers)
- [Drivers](#drivers)
- [Kernel communication](#kernel-communication)

## Hardware detection

Devices are detected during the boot process and then periodically after startup. This allows to hotplug some additional devices afterwards.

As all devices do not use the same connection protocols, the detection process depends on the connection:

* PCI-Express devices are detected through their Configuration Space
* IDE/SATA devices are detected through the IDE/SATA controller
* USB devices are enumerated through the USB protocol stack
* Motherboard-connected devices are enumerated through the BIOS/UEFI (e.g. CPU and case fans)

Some devices may not be detected through these though, such as some legacy ISA devices, which will be detected through a set of methods like ACPI enumeration or simply checking UART serial ports.

## Connection interface identifier

The *connection interface identifier* (CII) is a 4-byte number describing what a device is connected to:

- Connection type (1 byte):
  - `0x01`: PCI-Express
  - `0x02`: IDE
  - `0x03`: SATA
  - `0x04`: M.2
  - `0x05`: USB
  - `0x06`: RGB
  - `0x07`: Fans
- Bus number (1 byte)
- Port number (2 bytes)

For instance, the seventh USB port on the second bus will have the `0x05010006` CII.

## Connection-specific device descriptor

All hardware devices expose a normalized identifier whose format depends on the connection type (PCI-Express, SATA, ...). This identifier is called the _connection-specific device descriptor_ (CSDD).

Its size can vary up to 256 bytes.

## Kernel device identifier

The _kernel device identifier_ is an 8-byte identifier computed from the [CII](#connection-interface-identifier) and the [CSDD](#connection-specific-device-descriptor). It is unique across all devices, consistent across reboots, and identical from one computer to another for the same device. It is only meant for internal use by the [`sys::hw`](../services/system/hw.md) service, which generates an [UDI](../services/system/hw.md#unique-device-identifier) for external use.

## Raw device descriptor

The _raw device descriptor_ (RDD) is a data structure (up to 260 bytes) made of the followings:

- [KDI](#kernel-device-identifier) (8 bytes)
- [CII](#connection-interface-identifier) (4 bytes)
- Size of the [CSDD](#connection-specific-device-descriptor), in bytes (1 byte)
- [CSDD](#connection-specific-device-descriptor) (up to 256 bytes)

This descriptor is then used by the [`sys::hw`](../services/system/hw.md) service to expose the device to the rest of the operating system.

## Input/output ports

The kernel first detects the I/O ports used by each device, and maps it to the device's [KDI](#kernel-device-identifier).

They are uni-directionals and as such are split in two categories: _input_ ports and _output_ ports.

Input ports are used by devices to transmit informations to the kernel. When this happens, the data is put on a stack, and [drivers](#drivers) can then retrieve it using the [`READ_IO_PORT`](syscalls.md#0x70-read_io_port) system call.

Output ports are used by [drivers](#drivers) to transmit informations to devices, using the [`WRITE_IO_PORT`](syscalls.md#0x71-write_io_port) system call.

### I/O ports identifiers

I/O ports are accessed using _relative identifiers_, which corresponds to the _nth_ port of the physical device, meaning it starts to `0` and ends to `<number of ports in the device> - 1`. The kernel transparently translates the relative identifier to the real port number.

The association with the real port number is transparently performed by the kernel.

## Drivers

A _driver_ is a process which can directly communicate with hardware devices using [the dedicated system calls](syscalls.md#0x72-device_interrupt).

They communicate with external processes through the [`sys::hw`](../services/system/hw.md) system service, or [`sys::fs`](../services/system/fs.md) when [direct driver access](../services/system/hw.md#direct-driver-access-for-sysfs) is possible.

You can find more about how drivers work in [this section](../services/system/hw.md#drivers).

Direct communication with device hardwares is made through [system calls](syscalls.md#0x72-device_interrupt).

The [`sys::hw`](../services/system/hw.md) service is considered as a driver for all devices.

## Kernel communication

The kernel does not identify devices, as this task is relegated to the [`sys::hw`](../services/system/hw.md) service. In order to communicate with hardware devices, only the [CII](#connection-interface-identifier) is provided.