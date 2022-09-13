# Filesystem

This document presents how files are stored in NightOS.

- [Presentation](#presentation)
- [Identifiers and limitations](#identifiers-and-limitations)
  - [Filesystem unique identifier](#filesystem-unique-identifier)
  - [Element unique identifier](#element-unique-identifier)
  - [Temporary FEID](#temporary-feid)
  - [Paths' size limit](#paths-size-limit)
- [Filenames](#filenames)
- [Permissions](#permissions)
- [Symbolic links](#symbolic-links)
  - [Concept](#concept)
  - [Cyclic symlinks](#cyclic-symlinks)
- [Flows](#flows)
  - [Concept](#concept-1)
  - [Creating a flow](#creating-a-flow)
  - [Connecting to a flow](#connecting-to-a-flow)
- [Structure](#structure)
  - [Notes](#notes)

## Presentation

NightOS uses the **Btrfs** filesystem for the main storage due to its robustness, performance, and features (e.g. snapshots).

Three partitions are used to store the data:

* One **FAT32** partition for the bootloader ;
* One **FAT32** partition for the system (`/sys` and `/etc/sys`) ;
* One **Btrfs** partition for users' data (`/etc` except `/etc/sys`, `/apps` and `/home`)

## Identifiers and limitations

### Filesystem unique identifier

Each existing filesystem gets a unique identifier called the _**F**ile**s**ystem **Id**dentifier_ (FSID).

It is unique across all filesystems, and consistent across reboots.

### Element unique identifier

Each filesystem item has an 8-byte identifier, called the _**F**ilesystem **E**lement **Id**entifier_ (FEID).

It is only unique in the filesystem the item is stored in.

Note that some filesystem do not support this identifier.

### Temporary FEID

A temporary FEID can be created to grant access to a resource to an application without giving actual access to the original item itself. A temporary FEID only lives in memory, and refers an existing filesystem item. If the original item is deleted, the temporary FEID is deleted too.

### Paths' size limit

Paths' length is encoded on 2 bytes, allowing up to 65 534 characters plus the `NULL` character.

This limit exists to avoid too costly string copies on path manipulation, while being long enough for the very large majority of use cases.

## Filenames

For naming conventions, see the [related specification](services/integration/filesystem-interfaces.md#filenames).

## Permissions

Permissions on individual items is achieved through [storage permissions maps](storage-permissions-map.md).

## Symbolic links

_Symbolic links_, abbreviated _symlinks_, are files that point to another location.

### Concept

A symlink points to a specific item: file, folder, device, anything. It's just not a shortcut, though, as the symlink will still work if its target is moved.

When a symlink is accessed, the system will transparently access its target item instead.

When a symlink is removed, it does not affect the original target. Also, any number of symlinks can target the same item, and symlinks can target other symlinks to. When accessing a symlink, if its target item is a symlink itself, the latter's target will be accessed instead, and so on, until we do not encounter a symlink anymore.

This can be explicitly disabled when interacting with the filesystem, or limited to a specific number of children.

Also, symbolic links may point to a location on another storage.

### Cyclic symlinks

Given the following situation:

1. We create a symlink `A` which points to a random file
2. We create a symlink `B` which points to `A`
3. We update the target of `A` to be `B`

When we will try to access `A`, the system will access `B`, then `A`, then `B`, and so on. This is called a _cyclic symlink chain_. In such case, the chain is reduced to the minimum (for instance, if we had `C` pointing to `A`, the minimum chain would not be `C` `A` `B` but just `A` `B`), and marked as erroneous. The process that tried to access the symlink will receive a specific error code to indicate a cyclic symlink chain was encountered.

## Flows

_Flows_ are a simple and efficient way for processes (mostly [services](services.md)) to allow treating flows of data.

### Concept

A flow is a file without extension, located in the `/fl` directory, that can either send data to reader processes (_read-only_) or receive data from writer processes (_write-only_).

To understand the concept better, here is the list of native flow files that are always available:

| Flow file    | Type       | Description                                                                                       |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------- |
| `/fl/zero`   | Read-only  | Outputs zeroes all the time ; useful to zero a file or device or to benchmark a storage           |
| `/fl/rand`   | Read-only  | Outputs cryptographically-secure random numbers. Useful to randomly fill a storage or memory area |
| `/fl/ucrand` | Read-only  | Outputs non-cryptographically-secure random numbers, thus faster that `/fl/rand`                  |
| `/fl/null`   | Write-only | Receives data but does nothing with them                                                          |

Processes are based on [pipes](kernel/ipc.md).

### Creating a flow

When a process wants to create a flow, it follows the following procedure:

1. The process asks the [`sys::flow`](services/system/flow.md) service to create a flow
2. The service creates the related flow file in `/fl`
3. When a process reads from the (readable) flow file, all data is continuely retrieved from the creator's SC (until the flow is closed)
4. When a process writes to the (writable) flow file, all data is continuely written to the creator's RC (the flow is not closed after that though)
5. When the creator closes its SC/RC, the IPC channels duo is closed and the flow file is removed

### Connecting to a flow

When a process wants to read from or write to a file, it first asks the [`sys::flow`](services/system/flow.md) service to connect to this file. If accepted, it receives a [SC or RC](kernel/ipc.md#pipes) to interact with the flow.

## Structure

Below is the file tree indicating how elements are organized in NightOS.

_NOTE:_ `<F>` indicates the item is a file.

```
/
├── app                            Interactables available to all users
│   └── <appname>                  An application's folder (NOTE: one sub-folder per version for libraries)
│       ├── content                Application's program (executables, static resources, ...)
│       ├── crashsaves             Application's crash saves
│       ├── data                   Application's data (e.g. database)
│       ├── packages               Application's packages (original package + update packages)
│       └── sandboxes              Application's sandboxes
├── dev                            Connected devices
│   ├── cam                        Cameras
│   ├── bst                        Basic storage devices (SD cards, USB keys, ...)
│   ├── etc                        Uncategorized devices
│   ├── mic                        Microphones
│   ├── net                        Network adapters (Ethernet adapter, WiFi card, ...)
│   ├── snd                        Sound-related output devices (Sound card, DAC, ...)
│   ├── sst                        Sensitive storage devices (Hard drives, SSDs, ...)
│   └── wrl                        Other supported wireless devices (Bluetooth adapter, ...)
├── etc                            Mutable data folder
│   ├── env   <F>                  Environment variables
│   ├── hosts <F>                  Hosts overriding (e.g. 'localhost')
│   ├── lock                       Opened lock files
│   ├── logs                       Log files
│   |   └── upe                    History of UPE requests (1)
│   ├── public                     Public data, readable and writable by everyone
│   └── sys                        System's mutable data - available to system only
│       ├── registry               System's registry
│       ├── awake    <F>           System's shutdown indicator to detect if there was an error during last shutdown
│       ├── hashes   <F>           Critical files' hashes for the integrity checker (2)
│       ├── gbpwd    <F>           Global storage's encryption key (3)
│       └── users    <F>           User profiles and groups
├── fl                             Flow files
├── home                           Users' data
│   └── <user>                     A specific user's data
│       ├── apps                   User's applications (same structure as for `/apps`)
│       ├── appdata                User's applications persistent data (not removed when the application is uninstalled)
│       ├── desktop                User's files appearing on the desktop
│       ├── documents              User's documents
│       ├── downloads              User's downloads
│       ├── music                  User's music files
│       ├── pictures               User's pictures
│       ├── videos                 User's videos
│       └── trash                  User's trash
├── mnt                            Mounted storages
│   └── root                       Soft link to `/`
├── sys                            System - immutable outside of installation, repair processes and updates
│   ├── apps                       System applications
│   ├── boot                       System's boot program
│   ├── langs                      Translation files
│   ├── old                        Old versions of the system, used during the repair process (compressed archives)
│   ├── backup                     Copy of the last system version (compressed archive)
│   ├── kernel                     Custom micro-kernel
│   └── valid   <F>                A file that just contains "ValidMasterKey" to test if the provided master key is valid at startup
├── tmp                            Temporary folder (cleaned during shutdown)
│   └── <user>                     Temporary folder for a specific user
```

Links:

- (1) [UPE requests](../concepts/users.md#user-privileges-elevation-upe)
- (2) The [integrity checker](../technical/integrity-checker.md)
- (3) Global storage's [encryption key](../features/encryption.md#global-encryption)

### Notes

Globally installed applications (located in `/apps`) can store user-specific data in `/home/[user]/appdata/[appname]`, which will only be made of the `data`, `crashsaves` and `sandboxes` folder.