# Application Manifest

Here is an example of an application manifest (`REQ`: required, `OPT`: optional):

```yaml
# [REQ] Informations about the application
infos:
  # [REQ] Application's name, as shown when installing it
  name: Cloud Notepad App
  # [REQ] Application's slug, as stored on the disk in the /apps directory
  slug: cloud-notepad-app
  # [REQ] Application's description, as shown when installing it
  description: A notepad application that allows syncing your files in the cloud
  # [REQ] Application's version, following semantic versioning
  version: 1.0.0
  # [REQ] Application's authors
  authors:
    - name: Clément Nerma
      email: clement.nerma@gmail.com
  # [REQ] Application's icons (in the archive)
  # [REQ] "%{}": either 16, 32, 64, 128 or 256 pixels (icons must be square)
  icon: assets/icons/app/%{}.png
  # [REQ] Application's license (must be in a list of available licenses)
  license: Apache-2.0

# [REQ] Application package's content
content:
  # Packages can either contain source code only, pre-compiled programs only, or both
  # <for source packages> [REQ]
  source:
    # [REQ] Build tool (must in the list of the toolchain's supported build tools)
    toolchain: rust
    # [REQ] Required build tool-related options
    build: {}
    # [OPT] Build tool-related options
    options:
      optimize: O3

  # <for precomp packages> [REQ]
  precomp: main.npp

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

# [OPT] Does the application expose a service?
service: false

# [OPT] Additional informations
additional:
  # [OPT] Available languages (in a list of existing languages)
  languages: ["en-US"]

# [REQ] Application's dependencies
dependencies:
  # [REQ] Required libaries
  libraries:
    sysver: ^1.0.0 # Any stable version

  # [OPT] Required fonts
  fonts:
    fonts:open-sans: true # Any version
```

For more informations about exposed commands, see the [related document](commands.md).
