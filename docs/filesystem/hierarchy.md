# Filesystem hierarchy

## Hierarchy

_NOTE:_ `(F)` indicates the item is a file.

/
├── app                            Interactables available to all users
│   └── <appname>                  An application's folder (NOTE: one sub-folder per version for libraries)
│       ├── content                Application's program (executables, static resources, ...)
│       ├── crashsaves             Application's crash saves
│       ├── data                   Application's data (e.g. database)
│       ├── packages               Application's packages (original package + update packages)
│       └── sandboxes              Application's sandboxes
├── etc                            Mutable data folder
│   ├── env <F>                    Environment variables
│   ├── flow                       Opened flows
│   ├── hosts <F>                  Hosts overriding (e.g. 'localhost')
│   ├── lock                       Opened lock files
│   ├── log                        Log files
│   ├── public                     Public data, readable and writable by everyone
│   └── sys                        System's mutable data - available to system only
│       ├── registry               System's registry
│       ├── awake (F)              System's shutdown indicator to detect if there was an error during last shutdown
│       ├── hashes (F)             Critical files' hashes for the [integrity checker](../technical/integrity-checker.md)
│       ├── gbpwd (F)              Global storage [encryption key](../features/encryption.md#global-encryption)
│       └── users (F)              User profiles and groups
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
├── media                          Mounted storages
│   └── root                       Soft link to `/`
├── sys                            System - immutable outside of installation, repair processes and updates
│   ├── apps                       System applications
│   ├── boot                       System's boot program
│   ├── langs                      Translation files
│   ├── old                        Old versions of the system, used during the repair process (compressed archives)
│   ├── backup                     Copy of the last system version (compressed archive)
│   ├── kernel                     Custom micro-kernel
│   └── valid (F)                  A file that just contains "ValidMasterKey" to test if the provided master key is valid at startup
├── tmp                            Temporary folder (cleaned during shutdown)
│   └── <user>                     Temporary folder for a specific user

## Notes

Globally installed applications (located in `/apps`) can store user-specific data in `/home/[user]/appdata/[appname]`, which will only be made of the `data`, `crashsaves` and `sandboxes` folder.
