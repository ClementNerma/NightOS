# Hardware management

This document describes how the kernel interacts with hardware.

- [Hardware detection](#hardware-detection)
- [Raw device descriptor](#raw-device-descriptor)
- [Connection interface identifier](#connection-interface-identifier)
- [Device identifier](#device-identifier)
- [Drivers](#drivers)

## Hardware detection

Devices are detected during the boot process and then periodically after startup. This allows to hotplug some additional components afterwards.

As all components do not use the same connection protocols, the detection process depends on the connection:

* PCI-Express components are detected through their Configuration Space
* IDE/SATA components are detected through the IDE/SATA controller
* USB components are enumerated through the USB protocol stack

Some components may not be detected through these though, such as some legacy ISA devices, which will be detected through a set of methods like ACPI enumeration or simply checking UART serial ports.

## Raw device descriptor

All hardware components (devices) expose a normalized identifier whose format depends on the connection type (PCI-Express, SATA, ...). This identifier is called the _raw device descriptor_ (RDD).

This descriptor is then used by the [`sys::hw`](../services/hw.md) service to expose the device to the rest of the operating system.

Its size can vary up to 256 bytes.

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

## Device identifier

The kernel generates for each device a _session device identifier_ (SDI), which is a random 4-byte number specific to the current session, allowing to plug up to 4 billion devices in a single session.

## Drivers

Drivers and software <-> hardware devices communications are handled by the [`sys::hw`](../services/hw.md) system service.

You can find more about how drivers work in [this section](../services/hw.md#drivers).