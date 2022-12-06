# `sys::crypto` service

**WARNING:** I am not a cryptography expert, so this document certainly contains mistakes or bad practices. In which case, feel free to let me know!

## Methods

### `0x1000` GENERATE_NUMBER

Generate a 64-bit number using a cryptographically-secure method.

**Arguments:**

_None_

**Return value:**

- Generated number (8 bytes)

**Errors:**

_None_

#### `0x0001` RANDOM_BUFFER

Fill a number with random values using a cryptographically-secure method.

**Arguments:**

- Address of the buffer to fill (8 bytes)
- Number of bytes to write (8 bytes)

**Return value:**

_None_

**Errors:**

_None_

## Notifications

**TODO**
