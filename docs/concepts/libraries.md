# Libraries

_Libraries_ allow to share a program between multiple applications.

- [How libraries work](#how-libraries-work)

## How libraries work

Libraries allow to share runtime elements to applications. Unlike the latter, they can be installed in multiple versions. This means you can have three versions of the same library installed at the same time on your computer.

When an application needs to use a library, it explicitly indicates the list of versions it is compatible with. The system then gets the related version and provides it to the application.

Libraries cannot perform interactive tasks by themselves, which means no background process, no commands exposure, no permission granting. Applications simply use libraries as helpers to achieve specific tasks.

For more details, check the [specifications document](../specs/libraries.md).
