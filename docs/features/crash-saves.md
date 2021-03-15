# Crash saves

_Crash saves_ prevent most data loss caused by a crash, in all applications supporting it.

- [How crash saves work](#how-crash-saves-work)
- [Crashes detection](#crashes-detection)
  - [Invalid shutdown indicator](#invalid-shutdown-indicator)
  - [Application's crash indicator](#applications-crash-indicator)
- [Restoration process](#restoration-process)

## How crash saves work

Every minute (this delay can be changed in the registry), a `SYS_CRASHSAVE_COLLECT` answerable signal is sent to all running applications.
Applications can then answer with their _state data_, which should contain every data required for the application in order to be restored to its exact current state later. They may join a _title message_, which is expected to be their main window's title - if they have ones.
They can also answer with a specific message telling they won't give a crash save data during the current collect. The signal will still be sent on the next collect process (e.g. a minute later).
A last answer method is with another message telling they won't give any crash save for the running instance. The signal won't be sent again for this instance of the application. This message is most of the time encountered when the application doesn't implement the crash save process.

If the application didn't answer when the next collect occurs, the signal is aborted, but the next one will be sent.

When a crash save has been collected for a given application, it is stored in `/home/[user]/appdata/[appname]/crashsaves/[timestamp]_[pid].csf`.

_NOTE:_ Crash saves' intregrity is controlled using the system's [integrity checker](../technical/integrity-checker.md).

## Crashes detection

### Invalid shutdown indicator

When the system starts up, it creates an empty file in `/etc/sys/awake`.
When the system shutdowns gracefully, this file is removed.

If, during startup, this file already exists, the system hasn't shutdowned gracefully.
When this happens, a dialog message is shown, suggesting to re-open crashed applications with their last crash save.

For each application that do not have an available crash save (e.g. when the system crashed before a crash save could have been collected for this application), an indicator in the dialog box will show this application cannot be restored.

### Application's crash indicator

When an application starts, the system creates an empty file in `/home/[user]/appdata/[appname]/crashsaves/awake` for user applications (even for global applications).

When the application exits gracefully, the file is removed automatically.
When the system detects the application exited, if this file still exists, it shows a dialog box asking if the user wants to relaunch the application with the last crash save.

_NOTE:_ If there is no available crash save (e.g. when the application crashed before a crash save could have been made), the dialog box will simply show the application crashed.

_NOTE:_ Because a crash save could have been collected for several instances of an application, they can all be restored afterwise.

## Restoration process

When a crash save is attempted to be restored, the [`sys::crashsave`](../specs/system-services/crashsave.md) service. When the application is ready, a `SYS_CRASHSAVE_RESTORE` confirmable signal is sent, with the application's crash save.
The application is expected to confirm the signal when it has finished restoring its state using the crash save.
The crash save is not deleted directly, though. It is renamed using the new instance's PID and kept until the next collect process receives a new crash save for this instance.

If the application crashes before another crash save can be made _and_ didn't confirm the restoration signal, when this process happens again, system will indicate the application appear to have crashed during crash save restoration.
