# System-related scoped services

This document lists all system-related [scoped services](../services.md#scoped-services), which are services whose methods and notifications follow a convention established by the system itself.

An application exposing such a service in its [manifest](../applications/manifest.md) will automatically be assignable to specific tasks, such as being set as the default desktop environment or file manager.

These scoped services' name start with a `SYS_` prefix to indicate their convention.

These services are not available directly to the end applications ; they can only be used through [system services](../system-services/README.md).

## List of system-related scoped services

* [Desktop environment](desktop-environments.md)
* [File managers](file-managers.md)
* [Filesystem openers](filesystem-openers.md)