# Commands

Applications can expose commands through their [manifest](manifest.md).

The format is the same as the [shell's command typing](../shell-scripting.md#commands-typing), although adapted to YAML:

* The `pos` or `dash` indicator is turned into a (required) `syntax` option
* The `optional` indicator becomes a boolean that must be set to `true`
* The `void` type is forbidden

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
# [...end of the manifest...]
```
