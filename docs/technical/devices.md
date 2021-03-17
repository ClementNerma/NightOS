# Devices

- [Connecting a new device](#connecting-a-new-device)
- [Interacting with a device](#interacting-with-a-device)
- [Device handler files persistence](#device-handler-files-persistence)
- [Custom device handler filename](#custom-device-handler-filename)

## Connecting a new device

When a new device is connected to the computer, a _device handler file_ (DHF) is created in the `/dev` directory (see [filesystem structure](../specs/filesystem.md#structure)).

Depending on its type, it will be put in a different directory, as shown in the above document. Note that new category directories may be introduced later on.

The filename itself is a random unique identifier made of a single lowercase letter, a digit, another lowercase letter and finally another digit.

For instance, if a hard drive is connected to the computer, the DHF may be something like `/dev/sst/f5t2`.

## Interacting with a device

Device handler files are not simple files ; they can only be used through the [`sys::hw`](../specs/services/system/hw.md) service.

Different actions may happen depending on the device's type:

- Camera devices: when an application asks to capture a photo/video, the device will be suggested to take the images from
- Microphones: when an application asks to capture sound, the device will be suggested to capture the sound from
- Sound output devices: the device will be available for playback
- Network adapters: the device will be available to make network requests on
- Other supported wireless devices: depends on the type (Bluetooth adapter, ...)
- Basic/persistent storage devices: when possible, the device will be automatically mounted in `/mnt` and visible in the files explorer

There are many different types of devices, all can be found in the specifications of the [`sys::hw`](../specs/services/system/hw.md) service under the ["Driven device type" (DDT) section](../specs/services/system/hw.md#driven-device-type).

For uncategorized devices (in `/dev/etc`), a popup is shown to the user, to indicate the connected device is not recognized. Some applications may still be able to interact with it (for instance, a storage device using an unsupported protocol).

## Device handler files persistence

When a device is connected, its DHF is not removed. Instead, if a process tries to interact with the DHF, the [`sys::hw`](../specs/services/system/hw.md) service will indicate the device is currently not connected.

When the device is connected again, it is associated to the same DHF again. This allows applications to persist the device's location and use it later on.

## Custom device handler filename

It's possible to give a custom handler filename for intuitivity. In such case, a new DHF is created in the related directory, but the old DHF is kept anyway. This allows to not break compatibility with applications that rely on the old DHF.

The two DHF will point to the exact same device, without any difference. The custom DHF can be removed anytime, although this is discouraged as applications may rely on it.

Also, custom DHF names must always be longer than 4 characters, to avoid confusion with automatically-generated DHFs.
