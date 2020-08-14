# Shell

The _shell_, called _Hydre_, is the part that interprets scripts.

- [Commands](#commands)
- [Pipes](#pipes)
- [Specifications](#specifications)

## Commands

Hydre works using _commands_, which can take _arguments_.
When running a command which comes from an applications which [expose it](../concepts/applications.md#commands), the said application is run in a new process which uses its [execution context](../specs/applications/context.md#execution-context).

The special thing about running an application from one of its exposed commands is that its CMDIN, CMDUSR, CMDMSG, CMDERR, CMDOUT and CMDRAW pipes are exposed to the caller.

You can find more informations about how a process can interact with a running command in the [IPC documentation](../specs/ipc.md#interactive-usage).

## Pipes

When a command is run from [Pluton](../applications/Pluton.md), the command process' pipes are handled as follows:

- All user inputs are sent to the CMDUSR pipe
- All messages sent through CMDMSG and CMDERR pipes are printed as they are received by the shell
- The command's return value (from CMDOUT) is printed after the command completes
- Data written to CMDRAW is not shown, as they don't have to be UTF-8 encoded, or even to be a string. They can be redirected through pipes, though

## Specifications

Hydre's specifications can be found in the [related document](../specs/shell.md).
