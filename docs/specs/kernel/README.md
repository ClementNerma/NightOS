# Kernel

NightOS' kernel is named _Cosmos_. It is a micro-kernel which tries to be as simple and straightforward as possible, delegating all non-trivial tasks such as filesystem access or permissions management to [services](../../technical/services.md).

**NOTE: This document is in its _very early stages_, and so is far from being complete. Major changes may and will be made to related documents.**

## Documents

- [Hardware](hardware.md) - how the kernel interacts with hardware
- [Kernel-process communication](kpc.md) - how the kernel communicate with processes and vice-versa
- [Memory](memory.md) - memory organization and management
- [Processes](processes.md) - processes concept and management
