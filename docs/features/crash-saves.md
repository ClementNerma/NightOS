# Crash saves

_Crash saves_ prevent most data loss caused by a crash, in all applications supporting it.

- [How crash saves work](#how-crash-saves-work)

## How crash saves work

Every minute (this delay can be changed in the registry), a [notification](../specs/kernel/ipc.md#methods-and-notifications) is sent to all running applications.
Applications can then answer with their _state data_, which should contain every data required for the application in order to be restored to its exact current state later. They may join a _title message_, which is expected to be their main window's title - if they have ones.
They can also answer with a specific message telling they won't give a crash save data during the current collect. The signal will still be sent on the next collect process (e.g. a minute later).
A last answer method is with another message telling they won't give any crash save for the running instance. The signal won't be sent again for this instance of the application. This message is most of the time encountered when the application doesn't implement the crash save process.

If the application didn't answer when the next collect occurs, the signal is aborted, but the next one will be sent.

When a crash save has been collected for a given application, it is stored in `/home/[user]/appdata/[appname]/crashsaves/[timestamp]_[pid].csf`.

_NOTE:_ Crash saves' intregrity is controlled using the system's [integrity checker](../technical/integrity-checker.md).

All [native applications](../applications/README.md) support crash saves.
