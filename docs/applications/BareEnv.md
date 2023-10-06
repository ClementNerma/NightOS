# BareEnv

_BareEnv_, for _bare environment_, is text-based [desktop environment](../ux/desktop-environment.md) meant for servers as well as fallback when no graphical output is available or when the primary desktop environment does not work for any reason.

Graphical features are disabled, and any direct application launch will fail ; they can only be launched through commands, to reduce the risk of crash due to the creation of graphical backends failing.

Tracking devices such as mouses are still supported and can be used in compatible command-line applications.

The application itself allows to manage the environment's settings, as well as to optionally change the behaviour of specific devices and system features to be more adapted for text-based usage.

Note that this environment is not meant for general use ; it's mainly aimed for troubleshooting when graphics are failing.