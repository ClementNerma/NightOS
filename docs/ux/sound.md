# Sound

This document describes how audio is implemented in NightOS.

## Audio inputs

Devices recognized as [audio inputs](../specs/services/hw.md#driven-device-type) can act as global audio input devices. Multiple devices can be used at the same time, but only one default input can be selected.

By default, each time a new audio input device is connected, it is selected as the new default device. When disconnected, the previous default device is selected again.

It is also possible to set a device as always being the default one, even if other devices are connected afterwards.

## Playback devices

Devices recognized as [audio outputs](../specs/services/hw.md#driven-device-type) can act as global audio output devices. Multiple devices can be used at the same time, but only one default output can be selected.

By default, each time a new audio input device is connected, it is selected as the new default device. When disconnected, the previous default device is selected again.

It is also possible to set a device as always being the default one, even if other devices are connected afterwards.

## Multimedia playback

When a sound is played, the process must specify the type of the audio resource, which is either "standalone sound" or "multimedia sound". In the second case, a [multimedia notification](notifications.md#multimedia-notifications) is emitted, which can then be controlled by the application but cannot be closed while the media is playing.
