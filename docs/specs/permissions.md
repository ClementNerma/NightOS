# Permissions

**WARNING:** This document is **FAR** from being complete!

This document describes all [application and user permissions](../features/permissions.md).

For applications, these are named _permissions_, while for users their are called _privileges_.

The rule being that applications cannot get permissions that the user running them has not.

## List of permissions

Below is the list of all permissions, with `<D>` indicating it's a default privilege for all users:

```
<D> `device.mount`: Mount an external device
<D> `device.unmount`: Unmount an external device
    `device.reserve`: Mount an external device and reserve its name to prevent other devices from using it
<D> `runas.ask`: Ask to run a program as another user (except administrator)
<D> `runas.admin`: Ask to run a program as administrator by using an administrator account's credentials
    `users.create_non_admin`: Create a non-administrator user
    `users.remove_created`: Remove a user this user previously created
    `users.list`: See the list of all users on this computer
    `groups.create_scoped`: Create a group whose privileges do not exceed the domain of this user
    `groups.remove_created`: Remove a group this user previously created
    `groups.remove_self`: Allow user to remove itself from a group
<D> `private.microphone`: Allow user to use the microphone
<D> `private.camera`: Allow user to use the camera
<D> `homedir.encrypt`: Allow user to encrypt its homedir
```
