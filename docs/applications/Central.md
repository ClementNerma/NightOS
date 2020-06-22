# Central

The _Central_ application delivers the _Control Center_ which allows to configure how the system behaves. It is split into three distinct categories.

```
> Current user settings
    > User Account
        > Set profile picture
        > Set nickname

    > Change security level
        | Basic
        | Standard
        | Restricted
        | Extreme
        | Total
            ! Only available in developer mode

> Applications management
    > Sideloading
        > Change sideloading mode
            | Disabled
            | Secure
            | Unsecure

> Global settings
    > Date & Time
        > Set date
        > Set time
        > Change timezone
        > Synchronize time

    > Encryption
        > Manage storage encryption
            | Enable
            | Disable

        > Change encryption password
            ! Disabled if storage is not encrypted yet

        > Manage per-user encryption
            | Enable
            | Disable

> Users
    > Create new user
    > Create new administrator user
    > Create new supervised user
```

## Development-related options

This part show settings that are only available in [developer mode](../technical/dev-mode.md).

```
> Applications
    > Set application proxies
        | Enable
        | Disable
```
