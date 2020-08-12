# `sys::hw` service

The `sys::hw` service is in charge of hardware devices. It coordinates and manages communications with the hardware.

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

- Bytes 000-139: Device's UDI
- Bytes 140-147: Device's mappable length
- Bytes 148-255: _Future-proof_

## Drivers

**TODO**

## Methods

**TODO**

## Notifications

**TODO**