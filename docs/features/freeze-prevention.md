# Freeze prevention

_Freeze prevention_ prevents nearly all computer freezes, by reserving a little amount of resources to the system.
It is enabled by default, but it can be disabled during installation process or from the control panel.

- [How freeze prevention works](#how-freeze-prevention-works)

## How freeze prevention works

The system forbids applications to access a fixed amount of RAM, called the _freeze prevention resource_ (FPR), which is by default the smallest between 1% of the total RAM and 8 megabytes.

When more than 99% of CPU and/or RAM is used, the system puts itself in _freeze prevention mode_ (FPM), which consists in listening to a specific keyboard shortcut (by default, `Ctrl+Alt+P`), controllable using the keyboard or the mouse (with a special block cursor, not changeable by applications) which asks user if they want to terminate gently the more resources-consuming application instance (by sending the `TERMINATE` signal), to kill it, to kill all instances of the application, or to see the list of running application instances with how much resources they consume, to make a choice on another one.

If developer mode is enabled, another option is added to access a tiny shell containing a set of commands made to list and manage running applications in a more powerful way.
