# Kernel

NightOS' kernel is named _Cosmos_. It is a micro-kernel which tries to be as simple and straightforward as possible, delegating all non-trivial tasks such as filesystem access or permissions management to [services](../../technical/services.md).

## Documents

* [Kernel-process communication](kpc.md) - how the kernel communicate with processes and vice-versa
* [Memory](memory.md) - memory organization and management
* [Processes](processes.md) - processes concept and management