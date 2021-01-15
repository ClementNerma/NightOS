# Astral

Astral is the toolchain required to build NightOS applications. It's a command-line only application which also embeds the `sys::astral` library.

## Description

Astral is made of several tools:

- A _builder_, which builds application packages from their manifest
- A _publisher_, which allows to sign the application and upload it to the [Store](Stellar.md)
- A _debugger_, which provides tools to run and debug an application (monitor [permissions](../features/permissions.md), create [puppet sandboxes](../features/sandboxes.md#puppet-sandbox), ...) 

It relies on several external compilers (Rust, TypeScript, ...) to build applications from source. Infrastructure for the main languages is installed by default, but additional toolchains can be installed manually.
