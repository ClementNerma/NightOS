# Driver services

This document lists all [driver services](../../services.md#types-of-services), which are services whose methods and notifications follow a convention established by the [`sys::hw`](../system/hw.md) service to permit interaction with hardware components.

An application exposing such a service in its [manifest](../../applications/manifest.md) will gain the permission to [register itself as a driver](../system/hw.md#0x10-register_driver) through the [`sys::hw`](../system/hw.md) service.

These services are not available directly to the end applications ; they can only be used through [system services](../system/README.md).

## List of driver services

* [Filesystem driver service](filesystem.md)