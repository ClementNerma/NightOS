# Storage permissions map

The **Storage Permissions Map**, or **SPM**, is a non-contiguous data structure used to control access for every user of a computer or [domain](../features/domains.md).

It may be located anywhere in the filesystem.

## How does it work

Each item (identified by its [FEID](filesystem.md#element-unique-identifier))

## Structure

### Header

The SPM's header is a contiguous block located at its beginning.

It is made of the following:

- Number of pages (8 bytes)
- Address of the first page (8 bytes) - `0` if none
- Address of the last page (8 bytes) - `0` if none

### Pages' header

Each page is made of a contiguous header (data block) made of the following:

- Maximum number of entries (capacity) (8 bytes)
- Number of free entries (8 bytes)
- Address of the previous page (8 bytes) - `0` if none
- Address of the next page (8 bytes) - `0` if none
- For each entry:
  - Address of the entry (8 bytes)

### Entries

Each page contains a set of entries, which may be split on the disk. An entry is made of the following:

- Address of the page referencing this entry (8 bytes)
- [FEID](filesystem.md#element-unique-identifier) of the item this entry is for (8 bytes)
- Number of entities described in the entry (8 bytes)
- For each entity:
  - Entity type (1 byte):
    - `0x01`: [User](../concepts/users.md)
    - `0x02`: [Group](../concepts/users.md#groups)
  - Entity ID (8 bytes)
  - [Permission levels](#permission-levels)
    - Bits 00-01: List directory's content
    - Bits 02-03: Read files
    - Bits 04-05: Create new items
    - Bits 06-07: Edit items
    - Bits 08-09: Delete items
    - Bits 10-11: Read metadata
    - Bits 12-13: Write metadata
    - Bits 14-15: Change owner
    - Bits 16-17: Edit SPM permissions

An item's owner will have all of these permissions set by default.

An entry's content must be contiguous ; if it grows too large to fit inside its allocated space when updated, it must be moved somewhere else.

### Permission levels

A _permission level_ is a 2-bit value which can either be:

- `0b00`: inherit from the parent entity / from the system's settings
- `0b01`: refuse for this specific item
- `0b10`: allow for this item, recursively
- `0b11`: allow for this item but only for content owned by the referred entity, recursively

### File table pointer

Unless a filesystem does not support it, nor natively or through the use of extended attributes, each file and directory's entry must contain the address of its entry in the SPM, with `0` indicating no entry exists for it.

When the item is created, no entry is created for it by default. It's only when permissions are set for the item that an entry is made and referenced in the file table.

When the entry is cleared, it is destroyed and the `0` value is assigned back to the file table entry's SPM pointer.