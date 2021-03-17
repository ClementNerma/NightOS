# `sys::fs` service

The `sys::fs` service is in charge of operations related to the [filesystems](../filesystem.md).

## Methods

### `0x01` IS_FS_MOUNTED

Check if a given filesystem is mounted.

**Required permission:** `fs.filesystems.mounted`

**Arguments:**

- [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Return value:**

- `0x01` if the filesystem is currently mounted, `0x00` else

**Errors:**

_None_

### `0x02` FS_METADATA

Get informations on a filesystem.

**Required permission:** `fs.filesystems.metadata`

**Arguments:**

- [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Return value:**

- [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)
- Mount [timestamp](../kernel/data-structures.md#timestamps) (8 bytes)
- Mount path [FEID](../filesystem.md#element-unique-identifier) (8 bytes)
- Volume size in bytes (8 bytes)
- [Option](../kernel/data-structures.md#option) of the volume's free size in bytes (8 bytes)
- [Option](../kernel/data-structures.md#option) of the mounted volume file's [FEID](../filesystem.md#element-unique-identifier) (1 + 8 bytes)
- Volume name as a [delimited string](../kernel/data-structures.md#delimited-strings)

**Errors:**

- `0x30`: The requested filesystem is currently not mounted

### `0x03` FS_LIST

Enumerate mounted filesystems.

**Required permission:** `fs.filesystems.list`

**Arguments:**

_None_

**Return value:**

- [Delimited list](../kernel/data-structures.md#delimited-lists) of [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Errors:**

_None_

### `0x04` FS_MOUNT

Mount a filesystem. If no mount path is provided, the filesystem will be mounted under the `/mnt` directory.

**Required permission:** `fs.filesystems.mount`

**Arguments:**

- [Option](../kernel/data-structures.md#option) of the mount path as a [delimited string](../kernel/data-structures.md#delimited-strings)

**Return value:**

- [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Errors:**

- `0x30`: Client does not expose a [filesystem driver service](hw.md#drivers)
- `0x31`: This filesystem is already mounted

### `0x05` FS_MOUNT_EXISTING

Mount an existing filesystem. If no mount path is provided, the filesystem will be mounted under the `/mnt` directory.

**Required permission:** `fs.filesystems.mount.existing`

**Arguments:**

- [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [Option](../kernel/data-structures.md#option) of the mount path as a [delimited string](../kernel/data-structures.md#delimited-strings)

**Return value:**

_None_

**Errors:**

- `0x30`: Unknown [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)
- `0x31`: This filesystem is already mounted

### `0x06` FS_UNMOUNT

Unmount a mounted filesystem.

**Required permission** `fs.filesystems.unmount`

**Arguments:**

- [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)

**Return value:**

_None_

**Errors:**

- `0x30`: Unknown [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)
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
- [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)
