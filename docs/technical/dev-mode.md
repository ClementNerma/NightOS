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
