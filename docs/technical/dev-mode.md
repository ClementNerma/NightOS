# Developer mode

The _developer mode_ enables several features that are not available to default users. Only administrator users get access to them when they are enabled.

## How to enable

Developer mode can be enabled either by typing the following command in the terminal:

```shell script
asadmin system enable-dev-mode
```

Or, while holding the `Ctrl` `Alt` and `Maj` key, type `DEV` (three letters).

A warning dialog will appear.
If you confirm, it will display an [AUC](../concepts/users.md#alternative-user-control-auc) for the administrator account.
Then a final confirmation dialog will ensure you're sure about what you're doing. Then development mode will be enabled (no reboot is required).

## Features

* Additional features will appear in the control center ([see the options](../applications/central.md#development-related-options))
* The registry can be [imported and exported](../registry.md#debugging)

## Application proxies

_Application proxies_ are applications that intercept all applications calls to the system on-the-fly. It is useful for applications debugging.

When a proxy is set up for an application, all system calls sent to this application will be transferred to the proxy, which will be able to do whatever it wants with it. It's possible for the proxy to never answer the signal, to change its content before actually sending it to the system, etc.

Basic usage of an application proxy is as a "listener": it only listens to specific signals and logs them, without cancelling them and/or modifying them. This is useful to check all filesystem access requested by an application, in real time.