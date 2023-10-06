# Encryption

Encryption allows to prevent unauthorized access to a data with a password.

- [Installation defaults](#installation-defaults)
- [Relayed encryption](#relayed-encryption)
- [Full-storage encryption](#full-storage-encryption)
  - [Passwordless encryption](#passwordless-encryption)
  - [Master password encryption](#master-password-encryption)
- [Per-user encryption](#per-user-encryption)
- [Per-user shared global encryption (USGE)](#per-user-shared-global-encryption-usge)
- [Which method to use?](#which-method-to-use)

## Installation defaults

During installation, a check-up is performed to check if the system supports Secure Boot and if it has a modern TPM. If both are available, it will suggest to enable full-storage

* Both Secure Boot and TPM enabled => [relayed encryption](#relayed-encryption)
* Otherwise => [USGE](#per-user-shared-global-encryption-usge)

## Relayed encryption

Related encryption is the combination of [full-storage](#full-storage-encryption) and [per-user](#per-user-encryption) encryption. It works by encrypting the global storage using the master key, but users' data are only encrypted using their own user key. This avoids double encryption and still remain perfectly secure.

## Full-storage encryption

Full-storage encryption encrypts the entire system storage. It is incompatible with USGE (only one of these two can be enabled at a time).

At any time, it can either be enabled or disabled through the the [control center](../applications/Central.md).

**NOTE:** The ability to encrypt the storage globally, change the master password or decrypt the storage is by default reserved to the main administrator, but this privilege can be given to normal administrators, though this is highly discouraged.

### Passwordless encryption

The installer runs a quick check-up and if the computer is considered secure enough (which notably requires the presence of a TPM and support for Secure Boot), it will suggest to use a passwordless method. The random key is then stored in the TPM and the bootloader is checked by the UEFI using Secure Boot to ensure it has not been compromised, avoiding possible data extraction in case of the device being stolen.

If this method is selected, the whole installation will be encrypted using that key. On startup, the UEFI will check the bootloader's integrity through Secure Boot, and let it start if valid. The (unencrypted) bootloader will then retrieve the key from the TPM and decrypt the final bootloader, which will handle the remaining boot steps.

A recovery key is generated, which must be backed up somewhere, in case the bootloader asks for it.

### Master password encryption

If the computer isn't deemed secure enough or if the user chooses to, a master password will be asked for. This password allows to encrypt the whole installation by using a global password.

On startup, the system will run the (unencrypted) bootloader which will ask for the master password. It will then retrieve the encrypted master key and try to decrypt it using the provided master password. If it succeeds, the boot process can continue.

This is more secure than the passwordless method as it does not depend on the UEFI's Secure Boot which reduces the attack surface, and also prevents cold boot TPM attacks, ensuring that (if implemented correctly) the storage will never be decrypted without the master key.

## Per-user encryption

Any non-guest user can also use a built-in system tool to encrypt its data using its own password. This way, the user's data become unreadable without his password, making even administrators unable to read his data.

The encryption/decryption key is generated automatically when the user account is created and stored in the user's profile data (in `/etc/sys/users`).

When enabled, the encrypted directories are:

- The homedir at `/home/[username]`
- The tempdir at `/tmp/[username]`

This feature is enabled by default, but can be disabled by the administrator. Also, [domains](domains.md) communicate by default the secret key to the domain's manager.

## Per-user shared global encryption (USGE)

USGE is a method used to perform near full-storage encryption, without a master password and without the need of an UEFI / TPM. It is does not prevent modifications in case of physical access to the device, but prevents data from being extracted if the device is stolen.

When configured, it will wait for the user's name and password to be input in the login screen to decrypt a shared master key, which will be used to decrypt the global storage. User's data will then be decrypted using the user key, just like [relayed encryption](#relayed-encryption). The main difference between the two being the way the storage itself is encrypted.

This allows to not have to input a master password, not rely on an UEFI's Secure Boot system and prevent cold boot TPM attacks, while still providing near full-storage encryption + per-user encryption for all users.

This feature forces encryption for all users and requires every user to set up a strong password.

## Which method to use?

Every method is suited better for a specific type of environment.

If you want the maximum level for security, be the only one to use your computer and enable only full-disk encryption with a strong master password and a strong user password.

If you want to prevent data from being extracted in case of theft, enable relayed encryption or USGE.

If you want to have the most seamless experience, use USGE. You will not be prompted for a master password but still have system and user data encryption.
