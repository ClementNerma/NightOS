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

**Required permission:** `fs.filesystems.mount`

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

### `0x10` ITEM_EXISTS

Check if a given item exists.

**Required permissions:**

- `fs.path.exists` to check any item type
- `fs.feid.exists` to check only [FEID](../../filesystem.md#element-unique-identifier)

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths)
- [Item type byte](../integration/filesystem-interfaces.md#item-type-byte) (1 byte) to check if the item exists **and** is of a specific type - `0` to accept all types

**Return value:**

- [Item type byte](../integration/filesystem-interfaces.md#item-type-byte) (1 byte)

**Errors:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted

### `0x11` FEID_TO_SPLIT

Convert a [FEID](../../filesystem.md#element-unique-identifier) to the corresponding [split path](../integration/filesystem-interfaces.md#split-paths).

**Required permissions:**

- `fs.path.exists`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)

**Return value:**

- [Split path](../integration/filesystem-interfaces.md#split-paths)

**Errors:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: The provided FEID was not found in the filesystem

### `0x12` ITEM_METADATA

Get the metadata of a given item.

**Required permissions:**

- `fs.items.metadata` to get symbolic links' metadata

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths)

**Return value:**

- [Item metadata](../integration/filesystem-interfaces.md#item-metadata)

**Errors:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: The provided path was not found

### `0x13` RENAME_ITEM

Rename an existing item.

**Required permissions:**

- `fs.items.move`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths)
- New [filename](../integration/filesystem-interfaces.md#filenames)

**Errors:**

- `0x10`: Invalid filename provided
- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: The provided path was not foud

### `0x14` MOVE_ITEM

Move an existing item.

- `fs.items.move`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths)
- New [parent directory](../integration/filesystem-interfaces.md#filesystem-paths)
- [Optional](../../kernel/data-structures.md#options) new [filename](../integration/filesystem-interfaces.md#filenames)

**Errors:**

- `0x10`: Invalid filename provided
- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: The provided path was not found
- `0x32`: Target directory was not found
- `0x33`: Target directory's maximum capacity has been reached
- `0x34`: Maximum nested items number has been reached
- `0x35`: Maximum path length has been reached
- `0x36`: Item cannot be moved for unspecified reasons
- `0x40`: Unspecified filesystem error

### `0x15` DELETE_ITEM

Delete an item.

**Required permissions:**

- `fs.items.remove.trash` to send items to the trash
- `fs.items.remove` to delete items permanently

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths)
- Deletion mode (1 byte): `0x01` to send the item to the user's trash, `0x02` to delete it permanently

**Return value:**

_None_

**Errors:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: Item was not found
- `0x32`: Cannot remove a non-empty directory
- `0x40`: Unspecified filesystem error

### `0x20` CREATE_DIRECTORY

Create a directory.

**Required permissions:**

- `fs.items.create`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths) of the parent directory
- New item's [filename](../integration/filesystem-interfaces.md#filenames)

**Return value:**

_None_

**Errors:**

- `0x10`: Invalid filename provided
- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: Parent directory was not found
- `0x32`: Directory's maximum capacity has been reached
- `0x33`: Maximum nested items number has been reached
- `0x34`: Maximum path length has been reached
- `0x40`: Unspecified filesystem error

### `0x21` READ_DIRECTORY

List all entries in a directory.

If the provided offset is larger than the number of entries in the directory, all remaining items must be returned.  
If the number of items to get is larger than the number of entries in the directory less the start offset, all remaining items must be returned.

**Required permissions:**

- `fs.dir.read`
- `fs.dir.read.hidden` to also list hidden items

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths)
- Start offset (8 bytes)
- Number of items to get (8 bytes) - `0` to list all items at once
- [Optional](../../kernel/data-structures.md#options) total number of entries, if available (1 + 8 bytes)
- Hidden flag match (1 byte): set to `0x00` to match only non-hidden items, `0x01` to match all items

**Return value:**

- [Delimited list](../../kernel/data-structures.md#delimited-lists) of [item metadata](../integration/filesystem-interfaces.md#item-metadata)

**Errors:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: Directory was not found
- `0x40`: Unspecified filesystem error

### `0x30` CREATE_FILE

Create a file.

The reserved size is only provided if the filesystem [supports it](../integration/filesystem-interfaces.md#capabilities-list).

**Required permissions:**

- `fs.items.create`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths) of the parent directory
- New item's [filename](../integration/filesystem-interfaces.md#filenames)
- [Optional](../../kernel/data-structures.md#options) reserved size (1 + 8 bytes)
- [Optional](../../kernel/data-structures.md#options) length of the buffer to write (1 + 8 bytes)
- Buffer to write

**Return value:**

_None_

**Errors:**

- `0x10`: Invalid filename provided
- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
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

**Required permissions:**

- `fs.items.read`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- File's [path](../integration/filesystem-interfaces.md#filesystem-paths)
- Start offset address (8 bytes)
- [Optional](../../kernel/data-structures.md#options) length to read (1 + 8 bytes)

**Return value:**

- Number of read bytes (8 bytes)
- File's content

**Errors:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: Start offset is out-of-range
- `0x40`: Unspecified filesystem error

### `0x32` READ_FILE_ASYNC

Asynchronously read a file to a writable [abstract memory segment (AMS)](../../kernel/memory.md#abstract-memory-segments).

THe number of bytes to read is always provided to ensure it does not accidentally exceed the AMS's size.

When the read is complete, a [`FILE_READ`](#0x32-file_read) notification must be sent to the client.

**Required permissions:**

- `fs.items.read`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- File's [path](../integration/filesystem-interfaces.md#filesystem-paths)
- Start offset address (8 bytes)
- Number of bytes to read (8 bytes)
- AMS identifier (8 bytes)

**Return value:**

- Generated task identifier (8 bytes)

**Errors:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: Invalid AMS ID provided
- `0x40`: Unspecified filesystem error

### `0x33` WRITE_FILE_SYNC

Synchronously write a buffer to a file.

If no offset address is provided, the file's content must be completely overriden with the provided buffer.

**Required permissions:**

- `fs.items.write`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- File's [path](../integration/filesystem-interfaces.md#filesystem-paths)
- [Optional](../../kernel/data-structures.md#options) write offset address (1 + 8 bytes)
- Number of bytes to write (8 bytes)
- Buffer to write (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: Offset is out-of-range
- `0x32`: Storage's capacity exceeded
- `0x33`: Maximum individual file size exceeded
- `0x34`: Filesystem's free space exceeded
- `0x40`: Unspecified filesystem error

### `0x34` WRITE_FILE_ASYNC

Asynchronously write a readable [abstract memory segment (AMS)](../../kernel/memory.md#abstract-memory-segments) to a file.

If no offset address is provided, the file's content must be completely overriden with the provided buffer.

When the writing is complete, a [`FILE_WRITTEN`](#0x34-file_written) notification must be sent to the client. The notification **must not** be sent before the current method returned successfully.

**Required permissions:**

- `fs.items.write`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- File's [path](../integration/filesystem-interfaces.md#filesystem-paths)
- [Optional](../../kernel/data-structures.md#options) write offset address (1 + 8 bytes)
- Number of bytes to write (8 bytes)
- AMS identifier (8 bytes)

**Return value:**

- Generated task identifier (8 bytes)

**Errors:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: Invalid AMS ID provided
- `0x40`: Unspecified filesystem error

### `0x40` CREATE_SYMLINK

Create a [symbolic link](../../filesystem.md#symbolic-links).

**Required permissions:**

- `fs.symlinks.create`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths) of the parent directory
- New item's [filename](../integration/filesystem-interfaces.md#filenames)
- Symlink's [target FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- Symlink's [target path](../integration/filesystem-interfaces.md#filesystem-paths) (always a [split path](../integration/filesystem-interfaces.md#split-paths) for other filesystems)

**Return value:**

_None_

**Errors:**

- `0x10`: Invalid filename provided
- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: Parent directory was not found
- `0x32`: Directory's maximum capacity has been reached
- `0x33`: Maximum nested items number has been reached
- `0x34`: Maximum path length has been reached
- `0x35`: Storage's capacity exceeded
- `0x36`: Cannot create symbolic links to cross-filesystem items
- `0x37`: Cannot create symbolic links to non-existing items

### `0x41` UPDATE_SYMLINK

Create a [symbolic link](../../filesystem.md#symbolic-links).

**Required permissions:**

- `fs.symlinks.update`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- Symlink's [path](../integration/filesystem-interfaces.md#filesystem-paths)
- Symlink's [target FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- Symlink's [target path](../integration/filesystem-interfaces.md#filesystem-paths)

**Return value:**

_None_

**Errors:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: Provided path was not found
- `0x32`: Cannot crate symbolic links to cross-filesystem items
- `0x33`: Cannot crate symbolic links to non-existing items

### `0x42` READ_SYMLINK

Read a [symbolic link](../../filesystem.md#symbolic-links)'s target.

**Required permissions:**

- `fs.symlinks.read`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- Symlink's [path](../integration/filesystem-interfaces.md#filesystem-paths)

**Return value:**

- Symlink's [target FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- Symlink's [target path](../integration/filesystem-interfaces.md#filesystem-paths)

**Errors:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: Provided path was not found
- `0x32`: Symbolic link is cyclic

### `0xA0` WATCH_ITEM

Watch an item for changes on its metadata or content. Any change will trigger a [`ITEM_CHANGED`](#0xa0-item_changed) notification.

**Required permission:**

- `fs.items.metadata`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [Path](../integration/filesystem-interfaces.md#filesystem-paths) to watch
- Generated watch identifier (8 bytes)

**Errors:**

- `0x30`: Provided path was not found

### `0xA1` WATCH_DIR_CONTENT

Watch a directory's content for changes on its metadata or content. Any change will trigger a [`DIR_CONTENT_CHANGED`](#0xa1-dir_content_changed) notification.

**Required permission:**

- `fs.dir.read`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [Path](../integration/filesystem-interfaces.md#filesystem-paths) to watch
- Generated watch identifier (8 bytes)

**Errors:**

- `0x30`: Provided path was not found

### `0xA2` UNWATCH

Stop watching a content watched with [`WATCH_ITEM`](#0xa0-watch_item) or [`WATCH_DIR_CONTENT`](#0xa1-watch_dir_content).

**Arguments:**

- Generated watch identifier (8 bytes)

**Errors:**

- `0x30`: Provided watch identifier was not found

### `0xAA` LOCK_ITEM

Lock an item to prevent modifications and/or complete access from other processes.

No-modification mode will prevent changing the item's data and metadata (except timestamps).

[`ITEM_CHANGED`](#0xa0-item_changed) and [`DIR_CONTENT_CHANGED`](#0xa1-dir_content_changed) notifications won't be triggered for the locking process.

**Required permissions:**

- `fs.items.lock`: lock a single item
- `fs.items.lock.full`: lock a single item with exclusive mode
- `fs.dir.lock`: lock a full directory's content
- `fs.dir.lock.full`: lock a full directory's content with exclusive mode

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- Item's [path](../integration/filesystem-interfaces.md#filesystem-paths)
- Recursive mode (1 byte): `0x01` if the item is a directory and all its content should be locked, `0x00` otherwise
- Exclusive move (1 byte): `0x01` to prevent access from other processes, `0x00` otherwise

**Return value:**

- Generated lock identifier (8 bytes)

**Errors:**

- `0x11`: Invalid recursive mode
- `0x12`: Invalid exclude mode
- `0x30`: Provided FSID was not found
- `0x31`: Provided item was not found
- `0x32`: A lock is already in place on this item
- `0x33`: Cannot lock in recursive mode as the item is not a directory

### `0xAB` UNLOCK_ITEM

Unlock an item locked with [`LOCK_ITEM`](#0xaa-lock_item).

**Arguments:**

- Lock identifier (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x30`: Unknown lock identifier

### `0xF0` FORMAT_ASYNC

Asynchronously format the partition to get an empty filesystem. Once the formatting is complete, 

**Required permissions:**

- `fs.filesystems.format`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Optional](../../kernel/data-structures.md#options) new partition's sector size, in bytes (8 bytes)

**Return value:**

- Generated task identifier (8 bytes)

**Error codes:**

- `0x20`: Invalid FSID provided
- `0x21`: Requested filesystem is currently not mounted
- `0x31`: Invalid sector size provided

## Notifications

### `0x07` FS_CHANGED

Sent to a client which subscribed through [`FS_WATCH`](#0x07-fs_watch) each time a filesystem is mounted or unmounted.

**Datafield:**

- Mount status (1 byte): `0x01` if the filesystem was mounted, `0x02` if it was unmounted
- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)

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

### `0xA0` ITEM_CHANGED

Notification sent to clients watching an item through the [`WATCH_ITEM`](#0xa0-watch_item) method.

**Datafield:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)
- Event code (1 byte):
  - `0x01`: item's metadata changed
  - `0x02`: item was moved
  - `0x03`: item was deleted
  - `0x04`: item was locked (only for the parent directory if case of a recursive lock)
  - `0x05`: item was unlocked (only for the parent directory if case of a recursive lock)

### `0xA1` DIR_CONTENT_CHANGED

- `0x10`: the watched directory's content changed, followed by:
    - Affected element's [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
    - Affected element's [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)
    - Affected element's event code (1 byte) - same as the parent code, plus `0x20` if the element was created

### `0xF0` FORMATTED

Sent to a client after an formatting requested using the [`FORMAT_ASYC`](#0xf0-format_async) method completed.

**Datafield:**

- Task identifier (8 bytes)
- [Fallible result](../../kernel/data-structures.md#fallible-results) with:
  - Success data: _None_
  - Error code (1 byte):
    - `0x40`: Unspecified filesystem error
