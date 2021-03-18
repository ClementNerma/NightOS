# `sys::fs` service

The `sys::fs` service is in charge of operations related to the [filesystems](../../filesystem.md).

## Behaviour

### Operations and latency

A single filesystem operation request from a client process up to the hardware component traverses:

* Client
* `sys::fs` service
* [filesystem interface](../integration/filesystem-interfaces.md) (only if the filesystem is not [supported natively](#list-of-natively-supported-filesystems))
* [storage driver service](../drivers/storage.md) (only if a filesystem interface is used, or if the storage device requires a [specific driver](../drivers/storage.md))
* Hardware storage device

The response then goes up through all layers. Note that in all cases, the [`sys::hw`](hw.md) don't need to be contacted, thanks to [direct driver access](hw.md#direct-driver-access-for-sysfs).

In the best scenario, which is for [natively supported filesystems](#list-of-natively-supported-filesystems) on storage devices that don't require a [dedicated driver](../drivers/storage.md), [direct hardware access](hw.md#direct-hardware-access-for-sysfs) is possible, reducing the traversal to:

* Client
* `sys::fs` service
* Hardware storage device

### List of natively supported filesystems

The following filesystems are natively supported, meaning they don't require a [filesystem interface](../integration/filesystem-interfaces.md) to work properly:

* Btrfs
* Ext2 / Ext3 / Ext4
* NTFS
* FAT12 / FAT16 / FAT32
* exFAT

### Extending supported filesystems

It is possible to use other filesystems that the natively supported ones, using [filesystem interfaces](../integration/filesystem-interfaces.md).

This, however, creates a higher latency as direct access and operations are not permitted anymore. The typical sequence of operations becomes:

* The client calls the `sys::fs` service to perform a given operation
* The operation is transmitted to the related [filesystem interface](../integration/filesystem-interfaces.md)...
* ...which in turns contact the [`sys::hw`](hw.md) service...
* ...which itself transmits the operation to the underlying storage [driver](hw.md#drivers)

The information then goes up:

* From the driver to `sys::hw`
* Then to the filesystem interface which translates it
* Then back to the `sys::fs` service
* And finally to the client

### Filesystems detection

The `sys::fs` serviec is responsible for detecting filesystems. It performs this by contacting the [`sys::hw`](hw.md) service to enumerate and access the different storage devices, as well as being notified when a storage device is connected, disconnected or changes.

Filesystems are detected using a variety of methods. If all fail (which is, if the filesystem is not one that is [natively supported](#list-of-natively-supported-filesystems)), [filesystem interfaces](../integration/filesystem-interfaces.md) are used one by one to find one that can handle the said filesystem, using their [`IS_VALID_PARTITION`](../integration/filesystem-interfaces.md#0x02-is_valid_partition) method.

Each partition then gets an identifier, the [filesystem unique identifier (FSID)](../../filesystem.md#filesystem-unique-identifier), which is consistent across reboots but different between computers to avoid collection of informations from the FSID alone.

## Methods

### `0x01` IS_FS_MOUNTED

Check if a given filesystem is mounted.

**Required permission:** `fs.filesystems.mounted`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Return value:**

- `0x01` if the filesystem is currently mounted, `0x00` else

**Errors:**

_None_

### `0x02` ENUM_FS

Enumerate all available filesystems.

**Required permission:** `fs.filesystems.list`

**Arguments:**

_None_

**Return value:**

- [Delimited list](../../kernel/data-structures.md#delimited-lists) of [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Errors:**

_None_

### `0x03` FS_METADATA

Get informations on a filesystem.

**Required permission:** `fs.filesystems.metadata`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Return value:**

- Mount [timestamp](../../kernel/data-structures.md#timestamps) (8 bytes)
- Mount path [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)
- [Option](../../kernel/data-structures.md#options) of the mounted volume file's [FEID](../../filesystem.md#element-unique-identifier) (1 + 8 bytes)
- [Filesystem metadata](../integration/filesystem-interfaces.md#filesystem-metadata)

**Errors:**

- `0x30`: The requested filesystem is currently not mounted

### `0x04` FS_MOUNT

Mount an existing filesystem. If no mount path is provided, the filesystem will be mounted under the `/mnt` directory.

New filesystems are [automatically detected](#filesystems-detection) when storage devices are connected.

**Required permission:** `fs.filesystems.mount.existing`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [Option](../../kernel/data-structures.md#options) of the mount path as a [delimited string](../../kernel/data-structures.md#delimited-strings)

**Return value:**

_None_

**Errors:**

- `0x30`: Unknown [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- `0x31`: This filesystem is already mounted

### `0x05` FS_UNMOUNT

Unmount a mounted filesystem.

**Required permission** `fs.filesystems.unmount`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x30`: Unknown [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- `0x31`: This filesystem is current not mounted

### `0x07` FS_WATCH

Subscribe to [`FS_CHANGED`](#0x07-fs_changed) notifications when a filesystem is mounted or unmounted.

**Required permission:** `fs.filesystems.watch`

**Arguments:**

_None_

**Return value:**

_None_

**Errors:**

_None_

### `0x08` FS_UNWATCH

Unsubscribe from [`FS_WATCH`](#0x07-fs_watch).

**Required permission:** _None_

**Arguments:**

_None_

**Return value:**

_None_

**Errors:**

_None_

## Notifications

### `0x07` FS_CHANGED

Sent to a client which subscribed through [`FS_WATCH`](#0x07-fs_watch) each time a filesystem is mounted or unmounted.

**Datafield:**

- Mount status (1 byte): `0x01` if the filesystem was mounted, `0x02` if it was unmounted
- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
