# Blackhole

Blackhole is the default archive manager of NightOS.

It relies on [Locky](Locky.md) for encrypted archives, filesystems and files.

## Features

Blackhole can open, extract and create [different formats](#supported-formats). It supports compression as well as encryption.

## Supported containers

* 7-Zip archives (`.7z`)
* ISO images (`.iso`)
* TAR archives (`.tar`)
* ZIP archives (`.zip`)

Are also supported all the archive formats specific to NightOS:

* [Virtual storage files](../technical/file-formats.md#virtual-storages) (`.vsf`, `.vad`)
* [NightOS application file](../technical/file-formats.md#application-packages) (`.nap`, `.nva`)
* [NightOS system updates](../technical/file-formats.md#system-updates) (`.nsu`)
* [NightOS application updates](../technical/file-formats.md#system-updates) (`.nau`)

## Supported compression formats

* BZip(2) (`.bz`, `.bz2`)
* LZMA(2) (`.lz`, `.xz`)
* Unix (`.z`)
* GZip (`.gz`)
* ZStandard (`.zstd`)
