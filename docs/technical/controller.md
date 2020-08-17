# Controller

The _controller_ is a system library that manages permissions of processes. The [_I/O manager_](io-manager.md) relies on it to accept or reject requests.

- [Notion of scope](#notion-of-scope)
- [The `perm` system library](#the-perm-system-library)
- [Permissions extension](#permissions-extension)

## Notion of scope

Permissions are split into several scopes:

- The _application scope_ contains the permissions a given process is borned from ;
- The _user scope_ contains the permissions the user who launched the application has ;
- The _mode scope_ contains the permissions the _execution mode_ (either system or userland) has.

The mode scope restricts the user scope, which itself restricts the application scope. This means that, if the application scope specify a permission that is not covered by the user scope, it is not applyable to the process. This allows to prevent applications and users from getting too high permissions.

The mode scope prevents applications from performing harmful tasks such as writing the system. Only system applications, which run in system mode instead of userland mode, gets an unrestricted mode scope.

## The `perm` system library

The `perm` system library is an interface for the controller which allows processes to check their own permissions, ensure they can make I/O requests before effectively making them, and extend their permissions (see below).

## Permissions extension

A process can, at any moment, send a _permission extension request_ (PER) using the `perm` library. It allows to gain a new permission by showing an overlay the user can accept or decline. If the permission is accepted, the requested permission is added to the process' one - and sometimes to the application's one.

If the requested permission is out of its maximum scope (e.g. asking for write access to `/etc` while being ran as standard user), the request is rejected.
