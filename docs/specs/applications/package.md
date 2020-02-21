# Application packages

Application packages are files that have either the `.nap` (NightOS Application Package) or `.nva` (NightOS Volatile Application).

## Content

NAP and NVA files are ZStandard archives which only requirement is to contain, at the archive's root, a `manifest.toml` file describing the archive itself, a `hash.md5` ensuring the archive has not been corrupted.

## Manifest

The manifest format can be found in the related [specifications document](manifest.md).

## Arguments

The arguments structure can be found in the related [specifications document](arguments.md).

## Pre-compiled applications

By default, and if possible, the system will always try to install [pre-compiled programs](../pre-compiling.md) from applications' package. If the pre-compiled programs are not available, it will be built from source code - which takes a lot more time.
