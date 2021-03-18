# Filesystem interfaces

Filesystem interfaces are services that act as a layer of indirection between a storage [driver](../system/hw.md#drivers) and the [`sys::fs`](../system/fs.md) service. Their role is to translate all common filesystem operations, such as items management and modification, for filesystems that aren't [natively handled](../system/fs.md#list-of-natively-handled-filesystems). They heavily communicate with the [`sys::hw`](../system/hw.md) service to communicate with the underlying storage device.

Most methods and notifications of filesystems interfaces are also available in the [`sys::fs`](../system/fs.md) service, with first perform permissions checking and determines the device and location to perform the operation on.

As an application can only expose one single filesystem interface service, the said service will handle all of the hardware components driven by the said process. This is why the the [FSID](../../filesystem.md#filesystem-unique-identifier) of the target filesystem is provided for each request.

## Filesystem paths

Filesystem paths are used to refer to specific filesystem elements and are encoded as either a `0x01` byte followed by a [FEID](../../filesystem.md#element-unique-identifier), or a `0x02` byte followed by a [split path](#split-paths).

## Split paths

All paths manipulated and returned by a filesystem interface services are encoded as _split paths_: [delimited lists](../../kernel/data-structures.md#delimited-lists) of [delimited strings](../../kernel/data-structures.md#delimited-strings).

Each entry of the list must be a path's component. The entries, joined with a slash (`/`), should form a valid path.

Empty and `.` components are ignored, while components equal to `..` will make this component ignored and remove the previous component in the list.

The slash (`/`) character is forbidden in components.

## Methods

### `0x01` HANDLED_FS_LIST

Get informations about each filesystem handled by the current interface.

**Arguments:**

_None_

**Answer:**

- [Delimited list](../../kernel/data-structures.md#delimited-lists) of filesystem informations:
  - Identifier used for internal use in the interface (1 byte)
  - Name of the filesystem as a [delimited string](../../kernel/data-structures.md#delimited-strings)
  - [Optional](../../kernel/data-structures.md#options) filesystem [icon](../../kernel/data-structures.md#bitmap-images)
  - Capabilities byte (1 byte):
    - Bit 0: set if the filesystem is writable
    - Bit 1: set if the filesystem handles [FSID](../../filesystem.md#filesystem-unique-identifier)
    - Bit 2: set if the filesystem handles [symbolic links](../../filesystem.md#symbolic-links)
    - Bit 3: set if the filesystem stores modification dates
    - Bit 4: set if the filesystem stores last access dates
    - Bit 5: set if the filesystem can store an owner UID on 8 bytes
    - Bit 6: set if the filesystem can store access control lists

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
