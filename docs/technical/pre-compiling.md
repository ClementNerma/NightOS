# Pre-compiling

On traditional operating systems, programs are provided as binary and so are only available for one specific platform (Windows, Linux, MacOS, ...) with a specific architecture (x86, ARM, ...).

In order to prevent this, and in order to bring more stability and security to native programs, NightOS programs are shipped as _NightOS Pre-compiled Programs_ (NPP) using a specific language called _CommonAssembly_.

- [How it works](#how-it-works)
- [Compatibility](#compatibility)
- [Usage](#usage)

## How it works

CommonAssembly is very similar to WebAssembly: compressed very low-level source-files that are built ahead of time on the machine that will run it. This enables several advantages:

- Programs are multi-platforms, multi-architectures
- Programs run faster thanks to being optimized for the specific machine they will run on
- Programs are still very fast to compile
- Source code is protected for closed-source applications as CommonAssembly is made of basic instructions
- Better security thanks to programs being checked ahead-of-time

## Compatibility

CommonAssembly can be ran on other operating systems than NightOS using a lightweight wrapper available on NightOS' official website.

_NOTE:_ While CommonAssembly is multi-platform, NightOS applications take advantage of NightOS' features like more powerful signals that are _not_ natively available on other systems. In order to run such applications, you must install the [full wrapper](multi-platform.md) which is available on the same website.

## Usage

Open-source and closed-source NightOS applications usually bring pre-compiled versions of themselves in order to fasten a lot the installation process, and to get rid of the need of having the heavy build toolchain installed on the target computer.

This allows to install applications really fast, and to optimize them for the current machine.
