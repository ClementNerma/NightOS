# Storage driver services

Storage driver services handle storage devices. They are used to perform basic I/O operations.

As an application can only expose one single storage driver service, the said service will handle all of the hardware devices it drives. This is why the the [UDI](../system/hw.md#unique-device-identifier) of the target device is provided for each request.

## Methods

### `0x1001` STORAGE_INFOS

Get the storage's informations.

**Arguments:**

- Device's [UDI](../system/hw.md#unique-device-identifier) (8 bytes)

**Return value:**

- Storage's size in bytes (8 bytes)
- Sector's size in bytes (8 bytes)
- Writability (1 byte): `0x00` if the storage is writable, `0x01` else

**Errors:**

_None_

### `0x1100` READ_SYNC

Synchronously read a suite of sectors.

**Arguments:**

- Start sector number (8 bytes)
- Number of sectors to read (8 bytes)

**Return value:**

- Number of bytes read (8 bytes)
- Content of the read sectors

**Errors:**

- `0x3000`: Start sector is out-of-bounds
- `0x3001`: End sector is out-of-bounds

### `0x1101` READ_ASYNC

Asynchronously read a suite of sectors to a writable [abstract memory segment (AMS)](../../kernel/memory.md#abstract-memory-segments).

When the task completes, the [`SECTORS_READ`](#0x1101-sectors_read) notification must be sent to the client.

**Arguments:**

- Start sector number (8 bytes)
- Number of sectors to read (8 bytes)
- AMS identifier (8 bytes)

**Return value:**

- Generated task identifier (8 bytes)

**Errors:**

- `0x3000`: Start sector is out-of-bounds
- `0x3001`: End sector is out-of-bounds

### `0x1200` WRITE_SYNC

Synchronously write a suite of sectors.

The content to write is guaranteed to be aligned with the sectors' size.

**Arguments:**

- Start sector number (8 bytes)
- Number of bytes to write (8 bytes)
- Content to write

**Return value:**

_None_

**Errors:**

- `0x3000`: Start sector is out-of-bounds
- `0x3001`: End sector is out-of-bounds

### `0x1201` WRITE_ASYNC

Asynchronously write a suite of sectors from an [abstract memory segment (AMS)](../../kernel/memory.md#abstract-memory-segments).

When the task completes, the [`SECTORS_WRITTEN`](#0x1201-sectors_written) notification must be sent to the client.

The content to write is guaranteed to be aligned with the sectors' size.

**Arguments:**

- Start sector number (8 bytes)
- Number of bytes to write (8 bytes)
- AMS identifier (8 bytes)

**Return value:**

- Generated task identifier (8 bytes)

**Errors:**

- `0x3000`: Start sector is out-of-bounds
- `0x3001`: End sector is out-of-bounds

## Notifications

### `0x1101` SECTORS_READ

Sent to a client after an asynchronous sectors reading requested using the [`READ_ASYNC`](#0x1101-read_async) method completed.

**Datafield:**

- Task identifier (8 bytes)
- [Fallible result](../../kernel/data-structures.md#fallible-results) with:
  - Success data: number of bytes read (8 bytes)
  - Error code (2 bytes): _None_

### `0x1201` SECTORS_WRITTEN

Sent to a client after an asynchronous sectors writing requested using the [`WRITE_ASYNC`](#0x1201-write_async) method completed.

**Datafield:**

- Task identifier (8 bytes)
- [Fallible result](../../kernel/data-structures.md#fallible-results) with:
  - Success data: _None_
  - Error code (2 bytes): _None_