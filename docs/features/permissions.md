# Permissions

_Permissions_ allow users to finely control what applications can access, and administrators to finely control what other users can do.

## How permissions work

By default, an application has for only right to run code. It cannot interact with any external resource in any way (which means: no window creation, no filesystem/network access, ...).

When an app wants to get a permission, it asks [the system to give it](../specs/services.md#sysgrid).

* For nearly risk-free permissions, like windows creation, the permission is granted automatically ;
* For implicit permissions, like reading filesystem opened by the application, the permission is also granted automatically ;
* For data-related permissions, like filesystem or network access, a confirmation overlay is simply shown to the user ;
* For important permissions, like microphone or webcam access, an emphasized confirmation message is added to the overlay ;
* For external user permissions, like editing the registry (Admin only), the _Alternative User Control_ (AUC) dialog is shown.

An exception to the above cases is for special rules permission rules (e.g. [application proxies](../technical/dev-mode.md#application-proxies)).

A dropdown allows to set the grant duration (e.g: once, for the one minute, for the current instance, for the current session, forever while the application is active, forever).
By default, it is set to "forever". But for important permissions like microphone access, this choice is set by default to "forever while the application is active", which prevents the application from accessing them from background tasks.

_NOTE:_ If the application is uninstalled and re-installed later, all the granted permissions will have been dropped, so confirmation will be required again.

_NOTE:_ Permissions granted to volatile applications are saved using the application's hash, so while the exact same application is opened volatilely, permissions are kept in memory.

_NOTE:_ Permissions are specific to the current user (the AUC is not taken in account here), so in the case of a global application, each user will have to approve the permission manually (unless the administrator set it otherwise).

## From the control center

Permissions can be revoked at anytime from the control center, allowing to revoke a specific permission for a given application, to revoke a specific permission to all applications (useful for microphone or webcam access, for example) or to revoke all permissions of a specific application.
