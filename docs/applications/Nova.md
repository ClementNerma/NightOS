# Nova

Nova is the default desktop environment of NightOS.

It has a highly-customizable user interface.

**WARNING:** This document is only a draft and is **extremely far** from being complete! Anything written in this document is subject to change at anytime.

## User interface

### The desktop

The desktop itself is visible in the background - it is fully visible when on window on foreground.

It shows all items from `/home/[username]/desktop`.

Right-clicking on an item shows the [default file manager's](../specs/file-manager.md) [context menu](../specs/file-manager.md#0xa0-context_menu).

A background image called _wallpaper_ is also displayed under the desktop. The wallpaper can be replaced by a custom one.

### Notification center

The notification center is a panel that slides in from one of the screen's side. The side can be customized.

It has a vertical layout and contains the list of each notification.

By default, it also shows a few quick settings as well as the date and hour of the day.

### Dock

An optional dock can be shown, made of a list of icons on one side of the screen. It also shows the list of opened windows, even if they are not pinned to the dock. An indicator also shows the number of opened windows (a dot for each window).

Moving the mouse on top of one of the icon will by default show a preview of each opened window, side by side. If a high number of windows are opened (by default more than 4) the previews will be stacked on a grid. By default, previews are shown by recently used order, with a maximum of 16 windows (grid of 4 rows, 4 columns).

Clicking on an icon will, if the application already has a window, show the grid, else open the application.

For custom shortcuts, this will only trigger the selected shortcut.

## User experience

### Removing native applications

When removing a native applications, a popup will suggest to hide the app instead of removing it, which allows other applications and scripts to still interact with them.
