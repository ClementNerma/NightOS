# Sandboxes

_Sandboxes_ allow to test an application without applying modifications to the system.

## How sandboxes work

A sandbox is an execution mode where an application's modifications to the disk are not applied directly to it, but instead to a virtual drive stored in its `sandboxes` folder. When the app. exits, a confirmation overlay proposes to apply the modifications to the real storage - it's also possible to see the changes before applying them.

In developer mode, it is possible to export sandboxes and import them on other computers.

## Persistent sandboxes

Sandboxes can also be created as _persistent_, which prevents them from being removed after the app. exited. Instead, the next time it will run, the same sandbox will be used again.

## Puppet sandbox

Sandboxes can be controlled by another application (this requires an administrator permission, though). This allows to automatically accept or decline every API usage, like permissions or I/O requests. Such sandboxes are called _puppet sandboxes_, and they can be especially useful for testing.
