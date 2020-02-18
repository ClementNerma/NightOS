# Processes

NightOS _processes_ are implemented a bit like Linux' ones, with additional features.
There are several types of processes:

* _System processes_, which are created by the system ;
* _Application processes_, in which applications run ;
* _Worker processes_, in which applications' workers run

The base and system processes are called _low-level processes_, while application and worker ones are called _userland processes_.

## User permissions

Each process is ran as a specific user, which determines the maximum allowed scope for [controller requests](controller.md), and with a list of initial permissions (the ones given to the application).
