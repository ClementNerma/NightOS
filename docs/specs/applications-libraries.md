# Applications and libraries

This document describes the structure, features and behaviours common to both [applications](../concepts/applications.md) and [libraries](../concepts/libraries.md).

## Name and slug

Each application has a name as well as a slug. The name can any valid UTF-8 string, while the slug must respect several rules:

- Only lowercase letters, underscores and digits
- Must not start by a digit
- Must not be the name of a native shell command
- Must not be the name of a native shell function
- Must not be the name of a shell type

By default, the slug is auto-generated from the name, but it can also be customized.

## Application Identifier

From the slug is generated the _Application's IDentifier_ (AID), which is prefixed by the developer's identifier (DID) specified in the application's manifest (it must match the publisher's identifier on the store), and followed by two double points. The DID is submitted to the same rules as the application's slug.

For instance, an application with a slug of `utils` made by a developer whose DID is `superdev` will get an AID of `utils::superdev`.

The AID is unique across the store as well as in a single NightOS installation. As malicious application may provide the DID and the slug of a legit application (which is called _AID spoofing_), sideloading is [verified by default](../concepts/applications.md#sideloading).

As AID are text-based and can be quite long (up to 512 bytes), programs can instead use the _Application's Numeric IDentifier_ (ANID), which is a 32-bit unique number randomly generated by the system to refer to this particular application. On two different systems, the ANID of a given application will likely be very different, and so cannot be guessed. It is provided by the system during the application's launch through its [execution context](applications.md#execution-context).

System applications are registered under the reserved `sys` DID.

## Features

Applications as well as libraries can also declare _features_, which are opt-in parts of the program. They are described in [the manifest](#the-manifest) and can be enabled or disabled when installing the program.

Each feature allows to embed additional assets and declare additional supported languages (e.g. language packs), and a specific build option is provided to the build tool to indicate at build time weither a feature is selected or not.

This allows to save space and build time when a specific feature isn't required, but should still be embedded in the program itself instead of making an additional application or library.

When the manifest declares one or more feature(s), it must also specify a set of _default features_ to enable, which are selected by default.

## Extensions

Applications and libraries can have _extensions_, which are additional content that may or may not be downloaded and installed alongside the original application/library.

If we take the example of a file browser, an extension could be an image previewer with support for many image formats, which would be unreasonable to put in the original application given most people won't use it. In a media player, it could be a set of additional codecs.

Extensions can contain executable code, but they must be run from within the original application/library only. They do not appear in the list of installed applications visible to the end user, and are instead located in a sub-menu for the application/library they belong to.

For apps and libs downloaded from the [Store](../applications/Stellar.md), extensions can be downloaded from within the original content by calling a dedicated API.

## Translations

Applications' and libraries' name, description, content, etc. can be translated using _translation files_. The content itself can be handled in any other manner, e.g. using a translation framework, but the metadata must use a translation file so the system does not have to run code in order to perform the translation.

## The manifest

A _manifest_ is a file describing the application or library. It is mandatory to build and distribute it. Its content differ for applications and libraries, but there are common fields (`REQ`: required, `OPT`: optional):

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
  # [REQ] Program
  program:
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

  # [OPT] Assets
  assets:
    # Set of path to assets
    - ./assets/

# [REQ] Application's dependencies
dependencies:
  # [REQ] Required libaries
  libraries:
    sysver: ^1.0.0 # Any stable version

  # [OPT] Required fonts
  fonts:
    fonts:open-sans: true # Any version

# [OPT] Features
features:
  # Describe each feature, by name
  testing:
    # [OPT] Additional assets
    assets: []

    # [OPT] Feature's dependencies
    dependencies: {}

    # [OPT] Required extensions
    extensions: {}

    # [OPT] Additional languages (e.g. language pack)
    languages: []

# [OPT] Extensions
extensions:
  # Describe each extension, by name
  test:
    # [REQ] Display name
    name: Test
    
    # [REQ] Description
    description: A test extension
```
