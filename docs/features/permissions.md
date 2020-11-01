# Permissions

_Permissions_ allow users to finely control what applications can access, and administrators to finely control what other users can do.

- [How permissions work](#how-permissions-work)
- [Permission levels](#permission-levels)
- [From the control center](#from-the-control-center)
- [Security level](#security-level)

## How permissions work

By default, an application has for only right to run code. It cannot interact with any external resource in any way (which means: no window creation, no filesystem/network access, ...).

When an app wants to get a permission, it asks [the system to give it](../specs/services/perm.md).

## Permission levels

Permissions are split across different categories:

- _Safe_: basic permissions, like windows creation, which are granted automatically by default ;
- _Implicit_: permissions implied by the usage of an application, like opening a file with an application grants it an access while the application is running ;
- _Interactive_: modifying non-critical parts of the state of the system, like controlling the global volume or reading
- _Sensitive_: accessing sensitive informations, like filesystem or network access ;
- _Privacy_: accessing privacy-related data, like microphone or webcam access

There are also [domain-controlled permissions](domains.md) as well as [application proxies](../technical/dev-mode.md#application-proxies)) which influence how permissions are granted.

When using visual applications, requesting interactive, sensitive and privacy permissions will show a popup asking the user if they want to grant the permission:

- Only one time
- For the active application (until it stops)
- For the current session (until the user logs out or the system is shutdown)
- Forever

By default, it is set to "forever". But for the privacy level, this choice is set by default to "forever while the application is active", which prevents the application from accessing them from background tasks.

_NOTE:_ If the application is uninstalled and re-installed later, all the granted permissions will have been dropped, so confirmation will be required again.

_NOTE:_ Permissions granted to volatile applications are saved using the application's hash, so while the exact same application is opened volatilely, permissions are kept in memory.

_NOTE:_ Permissions are specific to the current user (the AUC is not taken in account here), so in the case of a global application, each user will have to approve the permission manually (unless the administrator set it otherwise).

## From the control center

Permissions can be revoked at anytime from the [control center](../applications/Central.md), allowing to revoke a specific permission for a given application, to revoke a specific permission to all applications (useful for microphone or webcam access, for example) or to revoke all permissions of a specific application.

## Security level

The permissions policy depends on the current user's _security level_, which can be set through the [control center](../applications/Central.md):

- **Basic**: grant all permissions automatically, except privacy permissions
- **Standard** (default): grant safe and implicit permissions automatically, but ask for most sensitive and all privacy permissions
- **Restricted**: only grant implicit permissions but ask for all sensitive and privacy permissions
- **Extreme**: only grant safe permissions, ask for every other type of permissions
- **Total** (only available in developer mode): ask for every permissions, including safe ones
