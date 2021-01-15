# Locky

Locky is NightOS' encryption tool. It is used to [encrypt the whole storage](../features/encryption.md#global-encryption) and [encrypt individual users' data](../features/encryption.md#per-user-encryption). It embeds the `sys::locky` library.

## User interface features

- Encryption and decryption of notes
- Encryption and decryption of files, folders
- Encryption and decryption of storages (for supported filesystems)

## Library features

- Encryption and decryption of data streams
- Support for third-party algorithms
- Can act as an intermediary file driver
