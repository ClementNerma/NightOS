## File openers

A file opener is an application which can associate open specific items. It exposes an integration service with the standardized methods and notifications described in this document.

The list of openers can be viewed and modified through the [`sys::fsh`](../system-services/fsh.md).

They are essentially used by the [default file manager](file-managers.md).

## Methods

### `0x10` OPEN_ITEM

Open a filesystem item.

**Arguments:**

- [FMP](file-managers.md#file-manager-paths)

**Answer:**

_None_

**Errors:**

- `0x10`: Invalid FMP
- `0x11`: Could not find the provided item
- `0x30`: User cancelled the opening
- `0x31`: Could not find an application to open the provided item
- `0x32`: Failed to open the provided item due to an I/O error
- `0xF0`: Unspecified error

### `0x20` GENERATE_THUMBNAIL

Generate a thumbnail for a given filesystem item.

The thumbnail should be generated using the [`sys::fsh`](../system-services/fsh.md) system service, which will provide the cached thumbnail (if any) and else ask for a thumbnail buffer, which will be put in the cache if relevant.

**Arguments:**

- [FMP](file-managers.md#file-manager-paths)

**Answer:**

- [Temporary FEID](../filesystem.md#temporary-feid)

**Errors:**

- `0x10`: Invalid FMP
- `0x11`: Could not find the provided item
- `0x20`: This application does not support thumbnail generation for this item type
- `0x30`: Thumbnail could not be generated from the item as its content is invalid
- `0xF0`: Unspecified error

### `0x21` CAN_GENERATE_THUMBNAIL

Check if the application can generate a thumbnail for a specific filesystem item.  
If it cannot, the default file manager will be in charge of providing a placeholder _or_ using an alternative thumbnail generator.

**Arguments:**

- [FMP](file-managers.md#file-manager-paths)

**Answer:**

- `0x01` if the application can generate a thumbnail for the provided filesystem item, `0x00` else

**Errors:**

- `0x10`: Invalid FMP
- `0x11`: Could not find the provided item
- `0x30`: Thumbnail could not be generated from the item as its content is invalid
- `0xF0`: Unspecified error
