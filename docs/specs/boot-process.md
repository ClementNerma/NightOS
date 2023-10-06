# Boot process

The system's boot process is divided in two parts: the unsecure bootloader (BOOT1) and the system bootloader (BOOT2).

Note that BOOT1 and BOOT2 have their own [dedicated partitions](filesystem.md#partitions), the latter getting one for slot 1 and another for slot 2 (see below for more details).

## Stage 1: unsecure bootloader (BOOT1)

This is the component loading at the very beginning, called directly by the UEFI. It is unencrypted (hence the name "unsecure").

It starts by initializing the minimum required computer's components.

If the "Escape" key is detected as being pressed during a short time frame, it shows a troubleshooting menu, notably switching the boot slot.

If other bootloaders are found on the storage, it displays a boot menu asking which system to boot. If another system is selected, it launches it.

Otherwise, it tries to get the master key depending on the configured [encryption method](../features/encryption.md):

* If storage encryption is disabled or if only [USGE](../features/encryption.md#per-user-shared-global-encryption-usge) is enabled, nothing to do ;
* If [full-storage encryption](../features/encryption.md#full-storage-encryption) is enabled:
  * For passwordless authentication, ensure Secure Boot has verified BOOT1
    * If so, retrieve the master key from the TPM and use it to decrypt the storage
    * Otherwise, ask for the recovery key to decrypt the storage (only required once)
  * Otherwise ask for master password and use it to decrypt the master key

It checks the boot slot to use (1 or 2), and read BOOT2 from it.

If BOOT2 is encrypted (full-storage encryption only), the master key is used to decrypt it. Its signature is then checked to ensure it has not been modified. If the signature don't match, the computer will by default refuse to boot to avoid corruption and/or booting malicious programs. By inputting a specific phrase displayed on the screen, the user can force the boot process, at the expense of security.

If signatures match, BOOT2 is launched directly.

## Stage 2: system loader (BOOT2)

This component checks signature for BOOT3. It also provides more advanced troubleshooting thanks to the whole storage being decryptable.

If signatures are not valid, an error message is shown and the booting process is halt. By inputting a specific phrase displayed on the screen, the user can force the boot process, at the expense of security.

It then initializes all required drivers, initialize a graphical session, and asks to select a user account. At this point, it also provides more troubleshooting options.

If the provided username and password are valid, it then does the following:

* If [USGE](../features/encryption.md#per-user-shared-global-encryption-usge) is enabled, the master key and user key are decrypted
* If [per-user encryption](../features/encryption.md#per-user-encryption) is enabled, the user key is decrypted

The user session is then opened by calling the relevant system component.
