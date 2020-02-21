# Application Context

The _application context_ is a piece of data that is provided when the application starts.

## Data structure

The context is stored as a single block of data.

The first byte is called the  _execution context_ and indicates the reason the application was started. It may be:
  * `0x01`: the application was started by the system as an [application service](../../concepts/applications.md#services)
  * `0x02`: the application was started automatically after an improper shutdown (and will *likely* receive a crash save soon)
  * `0x03`: the application was started by the desktop environment
  * `0x04`: the application was started by itself (from another process of the same application)
  * `0x05`: the application was started by another application
  * `0x06`: the application was started using one its exposed [shell commands](../../concepts/applications.md#commands)

It is followed by indicators used to determine command-line usage:

* _Bytes 001-001_: The number of arguments the process was started with (0 to 255)
* _Bytes 002-003_: Cumulated size of all arguments in bytes (up to 63.5 KB)
* _Bytes 003-255_: Future-proof
* _Bytes 256-511_: Name of the command (filled with zeros if the process is not created as a command)
* _Bytes 512-end_: Value of arguments

The context's size may vary depending on the provided command-line arguments from 512 bytes to 64 KB.

## Arguments structure

Each argument is represented as a [type](../shell-scripting.md#value-types) code described below, followed by its actual value depending on the concrete type:

| Type code | Type      | Description                         | Representation                                                                                   |
| --------- | --------- | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| `0x01`    | `bool`    | Boolean                             | 1 byte, `0x00` = falsy, `0x01` = truthy                                                          |
| `0x02`    | `int`     | 64-bit signed integer number        | Two's complement                                                                                 |
| `0x03`    | `float`   | 64-bit signed floating-point number | [IEEE 754](https://standards.ieee.org/standard/754-2019.html)                                    |
| `0x04`    | `string`  | UTF-8 string                        | String's length (64 bits), followed by the UTF-8 encoded string                                  |
| `0x05`    | `list`    | Typed linear list                   | Type code of the list's items, followed by the list's length (64 bits), then by the list's items |
| `0x06`    | `path`    | Filesystem path                     | Represented as an UTF-8 string                                                                   |
| `0x07`    | `command` | Shell command                       | Represented as an UTF-8 string                                                                   |
