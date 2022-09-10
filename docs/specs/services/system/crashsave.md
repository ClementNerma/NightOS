# `sys::crashsave` service

## Methods

### `0x0100` GET_LAST_CRASH_SAVE

Get the last crash save for this application, if any. The crash saves removal can be controlled by the answer provided to the [`RESTORE_CRASH_SAVE`](#0x0200-restore_crash_save) notification.

**Arguments:**

_None_

**Answer:**

- [Optional](../../kernel/data-structures.md#data-structures) data provided in the datafield of the [`RESTORE_CRASH_SAVE`](#0x0200-restore_crash_save) notification (none if there is no crash save for this application)

### `0x0101` REMOVE_CRASH_SAVE

Remove the existing crash save for this application.

**Arguments:**

_None_

**Answer:**

- Status (1 byte):
  - `0x00`: the crash save was successfully deleted
  - `0x01`: no crash save was found for this application
  - `0x02`: couldn't delete the crash save as the file is currently in use

## Notifications

### `0x0100` CRASH_SAVE_COLLECTION

Sent to a process during crash save collection.

It is only sent to applications indicating they support crash saves in their [manifest](../../applications.md#application-manifest).

**Datafield:**

- Number in seconds under which this notification must be answered (1 byte)
- [Timestamp](../../kernel/data-structures.md#timestamps) of the last crash save for this application (1 byte)
- `0x01` if this notification was not answered in time the last time it was sent, `0x00` otherwise (1 byte)
- [Temporary FEID](../../filesystem.md#temporary-feid) to write the crash save in

**Expected answer:**

- Status (1 byte):
  - `0x00` if the crash save was written succesfully
  - `0x01` if the application didn't have enough time to fully write the crash save
  - `0x02` if the application couldn't create a crash save for whatever reason
  - `0x03` if the application couuldn't create
- [Optional](../../kernel/data-structures.md#options) [log message](../../kernel/data-structures.md#delimited-strings) which will be written to the system's logs

### `0x0200` RESTORE_CRASH_SAVE

Sent to a process when a [crash save](../../../features/crash-saves.md) is to be restored.

This notification is sent only if the correct bit is set in the [application's startup reason](../../applications.md#startup-reason).

**Datafield:**

- [Temporary FEID](../../filesystem.md#temporary-feid) to the crash save (8 bytes)
- [Timestamp](../../kernel/data-structures.md#timestamps) when the [`CRASH_SAVE_COLLECTION`](#0x0100-crash_save_collection) signal that resulted in this crash save was sent (8 bytes)
- [Timestamp](../../kernel/data-structures.md#timestamps) when this crash save was actually written to the disk (8 bytes)
- `0x00` if this crash save is sent for the first time, `0x01` if the application was interrupted before it answered this notification the last time (e.g. application or system crash) (1 byte)
- `0x00` if this crash save is sent for the first time or if the application itself didn't crash while trying to restore it the last time, `0x01` if the application itself crashed last time (1 byte)

**Expected answer:**

- Status (1 byte):
  - `0x01`: crash save was restored successfully
  - `0x02`: crash save is corrupted and/or invalid
- `0x00` if the crash save can be deleted, `0x01` if it should be kept (1 byte)
