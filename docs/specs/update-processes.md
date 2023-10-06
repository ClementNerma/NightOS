# Update processes

This document describes how updates are performed.

## System updates

The system selects an update source, which is one of:

* The official servers (default)
* An alternative server (configured by the user)
* A local update repository package

The source is authenticated, then the latest updates (not yet present on the system) are pulled from it as update package files (`.nsu`).

If multiple updates must be installed, they are installed one after the other. This will probably change in the future when an incremental update system is designed.

### System update packages

Each package file is a simple TAR + GZ archive with the following structure:

* `/metadata`: contains metadata on the updates
* `/update`: "up-down" update program
* `/assets`: a directory containing various files (can be anything)

### Update steps

1. The update package is extracted in a temporary path
2. Update metadata are checked
3. The system checks the currently used [slot](boot-process.md)
4. The active slot (= all files currently in `/sys`) is copied to the other slot
5. An incremental system backup is created, containing all data from active slot (`/sys`) as well as the `/etc/sys` directory is created
6. A non-incremental (full) system backup is created
7. A Btrfs snapshot of the main partition is created
8. The "up-down" update program is run
9. In case of success, the active slot number is inverted
10. System reboots
11. After a week or two more reboots (whichever happens last), the main partition snapshot as well as the non-incremental system backup are deleted

This allows the following:

* If the new BOOT2 does not work, we can revert it instantly until the next update ;
* If some modifications created problems, we can roll them back using the main partition snapshot ;
* If some problems appear later on, the boot snapshot allows to entirely rollback both `/sys` and `/etc/sys`

Incremental system snapshots are kept indefinitely in order to allow an easy rollback. A timestamp, system version and update number are associated, in order to quickly determine the state it was in.

### Up-down update program

An up-down update program is a program that can either install or uninstall an update.

It is provided an history of all system updates as well as a snapshot of the BOOT2 partition at each point in time.

## Application updates

An application update can happen in either scenario:

* The system checked for updates in the Store (official or custom) and found one ;
* The application asked the system to check for update and it found one ;
* A custom application update package (`.nua`) was provided

The update package file is then checked. It is a simple TAR + GZ archive containing the following:

* `metadata`: contains update metadata
* `files`: a directory containing all files to replace in the application

Note that an update can only apply to a specific version of the application, specified in the metadata. Otherwise, previous updates must be installed first.

If valid, the system asks the user to close the application if it is opened.

After the application is fully closed (including services), its files are replaced with the ones provided in the archive's `files` directory.

The application is then started with its new state.
