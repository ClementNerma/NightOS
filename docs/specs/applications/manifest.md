# Application Manifest

Here is the specifications of the application manifest, in additional to the [common manifest](../applications-libraries.md#the-manifest):

```yaml
# [OPT] Event triggers
events:
  # [OPT] Should the application start just after being installed?
  postinstall: false
  # [OPT] Should the application start just before being uninstalled?
  preuninstall: false
  # [OPT] Should the application start just before being updated?
  preupdate: false
  # [OPT] Should the application start just after being updated?
  postupdate: false

# [OPT] Exposed commands (see the related document for additional informations)
commands: {}

# [OPT] Does the application expose services?
services:
  # [REQ] Does the application expose a main service?
  main: false
  # [REQ] List of scoped services
  scoped: []
  # [REQ] List of integration services
  integration:
    # [OPT] Desktop environment service
    desktop_env: false
    # [OPT] File manager service
    file_manager: false
    # [OPT] Filesystem opener service
    filesystem_opener: false

# [OPT] Additional informations
additional:
  # [OPT] Available languages (in a list of existing languages)
  languages: ["en-US"]
```

For more informations about exposed commands, see the [related document](commands.md).
