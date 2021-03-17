# Permissions

_Permissions_ allow users to finely control what applications can access, and administrators to finely control what other users can do.

- [How permissions work](#how-permissions-work)
- [Levels of permissions](#levels-of-permissions)
- [From the control center](#from-the-control-center)
- [Security level](#security-level)

## How permissions work

By default, an application has for only right to run code. It cannot interact with any external resource in any way (which means: no window creation, no filesystem/network access, ...).

When an app wants to get a permission, it asks [the system to give it](../specs/services/system/perm.md).

## Levels of permissions

Permissions are split across different level, some being granted automatically based on the circumstances or resulting in a popup being shown to the end user to decide if the permission should be granted or not.

You can find the levels of permissions in the [specifications document](../specs/permissions.md#levels-of-permissions).

## From the control center

Permissions can be revoked at anytime from the [control center](../applications/Central.md), allowing to revoke a specific permission for a given application, to revoke a specific permission to all applications (useful for microphone or webcam access, for example) or to revoke all permissions of a specific application.

## Security level

The permissions policy depends on the current user's _security level_, which can be set through the [control center](../applications/Central.md):

- **Basic**: grant all permissions automatically, except privacy permissions
- **Standard** (default): grant safe and implicit permissions automatically, but ask for most sensitive and all privacy permissions
- **Restricted**: only grant implicit permissions but ask for all sensitive and privacy permissions
- **Extreme**: only grant safe permissions, ask for every other type of permissions
- **Total** (only available in developer mode): ask for every permissions, including safe ones
