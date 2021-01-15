# Libraries

_Libraries_ allow to share a program between multiple applications.

- [How libraries work](#how-libraries-work)

## How libraries work

Unlike applications, libraries can be installed in multiple versions. This means you can have three versions of the same library installed at the same time on your computer.

When an application wants to use a library, it explicitly indicates the list of versions it is compatible with. The system then gets the related version and provides it to the application.

A library by itself cannot do itself: no background process, no commands exposure, no permission granting. Applications simply use libraries as helpers to achieve specific tasks.

For instance, the system library `fs` which is natively available allows to manipulate files and directories easily.
