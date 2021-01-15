# Monitor

Monitor allows to see and manage running applications and processes, as well as to watch resources usage like CPU percentage or used RAM.

## Features

Monitor can display as an instant, real-time label or as a graph multiple informations:

- Memory usage
- CPU usage (global and per core) for each CPU
- GPU usage (by type) for each GPU
- Storage usage (HDD, SSD, USB, ...) for each storage device
- Network usage for each available connection

Usage can be expressed in percents, and when applicable in bandwidth (MB/s par default).

Additional informations can also be displayed:

- Frequency of each CPU core
- Frequency of each GPU
- Number of concurrent reading and writing to each storage device
- Temperature for each device supporting it
- Memory usage (by type)

Hardware informations can also be displayed:

- General : number of processes, number of threads, uptime, number of opened file handles
- CPU : model, frequency (total and per core), base frequency, boost frequency, physical cores, logical cores, number of used sockets, caches
- GPU : model
- Memory : capacity, in use, panigated, used slots, available slots, frequency
- Storage : model, capacity, used, locks, cached data, S.M.A.R.T. if applicable
- Network : type of connection, hardware speed, IPv4 and IPv6 address, used DNS

It also displays informations on processes, services, and sum for applications with at least one running process, separated in 3 tabs:

- Name
- Icon
- Application (+ icon)
- [ANID](../specs/applications-libraries.md#application-identifier)
- CPU usage
- GPU usage
- Memory usage (percent and absolute amount)
- Storage usage (percent and absolute speed)
- Network usage (percent and absolute speed)
- Approximate battery consumption
- [Process identifier](../specs/kernel/processes.md#process-identifier)
- Command-line arguments (when started as a command)
- [Application context](../specs/applications/context.md) (if applicable)
- Process priority
- Number of threads
- Number of file handles
- List of file handles
- List of permissions
- Is the process frozen? (process only)
- Number of clients (service and application only)
- Is a service active? (application only)
- Number of processes (application only)
- Number of threads (application only)