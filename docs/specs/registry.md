# Registry

This document describes the format of the [system registy](../technical/registry.md) as well as its content.

## Format

The registry is located in the `/etc/sys/registry` file. It's basically a nested B-Tree map.

Each map has string keys and a value that describes the entry: its purpose, its type with optional constraints, and then the type-safe value.

All types are described as a name, optionally followed by a maximum number of entries between brackets or a maximum number of bytes between braces. Here is the list, in [HFRR notation](#hffr-format):

| Name               | Size (s) in bytes     | Description                                                                                   |
| ------------------ | --------------------- | --------------------------------------------------------------------------------------------- |
| `struct`           | s = ?                 | A structure - keys are ASCII strings and values' type may be various                          |
| `string`           | s = ?                 | An UTF-8 encoded string                                                                       |
| `string[x]`        | x <= s <= x \* 4      | An UTF-8 encoded string with a maximum capacity of `x` characters                             |
| `string{x}`        | s <= x \* 4           | An UTF-8 encoded string with a maximum capacity of `x` bytes                                  |
| `asciistr`         | s = ?                 | An ASCII encoded string                                                                       |
| `asciistr[x]`      | s <= x                | An ASCII encoded string with a maximum capacity of `x` characters                             |
| `asciistr{x}`      | s <= x                | An ASCII encoded string with a maximum capacity of `x` bytes                                  |
| `int{x}`           | s = x                 | A signed integer on `x` bytes                                                                 |
| `uint{x}`          | s = x                 | An unsigned integer on `x` bytes                                                              |
| `float{x}`         | s = x                 | A floating-point number on `x` bytes                                                          |
| `pfloat{x}`        | s = x                 | A positive floating-point number on `x` bytes                                                 |
| `ints`             | s = {CPU bits}        | A signed integer on as many bytes as the CPU                                                  |
| `uints`            | s = {CPU bits}        | An unsigned integer on as many bytes as the CPU                                               |
| `bool`             | s = 1                 | A boolean                                                                                     |
| `list:type`        | s = ?                 | A list of entries with the provided `type`                                                    |
| `list[x]:type`     | s = sizeof(type) \* x | A list of entries with the provided `type` with a maximum of `x` entries                      |
| `structlist`       | s = ?                 | A list of structures guaranteeing its first entry (the structure model) will never be removed |
| `map:(key):(val)`  | s = ?                 | A dictionary mapping keys of the `key` to values of the `val` type                            |
| `mapc:(key):(val)` | s = ?                 | A dictionary mapping all possible keys of the `key` to values of the `val` type               |
| `structmap:(key)`  | s = ?                 | A dictionary mapping keys of the `key` to structures                                          |
| `structmapc:(key)` | s = ?                 | A dictionary mapping all possible keys of the `key` to structures                             |
| `time(p)`          | s <= 8                | A duration with a precision of `p` (see below)                                                |
| `tmin(p,min)`      | s <= 8                | Equivalent of `time(p)` but with a minimum value                                              |
| `tmax(p,min)`      | s <= 8                | Equivalent of `time(p)` but with a maximum value                                              |
| `tbtw(p,min,max)`  | s <= 8                | Equivalent of `time(p)` but with a minimum and a maximum value                                |
| `stime(p)`         | s <= 8                | Equivalent of `time(p)` but allows negative durations                                         |
| `size(p)`          | s <= 8                | A data size with a precision of `p` (see below)                                               |
| `smin(p,min)`      | s <= 8                | Equivalent of `size(p)` but with a minimum value                                              |
| `smax(p,min)`      | s <= 8                | Equivalent of `size(p)` but with a maximum value                                              |
| `sbtw(p,min,max)`  | s <= 8                | Equivalent of `size(p)` but with a minimum and a maximum value                                |
| `id:app`           | s <= 256              | Identifier of an installed application (ASCII string)                                         |
| `id:lib`           | s <= 256              | Identifier of an installed library (ASCII string)                                             |
| `id:user`          | s = 4                 | Identifier of an installed user (32-bit unsigned number)                                      |
| `in:(type):(a...)` | s = max(sizeof(type)) | Any value in the provided tuple                                                               |

The registry's root is a `struct`. Each key-value association in a struct is called a _node_. Nodes that are single values (neither a list, a map or a structure) or called _leafs_.

All sizes that are exceptly provided in bytes must be a multiple of two.

### Notes about types

- Durations (`time`, `tmin`, `tmax` and `tbtw` types) have a precision which indicate the smallest unit of time they accept. `1` is for years, `2` for months, `3` for weeks, `4` for days, `5` for hours, `6` for minutes, `7` for seconds, `8` for milliseconds, `9` for microseconds and `10` for nanoseconds.

- Sizes (`size`, `smin`, `smax` and `sbtw` types) accept values that are a multiple of their precision. `1` is for terabytes, `2` for gigabytes, `3` for megabytes, `4` for kilobytes, `5` for bytes and `6` for bits.

- For the `struct` type, there is no need to specify the list of possible keys and the type of associated values, because they are already present in the registry when it's installed by the system - so it's all implicit. The keys in a struct should never change through time, nor the type of the value of each key. As such, it is not possible to create a list of `struct`, for instance.

- For map structures (`structmap` and `structmapc`), the first key when sorting using the default algorithm for each type is guaranteed to never be removed. Its mapped value acts as the model structure for all over values in the map.

## HFFR Format

The registry can be converted for debugging to an HFRR text file (Human-Friendly Registry Format).

In this format, structures' keys are described using the `key(type):` format. Each line following it describing its value is indented by a tabulation (`\t`). The tabulation is decreased when the value has been fully describes.

Strings are describes using double quotes, with a `r` prefix symbol for ASCII strings. Floating-point numbers use a `.` symbol as their decimal separators, and an explicit `+` or `-` symbol indicates all numbers' sign.

Each list entry is prefixed by a `-` symbol, and each key is described as a set of `key: value` list (on multiple lines for lists and maps).

Empty lists are represented as `[]` and empty maps as `{}`.

Durations are represented as a combination of one or more integer numbers each followed by a time suffix (`ns` for nanoseconds, `us` for microseconds, `ms` for milliseconds, `s` for seconds, `m` for minutes, `h` for hours, `d` for days, `w` for weeks, `mo` for months or `y` for years). Also, combinations use the space separator and numbers are represented with leading zeros if necessary, except for the first number.

So for instance, a duration of 2 days and 10 seconds will give the string `2d 10s`.

Sizes are represented just like times, but with different suffixes (`TB` for terabytes, `GB` for gigabytes, `MB` for megabytes, `KB` for kilobytes, `B` for bytes and `b` for bits), and without leading zeroes.

So for instance a size of two terabytes and three kilobyte will be represented as `1TB 3KB`.

The easiest way to understand the format is to look at the default registry structure presented below.

## Structure

**NOTE: This section is under heavy development and is by no mean complete!**

Here is the content of the default registry file (when installing NightOS with all default settings), converted to the [HFRR format](#hffr-format):

```yaml
# System configuration
system(struct):
  # Debugging options
  debugging:
    # Is development mode enabled?
    dev_mode(bool): true

  # Encryption
  encryption:
    # Is the global storage encrypted?
    global_encrypted(bool): false

  # Date and time
  datetime:
    # Is it based on the internet? (if not, it's a custom one)
    internet_based(bool): true
    # In the case the date is not internet-based, provide a timestamp which indicates the difference between the computer's
    #  local datetime and the one that should be displayed
    custom_based_diff(stime(ns)): 0ns

  # Crash saves
  crash_saves(struct):
    # Restore crash saves as soon as the user logs in
    restore_on_login(bool): true
    # Do not save crash saves for guest users
    disable_for_guest_user(bool): true
    # Delay between each crash save
    collect_every(tmin(s,1s)): 60s
    # Ask an application to create a new crash save even if the previous new has not been completed yet
    collect_if_previous_unanswered(bool): false

  # Freeze-prevention
  freeze_prevention(struct):
    # Reserved amount of memory (0 = disabled)
    reserved_memory(MB): 16MB
    # Reserved amount of CPU per virtual core (0 = disabled)
    reserved_cpu_vcore(uint{1}): 1

# Users (keys = user's unique identifier, value = user's type with 0 = main admin., 1 = admin., 2 = standard, 3 = guest)
# Detailed informations about each user (nickname, privileges, encryption password, ...) and groups are stored
#   in the user profiles file at '/etc/sys/users'
users(map:(uint{4}):(in:(0,1,2,3))):
  0: 1 # System
  1: 1 # Administrator
```
