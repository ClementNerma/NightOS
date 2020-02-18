# Integrity checker

## System immutability

The `/sys` directory is immutable, which means it cannot be modified, even by the main administrator. The only process where this directory may be affected is during a repair process or during an update, which are both processes that are handled by the system directly.

## Hashes computing

When critical files are written, in `/sys` or `/etc/sys`, their hash is computed using the SHA-384 algorithm and stored in the system's _hash registry_ (`/etc/sys/hashes` file).

## Checking hashes at startup

When any of these files is read from the disk, their content is computed and compared to the hash registry. If the hashes don't match, the file is considered as corrupted. The consequences depend on the location of the file:

* *System* (`/sys`): the system will check its backup integrity and then restore itself from the backup ;
* *System backup* (`/sys/backup`): the system will check `/sys` integrity and then make a new backup of itself ;
* *System + system backup*: the system won't boot and indicate it must be reinstalled (documents won't be lost if they aren't corrupted)
  It's possible to force the boot process, but a large warning will indicate it may cause crashes or even introduce security issues ;
* *Hash registry* (`/etc/sys/hashes`): same thing ;
* *Registry* (`/etc/sys/registry`): same thing ;
* *Crash save*: the crash save won't be restored (can be forced but with a large warning) ;
* *Sandbox*: system will refuse to start the sandbox (can be forced but with a large warning) ;

**IMPORTANT:** If some malicious person edits the system files **and** its backup, it can also edit the hash registry, so the error won't show up. So that's not because there is no error the system is safe and has not been modified!
