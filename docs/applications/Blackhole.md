# Blackhole

Blackhole is the default archive manager of NightOS.

It relies on [Locky](Locky.md) for encrypted archives, filesystems and files.

## Features

Blackhole can open, extract and create [different formats](#supported-formats). It supports compression as well as encryption.

## Supported formats

* 7-Zip archives (`.7z`)
* BZip(2) archives (`.bz`, `.bz2`)
* GZip archives (`.gz`)
* ISO images (`.iso`)
* LZMA(2) archives (`.lz`, `.xz`)
* Unix compressed archives (`.z`)
* TAR archives (`.tar`)

Are also supported all the archive formats specific to NightOS:

* [Virtual storage files](../technical/file-formats.md#virtual-storages) (`.vsf`, `.vad`)
* [NightOS application file](../technical/file-formats.md#application-packages) (`.nap`, `.nva`)
* [NightOS system updates](../technical/file-formats.md#system-updates) (`.nsu`)
