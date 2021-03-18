# Hardware management

This document describes how the kernel interacts with hardware.

- [Hardware detection](#hardware-detection)
- [Connection interface identifier](#connection-interface-identifier)
- [Connection-specific device descriptor](#connection-specific-device-descriptor)
- [Kernel device identifier](#kernel-device-identifier)
- [Raw device descriptor](#raw-device-descriptor)
- [Drivers](#drivers)
- [Kernel communication](#kernel-communication)

## Hardware detection

Devices are detected during the boot process and then periodically after startup. This allows to hotplug some additional components afterwards.

As all components do not use the same connection protocols, the detection process depends on the connection:

* PCI-Express components are detected through their Configuration Space
* IDE/SATA components are detected through the IDE/SATA controller
* USB components are enumerated through the USB protocol stack

Some components may not be detected through these though, such as some legacy ISA devices, which will be detected through a set of methods like ACPI enumeration or simply checking UART serial ports.

## Connection interface identifier

The *connection interface identifier* (CII) is a 4-byte number describing what a component is connected to:

- Connection type (1 byte):
  - `0x01`: PCI-Express
  - `0x02`: IDE
  - `0x03`: SATA
  - `0x04`: M.2
  - `0x05`: USB
  - `0x06`: RGB
- Bus number (1 byte)
- Port number (2 bytes)

For instance, the seventh USB port on the second bus will have the `0x05010006` CII.

## Connection-specific device descriptor

All hardware components (devices) expose a normalized identifier whose format depends on the connection type (PCI-Express, SATA, ...). This identifier is called the _connection-specific device descriptor_ (CSDD).

Its size can vary up to 256 bytes.

## Kernel device identifier

The _kernel device identifier_ is an 8-byte identifier computed from the [CII](#connection-interface-identifier) and the [CSDD](#connection-specific-device-descriptor). It is unique across all components, consistent across reboots, and identical from one computer to another for the same device. It is only meant for internal use by the [`sys::hw`](../services/system/hw.md) service, which generates an [UDI](../services/system/hw.md#unique-device-identifier) for external use.

## Raw device descriptor

The _raw device descriptor_ (RDD) is a data structure (up to 260 bytes) made of the followings:

- [KDI](#kernel-device-identifier) (8 bytes)
- [CII](#connection-interface-identifier) (4 bytes)
- Size of the [CSDD](#connection-specific-device-descriptor), in bytes (1 byte)
- [CSDD](#connection-specific-device-descriptor) (up to 256 bytes)

This descriptor is then used by the [`sys::hw`](../services/system/hw.md) service to expose the device to the rest of the operating system.

## Drivers

Drivers and software <-> hardware devices communications are handled by the [`sys::hw`](../services/system/hw.md) system service.

You can find more about how drivers work in [this section](../services/system/hw.md#drivers).

## Kernel communication

The kernel does not identify components, as this task is relegated to the [`sys::hw`](../services/system/hw.md) service. In order to communicate with hardware components, only the [CII](#connection-interface-identifier) is provided.