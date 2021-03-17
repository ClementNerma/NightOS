# Users

- [The concept](#the-concept)
- [Users type](#users-type)
- [Dangers of an admin. account](#dangers-of-an-admin-account)
- [User Privileges Elevation (UPE)](#user-privileges-elevation-upe)
- [Complexity level](#complexity-level)
- [Users' data encryption](#users-data-encryption)
- [Child and supervised users](#child-and-supervised-users)
- [Groups](#groups)
- [User privileges](#user-privileges)

## The concept

Many computers are intended to be shared by multiple persons. In such case, it is useful to separate the data of each user and to prevent other users from accesing another's.

By default, there is two user accounts: the System and the Administrator. They are called _virtual users_ because it's not possible to log in these accounts. Other users (the ones which are created manually) are called _custom users_.

Each custom user has a dedicated data directory called the _homedir_, in `/home/[username]`, as well as a list of files and directories it can read and/or write. By default, each user gets access to:

- Its homedir in `/home/[username]` ;
- The mounted periphericals in `/media` ;
- Its temporary directory in `/tmp/[username]`

## Users type

Each user is of a specific type:

- _Phantom_: the user's data are erased after the computer is turned off ;
- _Standard_: nothing special
- _Administrator_: can run programs directly as administrator
- _Main administrator_: administrator that can manage storage encryption

When a user wants to perform a task it does not have the privileges to, it can (by default) ask to run the task as _another user_. The other user's credentials are then required.

It's not possible to ask to run a task as system or as administrator as these accounts are virtual and do not have passwords as such, **except** if an administrator user is tries to run a task as administrator.

Note that there is always one and exactly one main administrator. This user account is created during the installation process, and can be transferred later on to another administrator account.

## Dangers of an admin. account

The problem with administrators account is that they can do almost **anything** (except some very specific things like editing the system's files). They can change system settings, read and change other users' data, and even run background processes at startup. They also have all possible privileges as they can edit their own.

This is why it's extremely discouraged to have two administrator users on the same computer, unless the two accounts are used by really trustworthy persons. As such, a large warning is shown if you try to create a new administrator user.

## User Privileges Elevation (UPE)

Users can ask to perform a task with the privileges of another user, such as running a program as administrator. This uses the _User Privileges Elevation_ (UPE) system, builtin the [`sys::perm`](../specs/services/system/perm.md) service.

In such case, the program is still run as the current user, but with the privileges of both the running user and the user specified to the UPE.

Running a program with UPE requires to know either the other account's password, or to have an _authorization_ from this user. For instance, admin. users have an _authorization_ to use the Administrator account, without providing any password, although a human confirmation is required.

Each request, successful or not, is logged in the log file at `/etc/logs/auc`.

## Complexity level

Each user can define a _complexity_ level, which will affect its default settings.

A higher level of complexity will make the system display more informations, give more details about errors that may require some technical knowledge but providing additional features and informations in exchange.

The levels are:

- **Beginner**: only show basic informations, make the permission popups as simple as possible
- **Standard**: the default complexity level
- **Advanced**: shows additional informations, displays some error reports, makes the permission popups more precise and verbose
- **Power**: shows very detailed informations, displays all error reports, makes the permission popups display exhaustive informations

## Users' data encryption

See [encryption](../features/encryption.md).

## Child and supervised users

_Child users_ are users that are supervised by the [parental control](../features/parental-control.md).
_Supervised users_ are users that are part of a [domain](../features/domains.md).

## Groups

_Groups_ are a set of privileges defined by the administrator. Access to some folders or application's permissions (e.g. microphone access) can be restricted to a specific group, for instance.
When a user is created, it can be put in a group. It then automatically inherits all of the group's privileges, in addition to his own ones.
The administrator can add and remove users from groups with the control panel.

When a user is in a group, the group's privileges cannot be revoked for this user.

## User privileges

User privileges indicate the list of actions a user can perform or not. You can find more in the specifications of the [`sys::perm`](../specs/services/system/perm.md) system service.
