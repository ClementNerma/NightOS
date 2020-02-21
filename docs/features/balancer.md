# Balancer

The _balancer_ is a program that allows to get more performances out of most important applications.

## How the balancer works

The balancer allows to manage the priority of userland processes - and only them. Here is the list of its features:

* Increase priority of this application: gives a priority of 8 to the process linked to the active window ;
* Give maximum priority to this application: gives a priority of 10 to the process linked to the active window ;
* Set this application with maximum priority: always give a priority of 8 to this application's processes ;
* Suspend/resume this application: see below ;
* Enter performance mode: see below

## Application processes suspension

Application processes can be _suspended_, which is an equivalent of pause where they don't run at all.
This is achieved by setting their priority to 0.

A suspended application can then be _resumed_, and because it was just suspended it will instantly run again, without any data loss.

When a process is suspended, all its [child processes](../technical/processes.md#child-processes) are, too.

## Performance mode

The _performance mode_ performs the following actions:

* For all userland processes with a non-null priority, set their priority to 1 ;
* For all the processes of the application related to the active window, set a priority of 10.

This makes all other applications running a lot slower, but the current one will run a lot faster.
The priority is re-calculated whenever the active window changes.

When a fullscreen application uses more than 50% of CPU in fullscreen, or when it asks for it, an overlay suggesting to enter performance mode is shown.

Performance mode is automatically exited when the related process exits.
