# Application packages

Application packages are files that have either the `.nap` (NightOS Application Package) or `.nva` (NightOS Volatile Application).

- [Content](#content)
- [Manifest](#manifest)
- [Pre-compiled applications](#pre-compiled-applications)
- [Libraries embedding](#libraries-embedding)

## Content

NAP and NVA files are ZStandard archives which only requirement is to contain, at the archive's root, a `manifest.toml` file describing the archive itself, a `hash.md5` ensuring the archive has not been corrupted.

## Manifest

The manifest format can be found in the related [specifications document](manifest.md).

## Pre-compiled applications

By default, and if possible, the system will always try to install [pre-compiled programs](../../technical/pre-compiling.md) from applications' package. If the pre-compiled programs are not available, it will be built from source code - which takes a lot more time.

## Libraries embedding

Although it's a better practice to split applications and libraries into different packages, sometimes it's more easy to embed both in the same package, especially in two cases:

- When the application is just a thin layer ahead of the library (e.g. CLI tool)
- When the library's API changes rapidly and the application relies on it

For such scenarios, it's possible for an application package to embed one or more libraries, and publish them all at once.

The application's and libraries' version may differ if required.

If an another application or a library specifies one of the embedded libraries as a dependency, only the said library will be installed, not the application.