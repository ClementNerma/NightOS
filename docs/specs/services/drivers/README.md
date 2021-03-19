# Driver services

This document lists all [driver services](../../services.md#types-of-services), which are services whose methods and notifications follow a convention established by the [`sys::hw`](../system/hw.md) service to permit interaction with hardware devices.

An application exposing such a service in its [manifest](../../applications/manifest.md) will gain the permission to [register itself as a driver](../system/hw.md#0x10-register_driver) through the [`sys::hw`](../system/hw.md) service.

These services are not available directly to the end applications ; they can only be used through [system services](../system/README.md).

## Error codes

Error codes follow a specific convention, but all may not be returned by the services in case of errors.

Some error codes are only reserved to services supporting the additional check tied to the said error code.

Also, all drivers can use:

* The `0x30` error code to indicate the provided [UDI](../system/hw.md#unique-device-identifier) is invalid or not driven by the current driver service
* The `0x5F` error code to indicate an unspecified hardware error occurred.

## List of driver services

The list below indicates the service as well as the [DDT](../system/hw.md#driven-device-type) it is tied to.

### Storage drivers

* `0x0001` [Storage driver service](storage.md)