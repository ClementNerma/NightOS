# Signals

A process can communicate with any other using _signals_.

## Type of signals

There are different type of signals:

* _Passive signals_, which act roughly like Windows or Linux ones ;
* _Launch signals_, which are passive signals the application receives even before the communication channel is opened ;
* _Confirmable signals_, which expect a _confirmation_ from the target ;
* _Answerable signals_, which expect a specific type of answer from the target ;
* _Data signals_, which attach a specific, constant data readable from the target ;

## Data attachment

Signals can have a _data attachment_, which is a data the target will be able to read.
This allows to give more informations about the signal's expected action, for example.
The PID of the caller process is always joined to the signal.

## Caller restrictions

Processes can restrict their caller, for instance they can ask to only receive signals from processes of the same application.

## Communication permissions

A non-administrator process can communicate with another only if it is ran by the same user, of it it is a _common process_, which usually are system processes that allows to display notifications etc.
An administrator process can communicate with any non-system process.

## List of native signals

* `SYS_IS_READY` (Launch + Confirmable)
    Sent by the system, the application is expected to send a confirmation when it is ready
    (which means when it has finished loading its resources and is able, for instance, to restore a crash save)

* `SYS_IS_AVAILABLE` (Confirmable)
    Sent by the system to ensure the process is not frozen.

* `SYS_IS_AVAILABLE` (Confirmable)
    Sent by the system to ensure the process is not frozen.
    If this the process is displaying a window, and the signal is not confirmed in a short delay, an overlay
      is shown to the user, asking if (s)he wants to kill the process or wait for it.

* `SYS_CRASHSAVE_WILL_RESTORE` (Launch)
    Sent by the system to indicate a crash save restoration signal will be sent when the application is ready.

* `SYS_CRASHSAVE_RESTORE` (Data + Confirmable)
    Sent by the system with the crash save to restore.

* `SYS_CRASHSAVE_COLLECT` (Answerable)
    Sent by the system, the application is expected to return a state data to build a crash save.

* `SUSPEND` (Confirmable)
    Sent by the system, the application is expected to confirm the signal and is immediatly suspended.
    If the application does not confirm the signal within a very short delay, it is suspended anyway.

* `TERMINATE` (Passive)
    Sent to ask the process to terminate.

## List of sendable signals

List of signals that applications can send to the system:

* `GET_CLIPBOARD` (Answerable)
    Ask the system for the clipboard's content

* `SET_CLIPBOARD` (Data + Confirmable)
    Ask the system to replace the clipboard's content

* `ASK_PERMISSION` (Data + Confirmable)
    Ask the system for a permission
    Automatically confirmed if the application already has the related permission

* `RE_ASK_PERMISSION` (Data + Confirmable)
    Re-ask for a permission even if the user rejected it
    This will show the permission asking pop-up with an option to prevent the application from asking again

* `LAUNCH` (Data + Confirmable)
    Launch an application (many options available)