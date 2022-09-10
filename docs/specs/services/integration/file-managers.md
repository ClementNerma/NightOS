# File Manager

- [Methods](#methods)
  - [`0x1000` OPEN_ITEM](#0x1000-open_item)
  - [`0x1001` IS_ITEM_OPENABLE](#0x1001-is_item_openable)
  - [`0x2000` GET_THUMBNAIL](#0x2000-get_thumbnail)
  - [`0x2100` GET_VIDEO_PREVIEW](#0x2100-get_video_preview)
  - [`0xA000` CONTEXT_MENU](#0xa000-context_menu)

A file manager is an application which can manage the filesystem's content. It does not have any restriction on its user interface, but needs to expose an integration service with the standardized methods and notifications described in this document.

Applications can indicate themselves as file manager by specifying an `SYS_FMAN` service in their [manifest](../../applications.md#application-manifest). They rely on [file openers](file-openers.md) to open files.

The end user chooses a single file manager (called the _default_ file manager) between all available ones, whose service will be used by other applications.

## Methods

### `0x1000` OPEN_ITEM

Open a filesystem item.

**Arguments:**

- [Filesystem path](filesystem-interfaces.md#filesystem-paths)

**Answer:**

_None_

**Errors:**

- `0x3000`: Invalid FMP
- `0x3001`: Could not find the provided item
- `0x4000`: User cancelled the opening
- `0x4001`: Could not find an application to open the provided item
- `0x4002`: Failed to open the provided item due to an I/O error
- `0x4FFF`: Unspecified error

### `0x1001` IS_ITEM_OPENABLE

Check if a filesystem item could be opened without user interaction.

**Arguments:**

- [Filesystem path](filesystem-interfaces.md#filesystem-paths)

**Answer:**

- `0x02` if the file could be opened without user interaction, `0x01` if it couldn't, `0x00` if the file couldn't be opened at all

**Errors:**

- `0x3000`: Invalid FMP
- `0x3001`: Could not find the provided item
- `0x4000`: Unspecified error

### `0x2000` GET_THUMBNAIL

Get the thumbnail for a specific item.

The thumbnail should be generated using the [`sys::fsh`](../../services/system/fsh.md) system service, which will provide the cached thumbnail (if any) and else ask for a thumbnail buffer, which will be put in the cache if relevant.

**Arguments:**

- Refresh mode (1 byte): `0x00` to get the current thumbnail or a cached one, `0x01` to force generating a new thumbnail for the item
- [Filesystem path](filesystem-interfaces.md#filesystem-paths)

**Answer:**

- Thumbnail as a [bitmap image](../../kernel/data-structures.md#bitmap-images)

**Errors:**

- `0x3000`: Invalid FMP
- `0x3001`: Could not find the provided item
- `0x4000`: The thumbnail generator failed
- `0x4FFF`: Unspecified error

### `0x2100` GET_VIDEO_PREVIEW

Get the video preview for a specific item.

The preview should be generated using the [`sys::fsh`](../../services/system/fsh.md) system service, which will provide the cached preview (if any) and else ask for a preview buffer, which will be put in the cache if relevant.

**Arguments:**

- Refresh mode (1 byte): `0x00` to get the current preview or a cached one, `0x01` to force generating a new preview for the item
- [Filesystem path](filesystem-interfaces.md#filesystem-paths)

**Answer:**

- Preview as a [bitmap video](../../kernel/data-structures.md#bitmap-videos)

**Errors:**

- `0x3000`: Invalid FMP
- `0x3001`: Could not find the provided item
- `0x4000`: The preview generator failed
- `0x4FFF`: Unspecified error

### `0xA000` CONTEXT_MENU

Generate a context menu for a specific filesystem item. Used by the DEA.

**Arguments:**

- [Filesystem path](filesystem-interfaces.md#filesystem-paths)

**Answer:**

- [Interface window](../../../ux/desktop-environment.md#interface-windows) identifier (8 bytes)

**Errors:**

- `0x3000`: Invalid FMP
- `0x3001`: Could not find the provided item
- `0x4000`: User cancelled the opening
- `0x3001`: Could not find an application to open the provided item
- `0x4002`: Failed to open the provided item due to an I/O error
- `0x4FFF`: Unspecified error
