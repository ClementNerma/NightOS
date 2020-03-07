# Application Context

The _application context_ is a piece of data that is provided when the application starts.

## Execution Context

The most important information is the _execution context_, which indicates the reason the application was started.

It is one-byte long and is one the following values:

* `0x01`: the application was started by the system as an [application service](../../concepts/applications.md#services)
* `0x02`: the application was started automatically after an improper shutdown (and will *likely* receive a crash save soon)
* `0x03`: the application was started by the desktop environment
* `0x04`: the application was started by itself (from another process of the same application)
* `0x05`: the application was started by another application
* `0x06`: the application was started using one its exposed [shell commands](../../concepts/applications.md#commands)

## Data structure

The context is stored as a single block of data, consisting of:

* The execution context (1 byte)
* The number of arguments the process was started with (1 byte)
* The cumulated size of all arguments, in bytes - up to 63.5 KB (2 bytes)
* _Future-proof shift space_ (252 bytes)
* The null-terminated name of the command the process was started from, filled with zeros if the process was not created from a command (256 bytes)
* The value of command-line arguments (up to 63.5 KB)

The context's size may vary depending on the provided command-line arguments from 512 bytes to 64 KB.

## Arguments structure

Each argument is represented as a [type](../shell-scripting.md#value-types) code described below, followed by its actual value depending on the concrete type:

| Type code | Type      | Description                         | Representation                                                                             |
| --------- | --------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| `0x01`    | `bool`    | Boolean                             | 1 byte, `0x00` = falsy, `0x01` = truthy                                                    |
| `0x02`    | `int`     | 64-bit signed integer number        | Two's complement                                                                           |
| `0x03`    | `float`   | 64-bit signed floating-point number | [IEEE 754](https://standards.ieee.org/standard/754-2019.html)                              |
| `0x04`    | `string`  | UTF-8 string                        | String's length (64 bits), followed by the UTF-8 encoded string                            |
| `0x05`    | `list`    | Typed linear list                   | Type code of the list's number of items (1 byte), length in bytes (64 bits), encoded items |
| `0x06`    | `path`    | Filesystem path                     | Represented as an UTF-8 string                                                             |
| `0x07`    | `command` | Shell command                       | Represented as an UTF-8 string                                                             |
