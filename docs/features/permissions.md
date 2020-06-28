# Permissions

_Permissions_ allow users to finely control what applications can access, and administrators to finely control what other users can do.

## How permissions work

By default, an application has for only right to run code. It cannot interact with any external resource in any way (which means: no window creation, no filesystem/network access, ...).

When an app wants to get a permission, it asks [the system to give it](../specs/services/grid.md).

Permissions are split across different _types_:

- _Safe permissions_, like windows creation, are granted automatically by default ;
- _Implicit permissions_, like reading filesystem opened by the application, are also granted automatically by default ;
- _Interactive permissions_, like controlling the global volume, trigger a confirmation overlay visible by the user ;
- _Sensitive permissions_, like filesystem or network access, trigger a confirmation overlay visible by the user ;
- _Privacy permissions_, like microphone or webcam access, add an emphasized confirmation message to the same overlay ;

An exception to the above cases is for special rules permission rules (e.g. [application proxies](../technical/dev-mode.md#application-proxies)).

A dropdown allows to set the grant duration (e.g: once, for the one minute, for the current instance, for the current session, forever while the application is active, forever).
By default, it is set to "forever". But for important permissions like microphone access, this choice is set by default to "forever while the application is active", which prevents the application from accessing them from background tasks.

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
