# Project development

**WARNING: This document is only a draft and as such far from being complete. All informations described here are subject to change anytime.**

- [Languages](#languages)

## Languages

The project will be developped in [Rust](https://rust-lang.org/), with first-class support for this language.
API interopability will be assured for [TypeScript](https://www.typescriptlang.org/) as well as [Python](https://www.python.org/) in the future.

Usage of architecture-specific assembly will be reduced as much as possible, being only used in two cases:

- The desired behaviour cannot be reached without assembly (e.g. direct register or stack manipulation)
- Extremely performance-critical pieces (e.g. memory management, context switching, etc.)
