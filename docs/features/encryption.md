# Encryption

Encryption allows to prevent unauthorized access to a data with a password.

## Global encryption

By default, the whole storage can be encrypted using the computer's master password, which is prompted on startup.

During installation, even if this feature is turned off by the user, a random encryption key is generated in the bootloader, which can be accessed through the `/etc/sys/gbpwd` file. This key will be used to encrypt the storage when global encryption is active.
This process allows administrators to change the master password whenever they want to.

When global encryption is turned on, the administrator must choose an encryption password it will communicate to each user. The system will not be able to start without this password.

On startup, the system will run a _bootloader_ which is not encrypted (and thus vulnerable to attacks) which asks for the master password. This master password is then used to decrypt the master key in the bootloader. Then, the `/sys/valid` file is decrypted, and its content is compared to `ValidMasterKey`. If contents are equal, the provided master password is valid and the boot process starts normally. Else, the key is not the good one and the user is prompted a new one.

The point of global encryption is that external persons cannot read the storage's data by just reading the storage ; they must either know the master key or put a malicious bootloader to spy on the user.

**NOTE:** The ability to encrypt the storage globally, change the master password or decrypt the storage is by default reserved to the main administrator, but this privilege can be given to normal administrators, though this is highly discouraged.

## Per-user encryption

But any non-guest user can also use a built-in system tool to encrypt its data using its own password. This way, the user's data become unreadable without his password, making even administrators unable to read his data.

The encryption/decryption key is generated automatically when the user account is created and stored in the user's profile data (in `/etc/sys/users`).

When enabled, the encrypted directories are:

* The homedir at `/home/[username]`
* The tempdir at `/tmp/[username]`

This feature is enabled by default, but can be disabled by the administrator. Also, it is disabled by default on [domains](../domains/concept.md).

## Combining global and per-user encryptions

When both a user enabled encryption for its user account and global encryption is active too, instead of having to encrypt and decrypt the data twice the user's data will be encrypted using a key derived from the master key as well as the user's encryption key.

This allows to save a lot of time but still prevent unauthorized access if the user's password is weak.
