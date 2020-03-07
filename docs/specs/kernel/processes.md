# Processes

Apart from the kernel itself, all programs run in _processes_.

## Isolation concerns

The main point of separating programs in processes is to be able to give them different authorizations.
For instance, if two programs A and B run, we may not want A to be able to read and modify the next instructions and/or program data of B.

## Performance balancing

