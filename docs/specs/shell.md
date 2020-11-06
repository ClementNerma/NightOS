# Hydre

The _shell_ is the part responsible for running _scripts_, which are small text-based programs that are natively available on every NightOS installation. It is called _Hydre_ and is part of the system under the form of the [`sys::hydre`](services/hydre.md) service.

You can get a quick overview of Hydre in its [technical document](../technical/shell.md).

**NOTE:** The behaviours described here only apply when using the [Pluton](../applications/Pluton.md) terminal application. Although all terminals are expected to follow these specifications as they act as a standard for terminals, they are technically not forced to and so misbehaviours may appear when using an alternative terminal application.

- [Shell sessions](#shell-sessions)
  - [Sessions security](#sessions-security)
- [Commands evaluation](#commands-evaluation)
- [Command pipes](#command-pipes)
- [Interactivity](#interactivity)
  - [Input data](#input-data)
  - [User inputs](#user-inputs)
  - [Text output](#text-output)
    - [Invalid messages](#invalid-messages)
- [Events handling](#events-handling)
- [Scripting language](#scripting-language)
  - [Pre-evaluation checking](#pre-evaluation-checking)

## Shell sessions

Before evaluating commands, a _shell session_ needs to be created using the [`sys::hydre`](services/hydre.md) service.

A session has the following properties:

- A (changeable) width and height, in number of characters
- Commands output are concatenated

Commands can then be run inside the created session, and once they are all finished the same session can be closed using the same service. This simplify execution chaining, but also enables commands to be notified through the [service's pipes](services.md#communication) when the session is resized.

Only one [shell instruction](shell-scripting.md) can be run at a time, but as it may be made of multiple commands (e.g. `cmd1 | cmd2`), multiple processes may be binded to the same shell session. Also, [background commands](shell-scripting.md#running-in-background) may be running in parallel of the running command.

For instance, when using the [Pluton](../applications/Pluton.md) terminal, it creates on opening a shell session to run the commands in. When a new tab is opened, another shell session is opened for that tab. When the tab is destroyed, the session is destroyed as well, which means all commands running in it (including pipe and background commands) are killed.

### Sessions security

When a command is run, the command's PID is registered in the session's _actors_ list. When the command ends, it is removed from the list.  
When a process contacts the [`sys::hydre`](services/hydre.md) service to access the session it runs in, Hydre gets the session associated to this process' PID, and returns it. If the PID is not associated to any session, the access is refused and the command won't be able to get any information on any session.

This prevents processes from accessing sessions they aren't part of.

## Commands evaluation

Commands are evaluated one by one, as scripts cannot be run in a concurrent way. They are handled as follows:

- Builtin commands are treated internally by the shell
- Application commands will result in launching the requested application in a separate process

## Command pipes

When an application is started from a command, its [execution context](applications/context.md#execution-context) indicates it and the process gets access to several pipes called the _command pipes_:

| Pipe identifier | Standard pipe name | Pipe type | Format  | Description                                                                                                |
| --------------- | ------------------ | --------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| CMDIN           | Typed input        | Raw       | _typed_ | Data coming either from a command pipe (`|`) or, if the input format is `stream`, from an input pipe (`<`) |
| CMDUSR          | Interactive input  | Message   | UTF-8   | Data coming from a terminal session (e.g. user inputs)                                                     |
| CMDMSG          | Messages output    | Message   | UTF-8   | Messages to display in the console, which won't be redirected by default                                   |
| CMDERR          | Errors output      | Message   | UTF-8   | Messages to display as errors in the console, which won't be redirected by default                         |
| CMDRAW          | Raw bytes          | Raw       | Raw     | Output data, which will be redirected if an output pipe (`>`) is used                                      |
| CMDOUT          | Typed output       | Raw       | _typed_ | Typed output data, which will be used by [shell scripts](shell-scripting.md))                              |

The SC/RC identifiers of these pipes are available in the application's [context](applications/context.md).

The process that launched the command gets the ability to:

- Send data to the callee's CMDIN/CMDUSR pipe ;
- Read data from the callee's CMDMSG/CMDERR/CMDRAW/CMDOUT pipes

As this only applies to processes that can be started from commands, this only applies to _application processes_ ; system processes not being linked to commands and worker processes being started from application processes (and so not directly from commands).

Technically speaking, commands are started by the [`sys::hydre`](services/hydre.md) service and so by a system process. This same service creates the pipes and handles them. For more informations on this, please check the service's [documentation](services/hydre.md).

If the process terminates before the return value has been fully transmitted through CMDOUT or if it closes the CMDOUT pipe before fully transmitting the value, the process is considered as faulty and killed immediatly (if still alive). The calling script (if any) exits with an error message, unless the error is caught with `catch`, the error message being generated by the system.

Even if the process closes its CMDMSG or CMDRAW pipe properly (by calling the [`CLOSE_PIPE`](kernel/syscalls.md#0x25-close_pipe)), the command is not considered as finished until the process itself did not terminate.

Note that when a return value has been fully transmitted through CMDOUT, all pipes are closed and the command is considered as finished.

## Interactivity

When an application command is run, the pipes are handled as follows.

### Input data

All data coming from a command pipe (`|`) or from an input pipe (`<`) (if the command's input type is `stream`) are transmitted through CMDIN.
Once the input data have been fully transmitted, the CMDIN pipe is closed.

### User inputs

All user inputs (including raw keystrokes) are transmitted to CMDUSR, except a few ones:

- `Ctrl-.`, which asks the process to suspend (triggers the [`SUSPEND`](kernel/signals.md#0x10-suspend) signal)
- `Ctrl-Shift-.`, which forces the process to suspend (triggers the [`WILL_SUSPEND`](kernel/signals.md#0x11-will_suspend) signal)
- `Ctrl-C`, which asks the process to terminate (triggers the [`TERMINATE`](kernel/signals.md#0x12-terminate) signal)
- `Ctrl-Shift-C`, which forces the process to terminate (triggers the [`WILL_TERMINATE`](kernel/signals.md#0x13-will_terminate) signal)
- Custom GUI keystrokes like `Alt-F4`
- System-handled keystrokes like `Ctrl+Alt+Del`

User input messages use the following format (always starting from the strongest byte/bit):

- Byte 0: modifier keys
  - Bit 0: set if the `Command` or `Windows` key is pressed
  - Bit 1: set if the `Ctrl` key is pressed
  - Bit 2: set if the `Alt` key is pressed
  - Bit 3: set if the `Shift` key is pressed
  - Bit 4: set if the `Fn` key is pressed
  - Bit 5: set if Numeric Lock is enabled
  - Bit 6: set if Caps Lock is enabled
  - Bit 7: set if Scroll Lock is enabled
- Byte 1: keycode
- Bytes 2-5: UTF-8 printable character on 4 bytes, or `0x00` if the character is not printable

### Text output

Commands may output either simple text messages (via CMDMSG) or error text messages (via CMDERR).  
_Conventionnally_ (but it's up to the terminal application), text messages are displayed by default in white while error messages are displayed in red.

Messages must use the following format (always starting from the strongest byte/bit):

- Byte 0-2: RGB foreground color (`0` will use the current one)
- Byte 3-5: RGB background color (`0` will use the current one)
- Byte 6: style
  - Bit 0: if set, the message will be displayed in bold
  - Bit 1: if set, the message will be displayed in italic
  - Bit 2: if set, the message will be displayed with a line below it
  - Bit 3: if set, the message will be displayed with a line above it
  - Bit 4: if set, the message will be displayed reversed
- Byte 7: number of control characters
- Byte 7-(N): control characters on 2 bytes each
- Bytes (N+1)-(END): The message itself, encoded in UTF-8 (can be empty)

Control characters use the following format:

- Strongest byte: control character code
  - `0x00`: no control character
  - `0x01`: move cursor up X times
  - `0x02`: move cursor left X times
  - `0x03`: move cursor right X times
  - `0x04`: move cursor down X times
  - `0x05`: move the cursor to the beginning of the line
- Weakest byte: data byte

For instance, an `0x0305` control character is decomposable in the `0x03` code and the `0x05` data byte, which means moving the cursor to the right 5 times.

#### Invalid messages

A message is considered invalid if at least one of the following conditions is verified:

- The message's length is lower than 8 bytes + 2 \* (number of control characters)
- The provided control character is invalid

Messages that do not follow this format will result in displaying Unicode's replacement character (`0xFFFD`: �) instead.

Messages providing an invalid foreground and/or background color will _conventionnally_ (but it's up to the terminal application) in a specific color to indicate no right color could be determined.

## Events handling

Commands can get informations on the current session using the [`sys::hydre`](services/hydre.md) service.

This allows the command to be notified of events like windows resizing. For more informations, see the service's [specifications document](services/hydre.md).

## Scripting language

You can find more about the script language in the language's [specifications document](../specs/shell-scripting.md).

### Pre-evaluation checking

Before executing a script, the shell looks for errors in it, such as unknown command, invalid argument, type mismatch and so on. If an error is foud, the script doesn't even start to run ; an error is directly reported and the command is considered as failed.

This prevents errors from happening in the middle of a script, leaving it in an inconsistent state ; this also makes script errors easier to debug as they are reported at compile time.
