# `sys::crypto` service

**WARNING:** I am not a cryptography expert, so this document certainly contains mistakes or bad practices. In which case, feel free to let me know!

This service provides ways to perform secure cryptography operations from any process. Most methods do not require any permission.

## Methods

### `0x1000` GENERATE_NUMBER

Generate a 64-bit number using a cryptographically-secure method with a high level of entropy. A TPM will be used if available.

**Arguments:**

_None_

**Return value:**

- Generated number (8 bytes)

**Errors:**

_None_

#### `0x0001` RANDOM_BUFFER

Fill a number with random values using a cryptographically-secure method.

Generation is performed using the same methods as for [`GENERATE_NUMBER`](#0x1000-generate_number).

**Arguments:**

- [Buffer pointer](../../kernel/data-structures.md#buffer-pointers) (16 bytes)

**Return value:**

_None_

**Errors:**

_None_

## Notifications

**TODO**
