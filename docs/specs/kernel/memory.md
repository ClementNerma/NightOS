# Memory

This document describes how the kernel organizes and manages the memory.

**WARNING:** This document is only a short draft and is missing a LOT of informations on how the memory will be structured and managed.

## Structure

Every running code that is not part of the kernel itself doesn't have access to the physical memory. Instead, every process has a virtual 64-bit address space split into _pages_.

## Pages

A page can either be _small_ (usually 4 KB) or _large_ (usually 2 or 4 MB), the exact sizes depending on the CPU architecture.

Pages can be allocated through the [dedicated syscall](syscalls.md#0x30-mem_alloc) syscall, or mapped using [abstract memory segments](#abstract-memory-segments).

## Abstract memory segments

An _abstract memory segment_ (AMS) is an identifier which refers to a segment of memory which doesn't actually exist. To be used, they must be _mapped_ in a process' memory to be accessed like regular memory. The kernel then intercepts all memory accesses to these mappings and handle them, depending on their nature which cover three cases:

- [Mapping existing memory pages to others, or sharing them with other processes](syscalls.md#0x40-virt_mem_ams) ;
- [Mapping a device's memory into the process' own memory space](syscalls.md#0x73-device_ams) ;
- [Making a virtual memory space handled by signals](syscalls.md#0x41-backed_ams)

An AMS can then be mapped at multiple places in a process' memory, or shared with other processes. The kernel handles mappings to get optimal performances and reduce the number of memory accesses as much as possible.

## Addresses randomization

Allocations happen at random addresses using address space layout randomization (ASLR).

Kernel memory's randomization using processes like KASLR or KARL are currently being considered.

## Write-or-exec

Memory implements a W^X model where memory can be writable **or** executable, but not both. This way, an attacker cannot write arbitrary instructions in memory and then execute them.