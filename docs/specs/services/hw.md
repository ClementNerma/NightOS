# `sys::hw` service

The `sys::hw` service is in charge of hardware devices. It coordinates and manages communications with the hardware.

- [Hardware detection](#hardware-detection)
- [Device formats](#device-formats)
  - [Device type descriptor](#device-type-descriptor)
  - [Device identifier](#device-identifier)
  - [Device descriptor](#device-descriptor)
  - [Patterns](#patterns)
- [Drivers](#drivers)
- [Methods](#methods)
  - [`0x01` ENUM_DEVICES](#0x01-enum_devices)
  - [`0x02` SUBSCRIBE_DEVICES](#0x02-subscribe_devices)
- [Notifications](#notifications)
  - [DEVICE_EVENT](#device_event)

## Hardware detection

Hardware detection is handled by [the kernel itself](../kernel/hardware.md#hardware-detection), which then exposes a [_raw device descriptor_ (RDD)](../kernel/hardware.md#raw-device-descriptor) as well as a [_connection interface identifier_ (CII)](../kernel/hardware.md#connection-interface-identifier).

## Device formats

This section describes the multiple formats used by this service to deal with devices.

### Device type descriptor

From the RDD and CII is derived the _device type descriptor_ (DTD), which describes the device's type. Its composition and size depends on the connection type, but it varies from empty (0 byte) if the connection type guarantees no information, up to 256 bytes.

***The format remains to be determined but should be along the lines of a number-based equivalent of ModAlias, like :***

- PCI-Express:
  - Vendor (8 bytes)
  - Sub-vendor (8 bytes)
  - Type (8 bytes)
  - Sub-type (8 bytes)
  - ...
- ...

### Device identifier

It also derives a _unique device identifier_ (UDI) encoded on 265 bytes, which is made of:

- SDI (4 bytes)
- CII (4 bytes)
- Size of the DTD (1 byte)
- DTD (256 bytes, weakest bits filled with zeros)

### Device descriptor

A _device descriptor_ is a data structure with the following format:

- Bytes 000-264: Device's UDI
- Bytes 265-272: Device's mappable length
- Bytes 273-512: _Future-proof_

### Patterns

Several methods of this service use _patterns_, which allow to match devices depending on several criterias.

A pattern is a data structure whose size varies from 5 to 277 bytes made of the following:

- Pattern (1 byte)
  - Bit 0: match all connection types
  - Bit 2: match all buses
  - Bit 3: match all ports
- Connection type (1 byte)
- Bus number (1 byte)
- Port number (1 byte)
- DTD length (1 byte) - `0` to omit DTD
- DTD pattern indicator (16 bytes, only if DTD) - indicates which bytes of the DTD must be used as patterns
- DTD (up to 256 bytes)

It's possible to match only devices that use a given connection type, and more specifically on a given bus and/or port.  

It's also possible to list only devices that match a specific DTD pattern. For that, the bit corresponding to the byte number in the DTD pattern indicator must be set.

For instance, providing the DTD `0x0100B2` with the DTD pattern indicator set to `0b01000000`, the second byte will match all devices.

## Drivers

**TODO**

## Methods

### `0x01` ENUM_DEVICES

Enumerate connected devices.

It's also possible to only count the number of devices matching the provided criterias by providing a start index and end index of `0`.

**Required permissions:**

- `devices.enum`

**Arguments:**

- Start index (4 bytes)
- End index (4 bytes)
- [Pattern](#patterns) (277 bytes)

**Answer:**

- Number of found devices globally (4 bytes)
- Number of devices listed in this answer (4 bytes)
- Data descriptor of each device (256 bytes * number of devices)

**Errors:**

- `0x10`: Start index is lower than the end index
- `0x11`: Invalid connection type
- `0x12`: Bus number was provided without a connection type
- `0x13`: Port number was provided without a connection type
- `0x14`: Both bus number and port number were provided
- `0x15`: Invalid DTD
- `0x20`: Range is greater than the available answer size
- `0x21`: Provided bus was not found
- `0x22`: Provided port was not found

### `0x02` SUBSCRIBE_DEVICES

Subscribe to events related to devices matching a patterns.  
All current and future devices matching this pattern will cause a [`DEVICE_EVENT`](#device_event) notification.

**Required permissions:**

- `devices.subscribe`

**Arguments:**

- `0x00` to subscribe, any other value to unsubscribe
- [Pattern](#patterns) (277 bytes)

**Answer:**

_None_

**Errors:**

- `0x20`: Asked to unsubscribe but no subscription is active for this pattern

## Notifications

### DEVICE_EVENT

Sent for devices a process subscribed to with [`SUBSCRIBE_DEVICES`](#0x02-subscribe_devices).

**Datafield:**

- Device descriptor (512 bytes)
- Event code (1 byte):
  - `0x10`: device was just connected
  - `0x11`: a driver was just selected for the device
  - `0x12`: the device is ready to use
  - `0x20`: device was disconnected (software)
  - `0x21`: the device is being disconnected by its driver
  - `0x22`: the device has been disconnected by the driver
  - `0x23`: the device was brutally disconnected (hardware)
  - `0x30`: device was just put to sleep
  - `0x31`: device was just awoken from sleep
- Indicator (1 byte):
  - Bit 0: set if this device is connected for the first time
  - Bit 1: set if this device was disconnected brutally (not by the system itself)
  - Bit 2: set if this device is connected for the first time on this specific port
