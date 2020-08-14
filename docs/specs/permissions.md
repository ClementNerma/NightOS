# Permissions

**WARNING:** This document is **FAR** from being complete!

This document describes all [application and user permissions](../features/permissions.md).

For applications, these are named _permissions_, while for users their are called _privileges_.

The rule being that applications cannot get permissions that the user running them has not.

- [List of user privileges](#list-of-user-privileges)
- [List of application permissions](#list-of-application-permissions)

## List of user privileges

Below is the list of all user privileges, with `Adm?` referring to commands that are only available in administrator mode:

| Adm? | Name                     | Description                                                                           |
| ---- | ------------------------ | ------------------------------------------------------------------------------------- |
|      | `device.mount`           | Mount an external device                                                              |
|      | `device.unmount`         | Unmount an external device                                                            |
| Yes  | `device.reserve`         | Mount an external device and reserve its name to prevent other devices from using it  |
|      | `runas.admin`            | Ask to run a program as administrator by using an administrator account's credentials |
| Yes  | `users.create_non_admin` | Create a non-administrator user                                                       |
| Yes  | `users.remove_created`   | Remove a user this user previously created                                            |
| Yes  | `users.list`             | See the list of all users on this computer                                            |
| Yes  | `groups.create_scoped`   | Create a group whose privileges do not exceed the domain of this user                 |
| Yes  | `groups.remove_created`  | Remove a group this user previously created                                           |
| Yes  | `groups.remove_self`     | Allow user to remove itself from a group                                              |
|      | `private.microphone`     | Allow user to use the microphone                                                      |
|      | `private.camera`         | Allow user to use the camera                                                          |
|      | `homedir.encrypt`        | Allow user to encrypt its homedir                                                     |

## List of application permissions

Below is the list of all application permissions :

| Scope     | Name          | Description                                                                             |
| --------- | ------------- | --------------------------------------------------------------------------------------- |
| Sensitive | `fs.check`    | Check if a path exists in the filesystem                                                |
| Sensitive | `fs.infos`    | Get informations about a filesystem item                                                |
| Sensitive | `fs.create`   | Create files, directories or symbolic links                                             |
| Sensitive | `fs.readdir`  | List all items inside a directory                                                       |
| Sensitive | `fs.readfile` | Read a file                                                                             |
| Sensitive | `fs.move`     | Move and rename filesystem items                                                        |
| Sensitive | `fs.remove`   | Remove filesystem items                                                                 |
| Sensitive | `net.access`  | Send network requests                                                                   |
| Sensitive | `net.listen`  | Listen to a network port (goes through the [firewall](../applications/Vortex.md) first) |
