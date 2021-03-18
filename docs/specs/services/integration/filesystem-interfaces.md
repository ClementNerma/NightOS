# Filesystem interfaces

Filesystem interfaces are services that act as a layer of indirection between a storage [driver](../system/hw.md#drivers) and the [`sys::fs`](../system/fs.md) service. Their role is to translate all common filesystem operations, such as items management and modification.

Most methods and notifications of filesystems interfaces are also available in the [`sys::fs`](../system/fs.md) service, with first perform permissions checking and determines the device and location to perform the operation on.

As an application can only expose one single filesystem interface service, the said service will handle all of the hardware components driven by the said process. This is why the the [FSID](../../filesystem.md#filesystem-unique-identifier) of the target filesystem is provided for each request.

## Filesystem paths

Filesystem paths are used to refer to specific filesystem elements and are encoded as either a `0x01` byte followed by a [FEID](../../filesystem.md#element-unique-identifier), or a `0x02` byte followed by a [split path](#split-paths).

## Split paths

All paths manipulated and returned by a filesystem interface services are encoded as _split paths_: [delimited lists](../../kernel/data-structures.md#delimited-lists) of [delimited strings](../../kernel/data-structures.md#delimited-strings).

Each entry of the list must be a path's component. The entries, joined with a slash (`/`), should form a valid path.

Empty and `.` components are ignored, while components equal to `..` will make this component ignored and remove the previous component in the list.

The slash (`/`) character is forbidden in components.

## Methods

**TODO**