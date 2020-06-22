# File Formats

This document presents the file formats natively handled by NightOS. Some files are only handled by optional first-party applications that may not be installed on the computer, so some formats may not be supported in specific installs where such applications have been removed/were never installed.

## Common formats

Common file formats are natively handled:

- Text files (`.txt`, `.md`, ...) with [Gravity](../applications/Gravity.md)
- Audio files (`.mp3`, `.flac`, ...) with [Sonata](../applications/Sonata.md)
- Image files (`.png`, `.jpg`, ...) with [ShootingStar](../applications/ShootingStar.md)
- Video files (`.mp4`, `.mkv`, ...) with [Milkshake](../applications/Milkshake.md)
- Archive files (`.zip`, `.tar`, ...) with [Blackhole](../applications/Blackhole.md)
- E-book files (`.cbz`, `.cbr`, ...) with [Reader](../applications/Reader.md)
- E-mail files (`.eml`, `.vcf`, ...) with [Postal](../applications/Postal.md)
- Web files (`.html`, ...) with [Rocket](../applications/Rocket.md)
- Virtual storage files (`.iso`, `.vfd`, ...) with [Locky](../applications/Locky.md)

## Virtual storages

Virtual storages are files that contain one or several virtual filesystems. Different filesystems can be put in, but all must be supported natively by NightOS in order to properly work without needing to install any additional application.

The filesystems can be encrypted individually. The whole storage can also be encrypted.

They have multiple purposes: store encrypted files, virtual filesystems for sandboxed applications, etc.

Virtual storage files have the `.vts` extension and are opened using [Locky](../applications/Locky.md).

## Application packages

Applications can be installed from standalone files called [application packages](../specs/applications/package.md).
Installable applications have the `.nap` (NightOS Application Package) extension, while volatile applications have the `.nva` (NightOS Volatile Application) one.

They are opened using [Skyer](../applications/Skyer.md).

## System updates

The system is intended to be updated through the update section in the settings, but sometimes it may be required to install updates offline for specific reasons (e.g. no network connection available at the moment). In such case, it is possible to download incremental updates as system update files.

They may contain one or several updates, and are only installable on a very specific version of the system, to avoid missing some other incremental updates.

System update files have the `.nsu` (NightOS System Update) extension and are opened using the [control center](../applications/Central.md).
