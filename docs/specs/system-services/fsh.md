# `sys::fsh` service

## Methods

### `0x10` CHECK_ITEM_THUMBNAIL_CACHE

Check if a cached thumbnail exists for a given filesystem item to determine if another should be generated or not.

The cache policy is determined using internal criterias.

**Arguments:**

- [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [FEID](../filesystem.md#element-unique-identifier) (8 bytes)

**Return value:**

- Presence (1 byte): `0x01` if a thumbnail is present, `0x00` else

If a thumbnail is present, this is followed by:

- Thumbnail caching [timestamp](../kernel/data-structures.md#timestamps) (8 bytes)
- Thumbnail [TFEID](../filesystem.md#temporary-feid) (8 bytes)

**Errors:**

- `0x20`: Client is not a [file manager service](../integration-services/file-managers.md)
- `0x30`: Unknown FSID
- `0x31`: Unknown FEID

### `0x11` CACHE_ITEM_THUMBNAIL

Write a filesystem item's thumbnail in the cache.

If a thumbnail already exists in cache, it will be replaced by the new one.

The cache policy is determined using internal criterias.

**Arguments:**

- [FSID](../filesystem.md#filesystem-unique-identifier) (8 bytes)
- [FEID](../filesystem.md#element-unique-identifier) (8 bytes)
- Thumbnail as a [bitmap image](../kernel/data-structures.md#bitmap-images)

**Return value:**

- Thumbnail [TFEID](../filesystem.md#temporary-feid) (8 bytes)

**Errors:**

- `0x10`: Invalid bitmap data
- `0x20`: Client is not a [file manager service](../integration-services/file-managers.md)
- `0x30`: Unknown FSID
- `0x31`: Unknown FEID
