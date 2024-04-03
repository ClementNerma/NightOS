# `sys::crypto` service

**WARNING:** I am not a cryptography expert, so this document certainly contains mistakes or bad practices. In which case, feel free to let me know!

This service provides ways to perform secure cryptography operations from any process. Most methods do not require any permission.

## Methods

#### `0x1000` RANDOM_BUFFER

Fill a number with random values using a cryptographically-secure method.

**Arguments:**

- [Buffer pointer](../../kernel/data-structures.md#buffer-pointers) (16 bytes)

**Return value:**

_None_

**Errors:**

_None_

## Notifications

**TODO**
