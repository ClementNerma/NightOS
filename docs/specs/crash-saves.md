# Crash Saves

Crash saves is a [major feature](../features/crash-saves.md) of NightOS. It consists in collecting the state of running applications and saving it for later restore in case of application or system crash.

Crash saves is handled through the [`sys::crashsave`](../specs/services/system/crashsave.md) service.

## Applications support

To support crash saves, applications must opt-in through an option in their [manifest](applications.md#application-manifest).

## Crash saves collection

Every once in a while (once per minute by default), a [`CRASH_SAVE_COLLECTION`](services/system/crashsave.md#0x0100-crash_save_collection) notification is sent to the application, which is expected to write a state it will be able to restore later on in a temporary file provided by the [`sys::crashsave`](../features/crash-saves.md) service.

## Crash saves restoration

If a crash save must be restored (occurs after an application is opened for the first time following a [detected crash](#crashes-detection)), a [`RESTORE_CRASH_SAVE`](services/system/crashsave.md#0x0200-restore_crash_save) signal is sent to the application with a temporary file containing the state it previously wrote in, as well as a few other informations.

The application can then decide if the crash save file must be removed or not.

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

When a crash save is attempted to be restored, the [`sys::crashsave`](../specs/services/system/crashsave.md) service. When the application is ready, a `SYS_CRASHSAVE_RESTORE` confirmable signal is sent, with the application's crash save.
The application is expected to confirm the signal when it has finished restoring its state using the crash save.
The crash save is not deleted directly, though. It is renamed using the new instance's PID and kept until the next collect process receives a new crash save for this instance.

If the application crashes before another crash save can be made _and_ didn't confirm the restoration signal, when this process happens again, system will indicate the application appear to have crashed during crash save restoration.
