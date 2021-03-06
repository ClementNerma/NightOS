# Scheduling

This document presents how tasks are scheduled internally.

## Performance balancing

Each process has a _priority_ number, between 1 and 20, which indicates how much its performances must be prioritized compare to other processes.

Scheduling is achieved in a preemptive way, to prevent processes from taking too much CPU time.

The basics can be found [here](../../features/balancer.md).

More specifically, the higher the priority of a process is, the faster it will run. Here are the priority-dependant aspects of a process:

- Number of instructions run per cycle
- Priority when accessing I/O through services

Comparatively, when a process has a high priority, other processes will run a tad slower.

## Cycles and context switching

To run processes, the kernel simply iterates over the list of existing processes, and allow them to run a given number of instructions. Then, the control is taken back by the kernel which runs the next process, and so goes on.

This happens as follows:

1. A process is selected
2. If the process is currently suspended, it is ignored
3. Its registers are restored by the kernel (if any)
4. The process runs a given number of instructions
5. The kernel takes back the control of the CPU
6. The process' registers are saved
7. Go to step 1

These steps are known as a _cycle_.

### Automatic priority attribution

Processes' priority is automatically adjusted by the kernel, unless it is manually assigned through the [`SYS_PROCESS_ATTRIBUTES`](syscalls.md#0xd2-sys_process_attributes) syscall.

The priority is determined based on multiple factors:

- Does the process have a fullscreen window?
- Does the process owns the active window?
- Does the process owns a visible window?
- Is the process a driver or service? If so, how much is it used?
