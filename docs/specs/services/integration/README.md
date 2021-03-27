# Integration services

This document lists all [integration services](../../services.md#types-of-services), which are services whose methods and notifications follow a convention established by the system itself to permit an integration at different levels.

An application exposing such a service in its [manifest](../../applications.md#application-manifest) will automatically be assignable to specific tasks, such as being set as the default desktop environment or file manager.

These services are not available directly to the end applications ; they can only be used through [system services](../../services/system/README.md).

## Error codes

Error codes follow a specific convention, but all may not be returned by the services in case of errors.

Some error codes are only reserved to services supporting the additional check tied to the said error code.

## List of integration services

* [Desktop environment](desktop-environments.md)
* [File managers](file-managers.md)
* [File openers](file-openers.md)
* [Filesystem interfaces](filesystem-interfaces.md)