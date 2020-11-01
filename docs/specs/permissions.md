# Permissions

Permissions are used to [control what applications can do or not](../features/permissions.md).

## Levels of permissions

Permissions are split across different categories:

- _Basic_ (B): basic permissions, like windows creation, which are granted automatically by default ;
- _Implicit_ (I): permissions implied by the usage of an application, like opening a file with an application grants it an access while the application is running ;
- _Global_ (G): modifying non-critical parts of the state of the system, like controlling the global volume or reading
- _Sensitive_ (S): accessing sensitive informations, like filesystem or network access ;
- _Privacy_ (P): accessing privacy-related data, like microphone or webcam access

There are also [domain-controlled permissions](../features/domains.md) as well as [application proxies](../technical/dev-mode.md#application-proxies)) which influence how permissions are granted.

When using visual applications, requesting interactive, sensitive and privacy permissions will show a popup asking the user if they want to grant the permission:

- Only one time
- For the active application (until it stops)
- For the current session (until the user logs out or the system is shutdown)
- Forever

By default, it is set to "forever". But for the privacy level, this choice is set by default to "forever while the application is active", which prevents the application from accessing them from background tasks.

_NOTE:_ If the application is uninstalled and re-installed later, all the granted permissions will have been dropped, so confirmation will be required again.

_NOTE:_ Permissions granted to volatile applications are saved using the application's hash, so while the exact same application is opened volatilely, permissions are kept in memory.

_NOTE:_ Permissions are specific to the current user (the AUC is not taken in account here), so in the case of a global application, each user will have to approve the permission manually (unless the administrator set it otherwise).