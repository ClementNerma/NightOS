# Shell

The _shell_, called _Hydre_, is the part that interprets scripts.

## Commands

Hydre works using _commands_, which can take _arguments_.
When running a command which comes from an applications which [expose it](../concepts/applications.md#commands), the said application is run in a new process which uses its [execution context](../specs/applications/context.md#execution-context).

The special thing about running an application from one of its exposed commands is that its STDIN, STDOUT, STDRAW, STDERR and STDRET pipes are exposed to the caller.

You can find more informations about how a process can interact with a running command in the [IPC documentation](../specs/ipc.md#interactive-usage).

## Scripting language

You can find more about the script language in the [related document](../specs/shell-scripting.md).
