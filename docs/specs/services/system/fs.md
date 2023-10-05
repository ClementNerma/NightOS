# `sys::fs` service

The `sys::fs` service is in charge of operations related to the [filesystems](../../filesystem.md).

- [`sys::fs` service](#sysfs-service)
  - [Behaviour](#behaviour)
    - [Operations and latency](#operations-and-latency)
    - [List of natively supported filesystems](#list-of-natively-supported-filesystems)
    - [Extending supported filesystems](#extending-supported-filesystems)
    - [Filesystems detection](#filesystems-detection)
  - [Methods](#methods)
    - [`0x0001` IS\_FS\_MOUNTED](#0x0001-is_fs_mounted)
    - [`0x0002` ENUM\_FS](#0x0002-enum_fs)
    - [`0x0003` FS\_METADATA](#0x0003-fs_metadata)
    - [`0x0004` FS\_MOUNT](#0x0004-fs_mount)
    - [`0x0005` FS\_UNMOUNT](#0x0005-fs_unmount)
    - [`0x0006` FS\_WATCH](#0x0006-fs_watch)
    - [`0x0007` FS\_UNWATCH](#0x0007-fs_unwatch)
    - [`0x1000` ITEM\_EXISTS](#0x1000-item_exists)
    - [`0x1001` FEID\_TO\_SPLIT](#0x1001-feid_to_split)
    - [`0x1002` ITEM\_METADATA](#0x1002-item_metadata)
    - [`0x1003` RENAME\_ITEM](#0x1003-rename_item)
    - [`0x1004` MOVE\_ITEM](#0x1004-move_item)
    - [`0x1005` DELETE\_ITEM](#0x1005-delete_item)
    - [`0x2000` CREATE\_DIRECTORY](#0x2000-create_directory)
    - [`0x2001` READ\_DIRECTORY](#0x2001-read_directory)
    - [`0x3000` CREATE\_FILE](#0x3000-create_file)
    - [`0x3001` READ\_FILE](#0x3001-read_file)
    - [`0x3101` WRITE\_FILE](#0x3101-write_file)
    - [`0x4000` CREATE\_SYMLINK](#0x4000-create_symlink)
    - [`0x4001` UPDATE\_SYMLINK](#0x4001-update_symlink)
    - [`0x4002` READ\_SYMLINK](#0x4002-read_symlink)
    - [`0xA000` WATCH\_ITEM](#0xa000-watch_item)
    - [`0xA001` WATCH\_DIR\_CONTENT](#0xa001-watch_dir_content)
    - [`0xA002` UNWATCH](#0xa002-unwatch)
    - [`0xAA00` LOCK\_ITEM](#0xaa00-lock_item)
    - [`0xAA01` UNLOCK\_ITEM](#0xaa01-unlock_item)
    - [`0xF000` FORMAT\_ASYNC](#0xf000-format_async)
  - [Notifications](#notifications)
    - [`0x0006` FS\_CHANGED](#0x0006-fs_changed)
    - [`0xA000` ITEM\_CHANGED](#0xa000-item_changed)
    - [`0xA001` DIR\_CONTENT\_CHANGED](#0xa001-dir_content_changed)
    - [`0xF000` FORMATTED](#0xf000-formatted)

## Behaviour

### Operations and latency

A single filesystem operation request from a client process up to the hardware device traverses:

* Client
* `sys::fs` service
* [filesystem interface](../integration/filesystem-interfaces.md) (only if the filesystem is not [supported natively](#list-of-natively-supported-filesystems))
* [storage driver service](../drivers/storage.md) (only if a filesystem interface is used, or if the storage device requires a [specific driver](../drivers/storage.md))
* Hardware storage device

The response then goes up through all layers. Note that in all cases, the [`sys::hw`](hw.md) don't need to be contacted, thanks to [direct driver access](hw.md#direct-driver-access-for-sysfs).

In the best scenario, which is for [natively supported filesystems](#list-of-natively-supported-filesystems) on storage devices that don't require a [dedicated driver](../drivers/storage.md), [direct storage access](hw.md#direct-storage-access-for-sysfs) is possible, reducing the traversal to:

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

Filesystems are detected using a variety of methods. If all fail (which is, if the filesystem is not one that is [natively supported](#list-of-natively-supported-filesystems)), [filesystem interfaces](../integration/filesystem-interfaces.md) are used one by one to find one that can handle the said filesystem, using their [`IS_VALID_PARTITION`](../integration/filesystem-interfaces.md#0x0002-is_valid_partition) method.

Each partition then gets an identifier, the [filesystem unique identifier (FSID)](../../filesystem.md#filesystem-unique-identifier), which is consistent across reboots but different between computers to avoid collection of informations from the FSID alone.

## Methods

### `0x0001` IS_FS_MOUNTED

Check if a given filesystem is mounted.

**Required permission:** `fs.filesystems.mounted`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Return value:**

- `0x01` if the filesystem is currently mounted, `0x00` else

**Errors:**

_None_

### `0x0002` ENUM_FS

Enumerate all available filesystems.

**Required permission:** `fs.filesystems.list`

**Arguments:**

_None_

**Return value:**

- [Delimited list](../../kernel/data-structures.md#delimited-lists) of [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Errors:**

_None_

### `0x0003` FS_METADATA

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

- `0x3000`: The requested filesystem is currently not mounted

### `0x0004` FS_MOUNT

Mount an existing filesystem. If no mount path is provided, the filesystem will be mounted under the `/mnt` directory.

New filesystems are [automatically detected](#filesystems-detection) when storage devices are connected.

**Required permission:** `fs.filesystems.mount`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [Option](../../kernel/data-structures.md#options) of the mount path as a [delimited string](../../kernel/data-structures.md#delimited-strings)

**Return value:**

_None_

**Errors:**

- `0x3000`: Unknown [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- `0x3001`: This filesystem is already mounted

### `0x0005` FS_UNMOUNT

Unmount a mounted filesystem.

**Required permission** `fs.filesystems.unmount`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x3000`: Unknown [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- `0x3001`: This filesystem is current not mounted

### `0x0006` FS_WATCH

Subscribe to [`FS_CHANGED`](#0x0006-fs_changed) notifications when a filesystem is mounted or unmounted.

**Required permission:** `fs.filesystems.watch`

**Arguments:**

_None_

**Return value:**

_None_

**Errors:**

_None_

### `0x0007` FS_UNWATCH

Unsubscribe from [`FS_WATCH`](#0x0006-fs_watch).

**Required permission:** _None_

**Arguments:**

_None_

**Return value:**

_None_

**Errors:**

_None_

### `0x1000` ITEM_EXISTS

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

- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted

### `0x1001` FEID_TO_SPLIT

Convert a [FEID](../../filesystem.md#element-unique-identifier) to the corresponding [split path](../integration/filesystem-interfaces.md#split-paths).

**Required permissions:**

- `fs.path.exists`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)

**Return value:**

- [Split path](../integration/filesystem-interfaces.md#split-paths)

**Errors:**

- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted
- `0x3002`: The provided FEID was not found in the filesystem

### `0x1002` ITEM_METADATA

Get the metadata of a given item.

**Required permissions:**

- `fs.items.metadata` to get symbolic links' metadata

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths)

**Return value:**

- [Item metadata](../integration/filesystem-interfaces.md#item-metadata)

**Errors:**

- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted
- `0x3002`: The provided path was not found

### `0x1003` RENAME_ITEM

Rename an existing item.

**Required permissions:**

- `fs.items.move`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths)
- New [filename](../integration/filesystem-interfaces.md#filenames)

**Errors:**

- `0x3000`: Invalid filename provided
- `0x3001`: Invalid FSID provided
- `0x3002`: Requested filesystem is currently not mounted
- `0x3003`: The provided path was not foud

### `0x1004` MOVE_ITEM

Move an existing item.

- `fs.items.move`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Filesystem path](../integration/filesystem-interfaces.md#filesystem-paths)
- New [parent directory](../integration/filesystem-interfaces.md#filesystem-paths)
- [Optional](../../kernel/data-structures.md#options) new [filename](../integration/filesystem-interfaces.md#filenames)

**Errors:**

- `0x1000`: Invalid filename provided
- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted
- `0x3002`: The provided path was not found
- `0x3003`: Target directory was not found
- `0x4000`: Target directory's maximum capacity has been reached
- `0x4001`: Maximum nested items number has been reached
- `0x4002`: Maximum path length has been reached
- `0x4003`: Item cannot be moved for unspecified reasons
- `0x4FFF`: Unspecified filesystem error

### `0x1005` DELETE_ITEM

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

- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted
- `0x3002`: Item was not found
- `0x3003`: Cannot remove a non-empty directory
- `0x4FFF`: Unspecified filesystem error

### `0x2000` CREATE_DIRECTORY

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

- `0x1000`: Invalid filename provided
- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted
- `0x3002`: Parent directory was not found
- `0x4000`: Directory's maximum capacity has been reached
- `0x4001`: Maximum nested items number has been reached
- `0x4002`: Maximum path length has been reached
- `0x4FFF`: Unspecified filesystem error

### `0x2001` READ_DIRECTORY

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

- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted
- `0x3002`: Directory was not found
- `0x4FFF`: Unspecified filesystem error

### `0x3000` CREATE_FILE

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

- `0x3000`: Invalid filename provided
- `0x3001`: Invalid FSID provided
- `0x3002`: Requested filesystem is currently not mounted
- `0x3003`: Parent directory was not found
- `0x4000`: Directory's maximum capacity has been reached
- `0x4001`: Maximum nested items number has been reached
- `0x4002`: Maximum path length has been reached
- `0x4003`: Storage's capacity exceeded
- `0x4004`: Maximum individual file size exceeded
- `0x4005`: Filesystem's free space exceeded
- `0x4FFF`: Unspecified filesystem error

### `0x3001` READ_FILE

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

- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted
- `0x3002`: Start offset is out-of-range
- `0x4FFF`: Unspecified filesystem error

### `0x3101` WRITE_FILE

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

- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted
- `0x3002`: Offset is out-of-range
- `0x4000`: Storage's capacity exceeded
- `0x4001`: Maximum individual file size exceeded
- `0x4002`: Filesystem's free space exceeded
- `0x4FFF`: Unspecified filesystem error

### `0x4000` CREATE_SYMLINK

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

- `0x3000`: Invalid filename provided
- `0x3001`: Invalid FSID provided
- `0x3002`: Requested filesystem is currently not mounted
- `0x3003`: Parent directory was not found
- `0x3004`: Cannot create symbolic links to cross-filesystem items
- `0x3005`: Cannot create symbolic links to non-existing items
- `0x4000`: Directory's maximum capacity has been reached
- `0x4001`: Maximum nested items number has been reached
- `0x4002`: Maximum path length has been reached
- `0x4003`: Storage's capacity exceeded
- `0x4FFF`: Unspecified filesystem error

### `0x4001` UPDATE_SYMLINK

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

- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted
- `0x3002`: Provided path was not found
- `0x3003`: Cannot crate symbolic links to cross-filesystem items
- `0x3004`: Cannot crate symbolic links to non-existing items
- `0x4FFF`: Unspecified filesystem error

### `0x4002` READ_SYMLINK

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

- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted
- `0x3002`: Provided path was not found
- `0x4000`: Symbolic link is cyclic

### `0xA000` WATCH_ITEM

Watch an item for changes on its metadata or content. Any change will trigger a [`ITEM_CHANGED`](#0xa000-item_changed) notification.

**Required permission:**

- `fs.items.metadata`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [Path](../integration/filesystem-interfaces.md#filesystem-paths) to watch
- Generated watch identifier (8 bytes)

**Errors:**

- `0x3000`: Invalid FSID provided
- `0x3001`: Provided path was not found

### `0xA001` WATCH_DIR_CONTENT

Watch a directory's content for changes on its metadata or content. Any change will trigger a [`DIR_CONTENT_CHANGED`](#0xa001-dir_content_changed) notification.

**Required permission:**

- `fs.dir.read`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [Path](../integration/filesystem-interfaces.md#filesystem-paths) to watch
- Generated watch identifier (8 bytes)

**Errors:**

- `0x3000`: Invalid FSID provided
- `0x3001`: Provided path was not found

### `0xA002` UNWATCH

Stop watching a content watched with [`WATCH_ITEM`](#0xa000-watch_item) or [`WATCH_DIR_CONTENT`](#0xa001-watch_dir_content).

**Arguments:**

- Generated watch identifier (8 bytes)

**Errors:**

- `0x3000`: Provided watch identifier was not found

### `0xAA00` LOCK_ITEM

Lock an item to prevent modifications, access, renaming and removal from other processes.

**Required permissions:**

- `fs.items.lock`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- Item's [path](../integration/filesystem-interfaces.md#filesystem-paths)

**Return value:**

- Generated lock identifier (8 bytes)

**Errors:**

- `0x3000`: Provided FSID was not found
- `0x3001`: Provided item was not found
- `0x4000`: A lock is already in place on this item

### `0xAA01` UNLOCK_ITEM

Unlock an item locked with [`LOCK_ITEM`](#0xaa00-lock_item).

**Arguments:**

- Lock identifier (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x3000`: Unknown lock identifier

### `0xF000` FORMAT_ASYNC

Asynchronously format the partition to get an empty filesystem. Once the formatting is complete, 

**Required permissions:**

- `fs.filesystems.format`

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (40 bytes)
- [Optional](../../kernel/data-structures.md#options) new partition's sector size, in bytes (8 bytes)

**Return value:**

- Generated task identifier (8 bytes)

**Error codes:**

- `0x1000`: Invalid sector size provided
- `0x3000`: Invalid FSID provided
- `0x3001`: Requested filesystem is currently not mounted

## Notifications

### `0x0006` FS_CHANGED

Sent to a client which subscribed through [`FS_WATCH`](#0x0006-fs_watch) each time a filesystem is mounted or unmounted.

**Datafield:**

- Mount status (1 byte): `0x01` if the filesystem was mounted, `0x02` if it was unmounted
- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)

### `0xA000` ITEM_CHANGED

Notification sent to clients watching an item through the [`WATCH_ITEM`](#0xa000-watch_item) method.

**Datafield:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)
- Event code (1 byte):
  - `0x01`: item's metadata changed (timestamps excluded)
  - `0x02`: item was moved
  - `0x03`: item was deleted
  - `0x04`: item was locked (only for the parent directory if case of a recursive lock)
  - `0x05`: item was unlocked (only for the parent directory if case of a recursive lock)

### `0xA001` DIR_CONTENT_CHANGED

- `0x10`: the watched directory's content changed, followed by:
    - Affected element's [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
    - Affected element's [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)
    - Affected element's event code (1 byte) - same for [`ITEM_CHANGED`](#0xa000-item_changed), plus `0xA0` if the element was just created

### `0xF000` FORMATTED

Sent to a client after an formatting requested using the [`FORMAT_ASYC`](#0xf000-format_async) method completed.

**Datafield:**

- Task identifier (8 bytes)
- [Fallible result](../../kernel/data-structures.md#fallible-results) with:
  - Success data: _None_
  - Error code (1 byte):
    - `0x40`: Unspecified filesystem error
