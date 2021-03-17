# File Manager

- [File manager paths](#file-manager-paths)
- [Methods](#methods)
  - [`0x10` OPEN_ITEM](#0x10-open_item)
  - [`0x11` IS_ITEM_OPENABLE](#0x11-is_item_openable)
  - [`0x20` GET_THUMBNAIL](#0x20-get_thumbnail)
  - [`0xA0` CONTEXT_MENU](#0xa0-context_menu)

A file manager is an application which can manage the filesystem's content. It does not have any restriction on its user interface, but needs to expose an integration service with the standardized methods and notifications described in this document.

Applications can indicate themselves as file manager by specifying an `SYS_FMAN` service in their [manifest](../../applications/manifest.md). They rely on [file openers](file-openers.md) to open files.

The end user chooses a single file manager (called the _default_ file manager) between all available ones, whose service will be used by other applications.

## File manager paths

Paths destinated to file managers are called _file manager paths_ (FMP) and can be encoded with either:

- A `0x00` status code (1 byte)
- [FEID](../../filesystem.md#element-unique-identifier) (8 bytes)

Or:

- A `0x01` status code (1 byte)
- A [delimited string](../../kernel/data-structures.md#delimited-strings)

## Methods

### `0x10` OPEN_ITEM

Open a filesystem item.

**Arguments:**

- [FMP](#file-manager-paths)

**Answer:**

_None_

**Errors:**

- `0x10`: Invalid FMP
- `0x11`: Could not find the provided item
- `0x30`: User cancelled the opening
- `0x31`: Could not find an application to open the provided item
- `0x32`: Failed to open the provided item due to an I/O error
- `0xF0`: Unspecified error

### `0x11` IS_ITEM_OPENABLE

Check if a filesystem item could be opened without user interaction.

**Arguments:**

- [FMP](#file-manager-paths)

**Answer:**

- `0x02` if the file could be opened without user interaction, `0x01` if it couldn't, `0x00` if the file couldn't be opened at all

**Errors:**

- `0x10`: Invalid FMP
- `0x11`: Could not find the provided item
- `0xF0`: Unspecified error

### `0x20` GET_THUMBNAIL

Get the thumbnail for a specific item.

The thumbnail should be generated using the [`sys::fsh`](../../services/system/fsh.md) system service, which will provide the cached thumbnail (if any) and else ask for a thumbnail buffer, which will be put in the cache if relevant.

**Arguments:**

- Refresh mode (1 byte): `0x00` to get the current thumbnail or a cached one, `0x01` to force generating a new thumbnail for the item
- [FMP](#file-manager-paths)

**Answer:**

- [Temporary FEID](../../filesystem.md#temporary-feid) to the thumbnail

**Errors:**

- `0x10`: Invalid FMP
- `0x11`: Could not find the provided item
- `0x30`: The thumbnail generator failed
- `0xF0`: Unspecified error

### `0xA0` CONTEXT_MENU

Generate a context menu for a specific filesystem item. Used by the DEA.

**Arguments:**

- [FMP](#file-manager-paths)

**Answer:**

- [Interface window](../../../ux/desktop-environment.md#interface-windows) identifier (8 bytes)

**Errors:**

- `0x10`: Invalid FMP
- `0x11`: Could not find the provided item
- `0x30`: User cancelled the opening
- `0x31`: Could not find an application to open the provided item
- `0x32`: Failed to open the provided item due to an I/O error
- `0xF0`: Unspecified error
