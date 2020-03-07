# Flows

_Flows_ are a simple and efficient way for processes (mostly [services](services.md)) to allow treating flows of data.

## How it works

A flow is a file without extension, located in the `/fl` directory, that can either send data to reader processes (_read-only_) or receive data from writer processes (_write-only_).

To understand the concept better, here is the list of native flow files that are always available:

| Flow file    | Type       | Description                                                                                       |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------- |
| `/fl/zero`   | Read-only  | Outputs zeroes all the time ; useful to zero a file or device or to benchmark a storage           |
| `/fl/rand`   | Read-only  | Outputs cryptographically-secure random numbers. Useful to randomly fill a storage or memory area |
| `/fl/ucrand` | Read-only  | Outputs non-cryptographically-secure random numbers, thus faster that `/fl/rand`                  |
| `/fl/null`   | Write-only | Receives data but does nothing with them                                                          |

Processes are based on [pipes](ipc.md).

## Creating a flow

When a process wants to create a flow, it follows the following procedure:

1. The process asks the [`sys:flow`](../specs/services.md#sysflow) service to create a flow
2. The service creates the related flow file in `/fl`
3. When a process reads from the (readable) flow file, all data is continuely retrieved from the creator's SC (until the flow is closed)
4. When a process writes to the (writable) flow file, all data is continuely written to the creator's RC (the flow is not closed after that though)
5. When the creator closes its SC/RC, the IPC channels duo is closed and the flow file is removed

## Connecting to a flow

When a process wants to read from or write to a file, it first asks the [`sys:flow`](../specs/services.md#sysflow) service to connect to this file. If accepted, it receives a [SC or RC](../specs/ipc.md#pipes) to interact with the flow.