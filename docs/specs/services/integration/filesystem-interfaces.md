# Filesystem interfaces

Filesystem interfaces are services that act as a layer of indirection between a storage [driver](../system/hw.md#drivers) and the [`sys::fs`](../system/fs.md) service. Their role is to translate all common filesystem operations, such as items management and modification, for filesystems that aren't [natively supported](../system/fs.md#list-of-natively-supported-filesystems). They heavily communicate with the [`sys::hw`](../system/hw.md) service to communicate with the underlying storage device.

A filesystem is tied to only one partition, and each partition has a filesystem. A storage space is made, unless empty, of a partitions table which lists all the available partitions.

Most [methods](#methods) and [notifications](#notifications) of filesystems interfaces are also available in the [`sys::fs`](../system/fs.md) service, with first perform permissions checking and determines the device and location to perform the operation on. It also leverages many more powerful features such as items watching, and features that are our of the scope of a filesystem interface such as partitions management.

As an application can only expose one single filesystem interface service, the said service will handle all of the hardware devices driven by the said process. This is why the the [SOR](#storage-operating-range) of the target partition and filesystem is provided for each request.

## Nomenclature

### Storage operating range

The _storage operating range_ (SOR) is a 40-byte information transmitted to all operation methods of the filesystem interface to indicate where the requested operation should be performed and on which devices.

It is composed of:

- The device's [UDI](../system/hw.md#unique-device-identifier) (8 bytes)
- The partition's first byte address on the device (8 bytes)
- The partition's last byte address on the device (8 bytes)
- [Authorization token](../system/hw.md#0xd0-authorize_fs_interface) (8 bytes)
- The filesystem's [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)

The FSID is only useful to identify partitions more easily, and to inform clients in [notifications](#notifications).

All SOR sent to the interface service are guaranteed to follow this specification, but may be invalid in case of a bad timing (e.g. authorization is [revoked](../system/hw.md#0xd1-unauthorize_fs_interface) just before a request is performed).

### Filesystem paths

Filesystem paths are used to refer to specific filesystem elements and are encoded as either a `0x01` byte followed by a [FEID](../../filesystem.md#element-unique-identifier), or a `0x02` byte followed by a [split path](#split-paths).

All filesystem paths sent to the interface service are guaranteed to follow this specification.

### Split paths

All paths manipulated and returned by a filesystem interface services are encoded as _split paths_: [delimited lists](../../kernel/data-structures.md#delimited-lists) of [delimited strings](../../kernel/data-structures.md#delimited-strings).

Each entry of the list must be a path's component. The entries, joined with a slash (`/`), should form a valid path.

Empty and `.` components are ignored, while components equal to `..` will make this component ignored and remove the previous component in the list.

The slash (`/`) character is forbidden in components.

An empty path refers to the root directory (when applicable).

### Filenames

Filenames are a [delimited strings](../../kernel/data-structures.md#delimited-strings) with a few restrictions:

- Slash `/` characters are forbidden
- `NULL` characters (`U+0000`) are forbidden

Moreover, filenames cannot be:

- Empty
- Be made only of spaces or insecable spaces
- Strictly equal to `.`
- Strictly equal to `..`
- Longer than 65535 characters

Additional limitations may apply for some filesystems. Refer to each filesystem's specification to see the eventual limitations on filenames.

All filenames sent to the interface service are guaranteed to be follow this specification.

### Capabilities list

The _capabitilies list_ is a 2-byte long value which indicate the capabitilies of a given filesystem:

- Bit  0: set if the filesystem is writable
- Bit  1: set if the filesystem handles [symbolic links](../../filesystem.md#symbolic-links)
- Bit  2: set if the filesystem allows symbolic links to non-existing items
- Bit  3: set if the filesystem allows symbolic links to cross-filesystem items (need to store the target's [FSID](../../filesystem.md#filesystem-unique-identifier))
- Bit  3: set if the filesystem supports hidden flag
- Bit  4: set if the filesystem supports readonly flag
- Bit  5: set if the filesystem can store creation dates
- Bit  6: set if the filesystem can store modification dates
- Bit  7: set if the filesystem can store last access dates
- Bit  8: set if the filesystem can store an owner UID on 8 bytes
- Bit  9: set if the filesystem can natively store a [storage permissions map](../../storage-permissions-map.md)
- Bit 10: set if the interface can store a [storage permissions map](../../storage-permissions-map.md) in the filesystem
- Bit 11: set if the filesystem supports ahead space reservation

In case the filesystem can't natively handle a [storage permissions map (SPM)](../../storage-permissions-map.md), the interface is allowed to store, query and update the map in the filesystem by itself, using non-native ways such as extended attributes. In such case, the relevant bit must be set to indicate a SPM can be stored on this filesystem.

This list acts as a contract between the service and the [`sys::fs`](../system/fs.md) service ; if a capability bit is not set, the related methods are guaranteed to never be called. If it is set, the "incompatibility" error code present in such methods cannot be returned or it will be considered a bug.

### Filesystem metadata

A _filesystem metadata_ is a structure describing the a single filesystem:

- [Capabilities list](#capabilities-list) (2 bytes)
- Cluster size in bytes (4 bytes)
- Partition's total size in bytes (8 bytes)
- Partition's used space in bytes (8 bytes)
- Partition's free space in bytes (8 bytes) - used in case a part of the partition could not be used for any reason
- [Optional](../../kernel/data-structures.md#options) partition's name as a [delimited string](../../kernel/data-structures.md#delimited-strings)
- [Optional](../../kernel/data-structures.md#options) partition's [icon](../../kernel/data-structures.md#bitmap-images)

### Item type byte

An _item type byte_ is a single-byte value describing the type of a single item in a filesystem:

- `0x01`: directory
- `0x02`: file
- `0x03`: symbolic link
- `0xFF`: unknown item type

### Item flags

Each item has associated _flags_:

- Bit 0: hidden flag
- Bit 1: read-only flag

### Item metadata

An _item metadata_ is a structure describing the content of a single item in a filesystem:

- [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)
- [Item type byte](#item-type-byte) (1 byte)
- [Item flags](#item-flags) (1 byte)
- Size in bytes (8 bytes) - `0` for directories
- [Optional](../../kernel/data-structures.md#options) owner UID (8 bytes)
- [Optional](../../kernel/data-structures.md#options) creation date [timestamp](../../kernel/data-structures.md#timestamps) (1 + 8 bytes)
- [Optional](../../kernel/data-structures.md#options) modification date [timestamp](../../kernel/data-structures.md#timestamps) (1 + 8 bytes)
- [Optional](../../kernel/data-structures.md#options) last access date [timestamp](../../kernel/data-structures.md#timestamps) (1 + 8 bytes)
- Item's [filename](#filenames)

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

### `0x03` FS_METADATA

Get metadata on a given filesystem.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)

**Return value:**

- [Filesystem metadata](#filesystem-metadata)

**Error codes:**

- `0x20`: Invalid SOR provided

### `0x10` ITEM_EXISTS

Check if a given item exists.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- [Filesystem path](#filesystem-paths)
- [Item type byte](#item-type-byte) (1 byte) to check if the item exists **and** is of a specific type - `0` to accept all types

**Return value:**

- [Item type byte](#item-type-byte) (1 byte)

**Errors:**

- `0x20`: Invalid SOR provided

### `0x11` FEID_TO_SPLIT

Convert a [FEID](../../filesystem.md#element-unique-identifier) to the corresponding [split path](#split-paths).

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)

**Return value:**

- [Split path](#split-paths)

**Errors:**

- `0x20`: Invalid SOR provided
- `0x31`: The provided FEID was not found in the filesystem

### `0x12` ITEM_METADATA

Get the metadata of a given item.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- [Filesystem path](#filesystem-paths)

**Return value:**

- [Item metadata](#item-metadata)

**Errors:**

- `0x20`: Invalid SOR provided
- `0x31`: The provided path was not found

### `0x13` RENAME_ITEM

Rename an existing item.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- [Filesystem path](#filesystem-paths)
- New [filename](#filenames)

**Errors:**

- `0x10`: Invalid filename provided
- `0x20`: Invalid SOR provided
- `0x31`: The provided path was not foud

### `0x14` MOVE_ITEM

Move an existing item.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- [Filesystem path](#filesystem-paths)
- New [parent directory](#filesystem-paths)
- [Optional](../../kernel/data-structures.md#options) new [filename](#filenames)

**Errors:**

- `0x10`: Invalid filename provided
- `0x20`: Invalid SOR provided
- `0x31`: The provided path was not found
- `0x32`: Target directory was not found
- `0x33`: Target directory's maximum capacity has been reached
- `0x34`: Maximum nested items number has been reached
- `0x35`: Maximum path length has been reached
- `0x36`: Item cannot be moved for unspecified reasons
- `0x40`: Unspecified filesystem error

### `0x15` DELETE_ITEM

Delete an item.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- [Filesystem path](#filesystem-paths)

**Return value:**

_None_

**Errors:**

- `0x20`: Invalid SOR provided
- `0x31`: Item was not found
- `0x32`: Cannot remove a non-empty directory
- `0x40`: Unspecified filesystem error

### `0x20` CREATE_DIRECTORY

Create a directory.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- [Filesystem path](#filesystem-paths) of the parent directory
- New item's [filename](#filenames)

**Return value:**

_None_

**Errors:**

- `0x10`: Invalid filename provided
- `0x20`: Invalid SOR provided
- `0x31`: Parent directory was not found
- `0x32`: Directory's maximum capacity has been reached
- `0x33`: Maximum nested items number has been reached
- `0x34`: Maximum path length has been reached
- `0x40`: Unspecified filesystem error

### `0x21` READ_DIRECTORY

List all entries in a directory.

If the provided offset is larger than the number of entries in the directory, all remaining items must be returned.  
If the number of items to get is larger than the number of entries in the directory less the start offset, all remaining items must be returned.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- [Filesystem path](#filesystem-paths)
- Start offset (8 bytes)
- Number of items to get (8 bytes) - `0` to list all items at once
- [Optional](../../kernel/data-structures.md#options) total number of entries, if available (1 + 8 bytes)
- Hidden flag match (1 byte): set to `0x00` to match only non-hidden items, `0x01` to match all items

**Return value:**

- [Delimited list](../../kernel/data-structures.md#delimited-lists) of [item metadata](#item-metadata)

**Errors:**

- `0x20`: Invalid SOR provided
- `0x31`: Directory was not found
- `0x40`: Unspecified filesystem error

### `0x30` CREATE_FILE

Create a file.

The reserved size is only provided if the interface reported the filesystem as [supporting this feature](#capabilities-list).

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- [Filesystem path](#filesystem-paths) of the parent directory
- New item's [filename](#filenames)
- [Optional](../../kernel/data-structures.md#options) reserved size (1 + 8 bytes)
- [Optional](../../kernel/data-structures.md#options) length of the buffer to write (1 + 8 bytes)
- Buffer to write

**Return value:**

_None_

**Errors:**

- `0x10`: Invalid filename provided
- `0x20`: Invalid SOR provided
- `0x31`: Parent directory was not found
- `0x32`: Directory's maximum capacity has been reached
- `0x33`: Maximum nested items number has been reached
- `0x34`: Maximum path length has been reached
- `0x35`: Storage's capacity exceeded
- `0x36`: Maximum individual file size exceeded
- `0x37`: Filesystem's free space exceeded
- `0x38`: Unspecified filesystem error
- `0x40`: Unspecified filesystem error

### `0x31` READ_FILE_SYNC

Read a file synchronously.

If no read length is provided, the whole file must be read.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- File's [path](#filesystem-paths)
- Start offset address (8 bytes)
- [Optional](../../kernel/data-structures.md#options) length to read (1 + 8 bytes)

**Return value:**

- Number of read bytes (8 bytes)
- File's content

**Errors:**

- `0x20`: Invalid SOR provided
- `0x31`: Start offset is out-of-range
- `0x40`: Unspecified filesystem error

### `0x32` READ_FILE_ASYNC

Asynchronously read a file to a writable [abstract memory segment (AMS)](../../kernel/memory.md#abstract-memory-segments).

THe number of bytes to read is always provided to ensure it does not accidentally exceed the AMS's size.

When the read is complete, a [`FILE_READ`](#0x32-file_read) notification must be sent to the client.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- File's [path](#filesystem-paths)
- Start offset address (8 bytes)
- Number of bytes to read (8 bytes)
- AMS identifier (8 bytes)

**Return value:**

- Generated task identifier (8 bytes)

**Errors:**

- `0x20`: Invalid SOR provided
- `0x31`: Invalid AMS ID provided
- `0x40`: Unspecified filesystem error

### `0x33` WRITE_FILE_SYNC

Synchronously write a buffer to a file.

If no offset address is provided, the file's content must be completely overriden with the provided buffer.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- File's [path](#filesystem-paths)
- [Optional](../../kernel/data-structures.md#options) write offset address (1 + 8 bytes)
- Number of bytes to write (8 bytes)
- Buffer to write (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x20`: Invalid SOR provided
- `0x31`: Offset is out-of-range
- `0x32`: Storage's capacity exceeded
- `0x33`: Maximum individual file size exceeded
- `0x34`: Filesystem's free space exceeded
- `0x40`: Unspecified filesystem error

### `0x34` WRITE_FILE_ASYNC

Asynchronously write a readable [abstract memory segment (AMS)](../../kernel/memory.md#abstract-memory-segments) to a file.

If no offset address is provided, the file's content must be completely overriden with the provided buffer.

When the writing is complete, a [`FILE_WRITTEN`](#0x34-file_written) notification must be sent to the client. The notification **must not** be sent before the current method returned successfully.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- File's [path](#filesystem-paths)
- [Optional](../../kernel/data-structures.md#options) write offset address (1 + 8 bytes)
- Number of bytes to write (8 bytes)
- AMS identifier (8 bytes)

**Return value:**

- Generated task identifier (8 bytes)

**Errors:**

- `0x20`: Invalid SOR provided
- `0x31`: Invalid AMS ID provided
- `0x40`: Unspecified filesystem error

### `0x40` CREATE_SYMLINK

Create a [symbolic link](../../filesystem.md#symbolic-links).

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- [Filesystem path](#filesystem-paths) of the parent directory
- New item's [filename](#filenames)
- Symlink's [target FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- Symlink's [target path](#filesystem-paths) (always a [split path](#split-paths) for other filesystems)

**Return value:**

_None_

**Errors:**

- `0x10`: Invalid filename provided
- `0x20`: Invalid SOR provided
- `0x31`: Parent directory was not found
- `0x32`: Directory's maximum capacity has been reached
- `0x33`: Maximum nested items number has been reached
- `0x34`: Maximum path length has been reached
- `0x35`: Storage's capacity exceeded
- `0x36`: Cannot create symbolic links to cross-filesystem items
- `0x37`: Cannot create symbolic links to non-existing items

### `0x41` UPDATE_SYMLINK

Create a [symbolic link](../../filesystem.md#symbolic-links).

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- Symlink's [path](#filesystem-paths)
- Symlink's [target FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- Symlink's [target path](#filesystem-paths)

**Return value:**

_None_

**Errors:**

- `0x20`: Invalid SOR provided
- `0x31`: Provided path was not found
- `0x32`: Cannot crate symbolic links to cross-filesystem items
- `0x33`: Cannot crate symbolic links to non-existing items

### `0x42` READ_SYMLINK

Read a [symbolic link](../../filesystem.md#symbolic-links)'s target.

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- Symlink's [path](#filesystem-paths)

**Return value:**

- Symlink's [target FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- Symlink's [target path](#filesystem-paths)

**Errors:**

- `0x20`: Invalid SOR provided
- `0x31`: Provided path was not found
- `0x32`: Symbolic link is cyclic

### `0xF0` FORMAT_ASYNC

Asynchronously format the partition to get an empty filesystem. Once the formatting is complete, 

**Arguments:**

- [SOR](#storage-operating-range) (40 bytes)
- [Optional](../../kernel/data-structures.md#options) new partition's sector size, in bytes (8 bytes)

**Return value:**

- Generated task identifier (8 bytes)

**Error codes:**

- `0x20`: Invalid SOR provided
- `0x31`: Invalid sector size provided

## Notifications

### `0x32` FILE_READ

Sent to a client after an asynchronous file reading requested using the [`READ_FILE_ASYNC`](#0x32-read_file_async) method completed.

**Datafield:**

- Task identifier (8 bytes)
- [Fallible result](../../kernel/data-structures.md#fallible-results) with:
  - Success data: number of bytes read (8 bytes)
  - Error code (1 byte)
    - `0x20`: Start offset is out-of-range
    - `0x40`: Unspecified filesystem error

### `0x34` FILE_WRITTEN

Sent to a client after an asynchronous file writing requested using the [`WRITE_FILE_ASYNC`](#0x34-write_file_async) method completed.

**Datafield:**

- Task identifier (8 bytes)
- [Fallible result](../../kernel/data-structures.md#fallible-results) with:
  - Success data: _None_
  - Error code (1 byte):
    - `0x20`: Start offset is out-of-range
    - `0x31`: Maximum individual file size exceeded
    - `0x32`: Filesystem's free space exceeded
    - `0x40`: Unspecified filesystem error

### `0xF0` FORMATTED

Sent to a client after an formatting requested using the [`FORMAT_ASYC`](#0xf0-format_async) method completed.

**Datafield:**

- Task identifier (8 bytes)
- [Fallible result](../../kernel/data-structures.md#fallible-results) with:
  - Success data: _None_
  - Error code (1 byte):
    - `0x40`: Unspecified filesystem error