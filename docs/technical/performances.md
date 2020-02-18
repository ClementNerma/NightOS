# Performances

## Cycle and phases

Because processes' instructions cannot always be processed parallely, the system will let each application run a fixed amount of instructions, before going to the next one. This short period of time is called a _phase_ and generally lasts a few milliseconds. The treatment of a single phase for all running processes is called a _run cycle_. When a process isn't in a phase, it is "paused" until the next one.

## Processes' priority

Each process is started with a given _priority_, which is a number from 0 to 10, which can be modified during its execution. The more priority it has, the more instructions it will run in a single phase.

A priority of 0 prevents the program from running any instruction at all. In this case, only an external process will be able to increase the priority to let the program run again.

By default, a background process gets a priority of 2, a visible process gets a priority of 4, the process linked to the active window gets a priority of 6, and the process linked to a fullscreen window gets a priority of 7.

When a process asks to set its priority to 9 or 10, a confirmation overlay is shown.

## Balancing performances

See the performances [balancer](../features/balancer.md).
