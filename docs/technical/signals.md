# Signals

A process can communicate with any other using _signals_.

## Type of signals

There are different type of signals:

* _Passive signals_, which act roughly like Windows or Linux ones ;
* _Launch signals_, which are passive signals the application receives even before the communication channel is opened ;
* _Confirmable signals_, which expect a _confirmation_ from the target ;
* _Answerable signals_, which expect a specific type of answer from the target ;
* _Data signals_, which attach a specific, constant data readable from the target ;

Besides, signals can either be:

* _Receivable_: they can be received and treated by a handler function ;
* _Sendable_: they can be sent to other processes and may fail depending on the specific signal

## Data attachment

Signals can have a _data attachment_, which is a data the target will be able to read.
This allows to give more informations about the signal's expected action, for example.
The PID of the caller process is always joined to the signal.

## Caller restrictions

Processes can restrict their caller, for instance they can ask to only receive signals from processes of the same application.

## Communication permissions

A non-administrator process can communicate with another only if it is ran by the same user and originates from the same application, of it it is a _common process_, which usually are system processes that allows to display notifications etc.
An administrator process can communicate with any non-system process.
