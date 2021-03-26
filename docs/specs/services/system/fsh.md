# `sys::fsh` service

The `sys::fsh` service is in charge of handling high-level filesystem operations, such as file associations and thumbnails generation.

- [Methods](#methods)
  - [`0x0001` REGISTER_OPENER](#0x0001-register_opener)
  - [`0x0002` UNREGISTER_OPENER](#0x0002-unregister_opener)
  - [`0x0003` LIST_OPENERS](#0x0003-list_openers)
  - [`0x1000` CHECK_ITEM_THUMBNAIL_CACHE](#0x1000-check_item_thumbnail_cache)
  - [`0x1001` CACHE_ITEM_THUMBNAIL](#0x1001-cache_item_thumbnail)

## Methods

### `0x0001` REGISTER_OPENER

Register an application as an opener for a list of file types.

**Arguments:**

- File extensions to handle as a [delimited list](../../kernel/data-structures.md#delimited-lists) of [delimited strings](../../kernel/data-structures.md#delimited-strings)

**Return value:**

_None_

**Errors:**

- `0x1000`: One of the provided extensions is empty
- `0x1001`: At least one of the provided extensions is reserved to the system
- `0x3000`: Client does not expose a [file opening service](../../services/integration/file-openers.md)
- `0x3001`: Client already handles at least one of the provided extensions

### `0x0002` UNREGISTER_OPENER

Unregister an application as an opener for a list of file types.

**Argument:**

- File extensions to unhandle as a [delimited list](../../kernel/data-structures.md#delimited-lists) of [delimited strings](../../kernel/data-structures.md#delimited-strings)

**Return value:**

_None_

**Errors:**

- `0x1001`: One of the provided extensions is empty
- `0x3000`: Client does not expose a [file opening service](../../services/integration/file-openers.md)
- `0x3001`: Client does not currently handle at least one of the provided extensions

### `0x0003` LIST_OPENERS

List the [file openers](../../services/integration/file-openers.md) associated to a specific type of items.

The list is not ordered, it's up to the [file manager](../../services/integration/file-managers.md) to determine the display order if multiple openers are found.

**Arguments:**

- Filesystem item's extension as a [delimited string](../../kernel/data-structures.md#delimited-strings)

**Return value:**

- [Delimited list](../../kernel/data-structures.md#delimited-lists) of [ANID](../../applications-libraries.md#application-identifier) (8 bytes each)

**Errors:**

- `0x3000`: Client does not expose a [file opening service](../../services/integration/file-openers.md)

### `0x1000` CHECK_ITEM_THUMBNAIL_CACHE

Check if a cached thumbnail exists for a given filesystem item to determine if another should be generated or not.

The cache policy is determined using internal criterias.

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)

**Return value:**

- Presence (1 byte): `0x01` if a thumbnail is present, `0x00` else

If a thumbnail is present, this is followed by:

- Thumbnail caching [timestamp](../../kernel/data-structures.md#timestamps) (8 bytes)
- Thumbnail [TFEID](../../filesystem.md#temporary-feid) (8 bytes)

**Errors:**

- `0x3000`: Client is not a [file manager service](../../services/integration/file-managers.md)
- `0x3001`: Unknown FSID
- `0x3002`: Unknown FEID

### `0x1001` CACHE_ITEM_THUMBNAIL

Write a filesystem item's thumbnail in the cache.

If a thumbnail already exists in cache, it will be replaced by the new one.

The cache policy is determined using internal criterias.

**Arguments:**

- [FSID](../../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)
- Thumbnail as a [bitmap image](../../kernel/data-structures.md#bitmap-images)

**Return value:**

- Thumbnail [TFEID](../../filesystem.md#temporary-feid) (8 bytes)

**Errors:**

- `0x1000`: Invalid bitmap data
- `0x3000`: Client is not a [file manager service](../../services/integration/file-managers.md)
- `0x3001`: Unknown FSID
- `0x3002`: Unknown FEID
