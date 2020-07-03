# Libraries

Libraries are NightOS' way to share code between multiple applications.

## Manifest

As libaries are only meant to share code, there manifest is a lot simplier than [applications' manifest](applications/manifest.md).

```yaml
# [REQ] Informations about the library
infos:
  # [REQ] Library's slug, as stored on the disk in the /apps directory
  slug: sound-synth
  # [OPT] Library's title, as shown when installing it
  name: Sound Synthesizer
  # [REQ] Library's description, as shown when installing it
  description: A small library to synthesize sound through virtual instruments
  # [REQ] Library's license (must be in a list of available licenses)
  license: Apache-2.0
  # [REQ] Library's version, following semantic versioning
  version: 1.0.0
  # [REQ] Library's authors
  authors:
    - name: Clément Nerma
      email: clement.nerma@gmail.com
  # [OPT] Library's icons (in the archive)
  # [OPT] "%{}": either 16, 32, 64, 128 or 256 pixels (icons must be square)
  icon: assets/icons/app/%{}.png

# [REQ] Library package's content
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
  precomp: main.nsl

# [REQ] Library dependencies
dependencies:
  sysver: ^1.0.0 # Any stable version
```
