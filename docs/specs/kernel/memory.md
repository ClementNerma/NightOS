# Memory

This document describes how the kernel organizes and manages the memory.

## Pages

**TODO**

## Isolation

Each [process](processes.md) has its own 64-bit address space, preventing it from accessing other processes' data. The memory is made of pages, which must be either be [allocated](syscalls.md#0x30-mem_alloc) or mapped using [virtual memory segments](#abstract-memory-segments).

## Abstract memory segments

An _abstract memory segment_ (AMS) is an identifier which refers to a segment of memory which doesn't actually exist. To be used, they must be _mapped_ in a process' memory to be accessed like regular memory. The kernel then intercepts all memory accesses to these mappings and handle them, depending on their nature which cover three cases:

- Mapping existing memory pages to others, or sharing them with other processes ;
- Mapping a device's memory into the process' own memory space ;
- Making a virtual memory space handled by signals

An AMS can then be mapped at multiple places in a process' memory, or shared with other processes. The kernel handles mappings to get optimal performances and reduce the number of memory accesses as much as possible.