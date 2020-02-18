# Application packages

Application packages are files that have either the `.nap` (NightOS Application Package) or `.nva` (NightOS Volatile Application).

## Content

NAP and NVA files are ZStandard archives which only requirement is to contain, at the archive's root, a `manifest.toml` file describing the archive itself, a `hash.md5` ensuring the archive has not been corrupted.

## Manifest

Here is an example of a manifest (`REQ`: required, `OPT`: optional):

```yaml
# [REQ] Informations about the application
infos:
    # [REQ] Application's name, as stored on the disk in the /apps directory
    name: cloud-notepad-app
    # [REQ] Application's title, as shown when installing it
    title: Cloud Notepad App
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
        # [REQ] Main source files
        files:
            # [REQ] Application's entrypoint
            entrypoint: src/main.rs
            # [REQ] Application's command-line entrypoint
            command: src/command.rs
            # [OPT] Application's installer
            installer: src/installer.rs
            # [OPT] Application's updater (ran before and after an update with specific command-line parameters)
            updater: src/updater.rs
            # [OPT] Application's uninstaller
            uninstaller: src/uninstaller.rs
        # [REQ] Build informations
        build:
            # [REQ] Build tool (must in the list of the toolchain's supported build tools)
            tool: rust
            # [OPT] Build tool-related options
            options:
              optimize: O3

    # <for precomp packages> [REQ]
    precomp:
        # [REQ] Application's entrypoint
        entrypoint: precomp/main.npp
        # [REQ] Application's command-line entrypoint
        command: precomp/command.npp
        # [OPT] Application's installer
        installer: precomp/installer.npp
        # [OPT] Application's updater (ran before and after an update with specific command-line parameters)
        updater: precomp/updater.npp
        # [OPT] Application's uninstaller
        uninstaller: precomp/uninstaller.npp

# [OPT] Global commands
commands:
    # These commands are command-line flags provided to the application's command-line entrypoint
    command1: arg # Equivalent to: "launch cloud-notepad-app -- arg"

# [OPT] Additional informations
additional:
    # [OPT] Available languages (in a list of existing languages)
    languages: [ "en-US" ]

# [REQ] Application's dependencies
dependencies:
  # [REQ] Required libaries
  libraries:
    sysver: ^1.0.0 # Any stable version

  # [OPT] Required fonts
  fonts:
    fonts:open-sans: true # Any version
```

## Pre-compiled applications

By default, and if possible, the system will always try to install [pre-compiled programs](../pre-compiling.md) from applications' package. If the pre-compiled programs are not available, it will be built from source code - which takes a lot more time.
