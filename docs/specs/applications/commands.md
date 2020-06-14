# Commands

Applications can expose commands through their [manifest](manifest.md).

The format is the same as the [shell's command typing](../shell-scripting.md#commands-typing), although adapted to YAML:

- The `pos` or `dash` indicator is turned into a (required) `syntax` option
- The `optional` indicator becomes a boolean that must be set to `true`
- The `void` type is forbidden

## Example

```yaml
# [...beginning of the manifest...]
commands:
  say_hello:
    help: "A program that repeats the name of a list of person"
    author: "Me <my@email>" # Optional
    license: "MIT" # Optional
    return: void
    args:
      # Declare a positional argument named 'names' with a help text
      names:
        syntax: pos
        type: list[string]
        help: "List of names to display"

      # Declare a dash argument named 'repeat'
      repeat:
        syntax: dash
        type: int
        short: r
        long: repeat
        optional: true

      # Return the time this command took to complete
      get-duration:
        syntax: presential
        short: d
        long: duration
        $if:
          cond: present()
          return: void
# [...end of the manifest...]
```

## Values encoding

The value must be returned using the [STDRET](../ipc.md#interactive-usage) pipe. The data sent through this pipe must be:

- The return value's length (8 bytes) ;
- The value's [shell type](../shell-scripting.md#value-types) code ;
- The encoded value

| Type code | Type      | Description                         | Representation                                                                             |
| --------- | --------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| `0x00`    | `void`    | Void                                | 1 byte: `0x00`                                                                             |
| `0x01`    | `bool`    | Boolean                             | 1 byte, `0x00` = falsy, `0x01` = truthy                                                    |
| `0x02`    | `int`     | 64-bit signed integer number        | Two's complement                                                                           |
| `0x03`    | `float`   | 64-bit signed floating-point number | [IEEE 754](https://standards.ieee.org/standard/754-2019.html)                              |
| `0x04`    | `char`    | UTF-8 grapheme cluster              | Character's length (8 bytes), followed by the UTF-8 grapheme cluster                       |
| `0x05`    | `string`  | UTF-8 string                        | String's length (8 bytes), followed by the UTF-8 encoded string                            |
| `0x06`    | `list`    | Typed linear list                   | Type code of the list's number of items (1 byte), length in bytes (64 bits), encoded items |
| `0x07`    | `path`    | Filesystem path                     | Represented as an UTF-8 string                                                             |
| `0x08`    | `command` | Shell command                       | Represented as an UTF-8 string                                                             |
| `0x09`    | `stream`  | [Pipe RC](../ipc.md#pipes)          | RC identifier (8 bytes)                                                                    |

The type code is present to avoid misinterpreting the value in case the command returned a value of the wrong type.
