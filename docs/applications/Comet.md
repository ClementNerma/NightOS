# Comet

Comet is the default file manager of NightOS. It embeds the `sys::comet` library.

## Compatible filesystems

Comet can open and manage all filesystems natively supported by NightOS, meaning it also supports custom filesystems handled by the [`sys::fs`](../specs/services/fs.md) service as well as remote drives such as SSH and SFTP storages.

Third-party application can also provide support for additional storage types (e.g. cloud).

## Usage

Comet is meant to be used with both a keyboard and a tracking device, but it's also possible to use only the former or the latter.

## Features

- Listing
- Creation and deletion of items
- Copy and paste for all types of items
- Handles parallel operations (with queue management, pause/resume, priorization, forced throttling, ...)
- Encryption and deletion for files, folders and drives
- Items caching for remote drives
- Drag & drop from and to other applications
- Customizable interface
- Tabs
- Real-time refresh
