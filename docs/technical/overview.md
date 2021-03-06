# Overwiew

This document presents a global overview of NightOS. It is only a simplified representation of the system, but allows to better understand its architecture and organization.

The referenced documents are mostly technical overviews themselves, which is why links to their associated specification document are also provided (marked as _(specs)_).

Note that this is only an overview, and as such many topics will not be covered by this document. For more informations, refer to the [global document](../README.md).

- [Program executions](#program-executions)
- [Permissions](#permissions)
- [Hardware access](#hardware-access)
- [Hardware drivers](#hardware-drivers)
- [Hardware access performances](#hardware-access-performances)
- [Filesystem access](#filesystem-access)
- [Data loss prevention](#data-loss-prevention)
- [User interface](#user-interface)
- [Users management](#users-management)
- [Children protection](#children-protection)
- [External security](#external-security)
- [For developers](#for-developers)

## Program executions

NightOS doesn't allow to run standalone binaries. Every running code is either:

* Part of the system, as the [kernel (specs)](../specs/kernel/README.md) itself or as a [system service](services.md#system-services) ([specs](../specs/services/system/README.md)).
* Part of an [application](../concepts/applications.md) ([specs](../specs/applications-libraries.md))

System services are immutable and run for the entire system's lifespan, while applications can be opened and closed at anytime, and can also run as multiple instances in parallel.

## Permissions

While the system has every right on the system itself, applications are restricted and can do almost nothing by default.

Capabitilies can be granted through [permissions](../features/permissions.md) ([specs](../specs/permissions.md)), which are designed to allow precise control on what an application can do or not, while requiring as few user interactions as possible.

## Hardware access

Hardware access is performed through two layers:

* First, the kernel [detects and enumerate (specs)](../specs/kernel/hardware.md) hardware devices
* Then, hardware is accessed through the [hardware service (specs)](../specs/services/system/hw.md)

## Hardware drivers

Unlike most operating systems, hardware drivers are simple applications with no specific integration in the kernel.

Any application can register itself as [a driver (specs)](../specs/services/system/hw.md#drivers) using the [hardware service (specs)](../specs/services/system/hw.md).

The relevant driver for each hardware device is selected using [various criterias (specs)](../specs/services/system/hw.md#driver-selection).

## Hardware access performances

Hardware access is performed through [syscalls (specs)](../specs/kernel/syscalls.md) and [signals (specs)](../specs/kernel/signals.md), which use CPU interruptions. 

The access process is often:

* A userland process notifies a [system service](services.md#system-services)
* The system services contacts the [hardware service (specs)](../specs/services/system/hw.md)
* The hardware service contacts the [relevant (specs)](../specs/services/system/hw.md#driver-selection) [driver (specs)](../specs/services/system/hw.md#drivers)
* The driver performs the requested task by communicating with the hardware through the hardware service
* The action's result is then transmitted to the hardware service, which then transmits it to the system service, which in turns transmits it to the userland process

Although this process can seem a bit long, CPU interruptions and [forced threading (specs)](../specs/services.md#connections) makes the theoric latency low enough for intensive use.

## Filesystem access

Accessing and managing filesystems and their content is faster than common hardware operations thanks to [direct storage access](../specs/services/system/hw.md#direct-storage-access-for-sysfs) (and [direct driver access](../specs/services/system/hw.md#direct-driver-access-for-sysfs) for worst-case scenarios).

The typical process involves communication with the [filesystem service](../specs/services/system/fs.md) which [communicates directly](../specs/services/system/hw.md#direct-storage-access-for-sysfs) with storage devices.

For filesystems that [aren't natively supported](../specs/services/system/fs.md#list-of-natively-supported-filesystems), a [filesystem interface](../specs/services/integration/filesystem-interfaces.md) is involved to communicate with the [storage driver service](../specs/services/drivers/storage.md), which then communicates with the [hardware service](../specs/services/system/hw.md). This involves a higher latency, but is only limited to edge cases and remains in an acceptable range of performances.

## Data loss prevention

Data loss prevention works essentially through [crash saves](../features/crash-saves.md), which ensure applications' state is regularly saved on disk in case something goes wrong.

## User interface

The user interface is entirely managed by the [desktop environment](../ux/desktop-environment.md), which can be any [application](../concepts/applications.md) exposing the [relevant service (specs)](../specs/services/integration/desktop-environments.md).

## Users management

Each person using a computer can have its own [user account](../concepts/users.md).

## Children protection

Children can get their own [user account](../concepts/users.md) with [parental control](../features/parental-control.md).

## External security

External security is guaranteed through [by-default encryption](../features/encryption.md), and [additional per-user encryption](../features/encryption.md#per-user-encryption).

## For developers

Developers can access additional features through the [developer mode](dev-mode.md).