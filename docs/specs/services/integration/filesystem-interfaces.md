# Filesystem interfaces

Filesystem interfaces are services that act as a layer of indirection between a storage [driver](../system/hw.md#drivers) and the [`sys::fs`](../system/fs.md) service. Their role is to translate all common filesystem operations, such as items management and modification, for filesystems that aren't [natively handled](../system/fs.md#list-of-natively-handled-filesystems). They heavily communicate with the [`sys::hw`](../system/hw.md) service to communicate with the underlying storage device.

Most methods and notifications of filesystems interfaces are also available in the [`sys::fs`](../system/fs.md) service, with first perform permissions checking and determines the device and location to perform the operation on.

As an application can only expose one single filesystem interface service, the said service will handle all of the hardware components driven by the said process. This is why the the [FSID](../../filesystem.md#filesystem-unique-identifier) of the target filesystem is provided for each request.

## Nomenclature

### Storage operating range

The _storage operating range_ (SOR) is a 32-byte information transmitted to all operation methods of the filesystem interface to indicate where the requested operation should be performed and on which devices.

It is composed of:

- The device's [UDI](../system/hw.md#unique-device-identifier) (8 bytes)
- The filesystem's [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- The partition's first byte address on the device (8 bytes)
- The partition's last byte address on the device (8 bytes)

The FSID is only useful to identify partitions more easily, and to inform clients in notifications.

### Filesystem paths

Filesystem paths are used to refer to specific filesystem elements and are encoded as either a `0x01` byte followed by a [FEID](../../filesystem.md#element-unique-identifier), or a `0x02` byte followed by a [split path](#split-paths).

### Split paths

All paths manipulated and returned by a filesystem interface services are encoded as _split paths_: [delimited lists](../../kernel/data-structures.md#delimited-lists) of [delimited strings](../../kernel/data-structures.md#delimited-strings).

Each entry of the list must be a path's component. The entries, joined with a slash (`/`), should form a valid path.

Empty and `.` components are ignored, while components equal to `..` will make this component ignored and remove the previous component in the list.

The slash (`/`) character is forbidden in components.

### Capabilities list

The _capabitilies list_ is a 2-byte long value which indicate the capabitilies of a given filesystem.

- Bit  0: set if the filesystem is writable
- Bit  1: set if the filesystem handles [symbolic links](../../filesystem.md#symbolic-links)
- Bit  2: set if the filesystem stores modification dates
- Bit  3: set if the filesystem stores last access dates
- Bit  4: set if the filesystem can store an owner UID on 8 bytes
- Bit  5: set if the filesystem can natively store a [storage permissions map](../../storage-permissions-map.md)
- Bit  6: set if the interface can store a [storage permissions map](../../storage-permissions-map.md) in the filesystem
- Bit  7: set if the filesystem can store a partition name up to 32 bytes
- Bit  8: set if the filesystem can store a partition name up to 256 bytes
- Bit  9: set if the filesystem can store a partition icon up to 1 KB (for a 16 x 16 pixels [icon](../../kernel/data-structures.md#bitmap-images))
- Bit 10: set if the filesystem can store a partition icon up to 4 KB (for a 24 x 24 or 32 x 32 pixels [icon](../../kernel/data-structures.md#bitmap-images))

In case the filesystem can't natively handle a [storage permissions map (SPM)](../../storage-permissions-map.md), the interface is allowed to store, query and update the map in the filesystem by itself, using non-native ways such as extended attributes. In such case, the relevant bit must be set to indicate a SPM can be stored on this filesystem.

### Filesystem metadata

A _filesystem metadata_ is a structure describing the a single filesystem:

- [Capabilities list](#capabilities-list) (2 bytes)
- Partition's total size in bytes (8 bytes)
- Partition's used space in bytes (8 bytes)
- Partition's free space in bytes (8 bytes) - used in case a part of the partition could not be used for any reason
- Partition's name as a [delimited string](../../kernel/data-structures.md#delimited-strings)
- [Optional](../../kernel/data-structures.md#options) filesystem [icon](../../kernel/data-structures.md#bitmap-images)

## Methods

### `0x01` HANDLED_FS_LIST

Get informations about each filesystem handled by the current interface.

**Arguments:**

_None_

**Answer:**

- [Delimited list](../../kernel/data-structures.md#delimited-lists) of [filesystem metadata](#filesystem-metadata)

**Errors:**

_none_

### `0x02` IS_VALID_PARTITION

Check if a given partition is of the type of filesystem handled by the current interface.

**Arguments:**

- First bytes of the partition (512 bytes)
- Last bytes of the partition (512 bytes)

**Answer:**

- Identifier of the filesystem if it can be handled by the current interface, `0` otherwise (1 byte)

**Errors:**

_None_