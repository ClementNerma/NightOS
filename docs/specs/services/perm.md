# `sys::perm` service

The `sys::perm` service is used to manage the [privileges](../../concepts/users.md#user-privileges) of [users](../../concepts/users.md) and the [permissions](../../features/permissions.md) of [processes](../kernel/processes.md).

## The purpose of user privileges

In NightOS, executable instructions can run in three different contexts:

* In [applications](../../concepts/applications.md)
* In [system services](../README.md)
* In [the kernel itself](../kernel/README.md)

The kernel doesn't have any limitation on what tasks it is allowed to perform, of course, as it is the one to decide.  
System services communicate directly with the kernel and are trusted processes so they can do anything _in their domain_, which means for instance the [`sys::net`](net.md) cannot ask to manipulate the filesystem, as it's the role of [`sys::fs`](fs.md).

But applications, who run [_userland processes_](../kernel/processes.md) **TODO**

## List of permissions

**TODO**

## Methods

**TODO**

## Notifications

**TODO**
