# Desktop Environment

The _Desktop Environment_ (DE) is an application that acts as the main graphical interface of NightOS.

It is launched with the system, does never stop until the system itself stops, and handles most of the user interface.

## Desktop Environment Applications

A _desktop environment application_ (DEA) can only be launched by the system, and is only launched once during the whole system's lifetime, except for their commands which can be launched by anyone. It is also the very first application to be run.

There are two default DEA: [Nova](../applications/Nova.md), and [BareEnv](../applications/BareEnv.md).

The former acts as the default, reference and recommanded DE of NightOS, while the latter is for servers and other computers without a graphical output. It only supports text-based workflows, which limits it to command-line usage.

An application can register itself as a DEA by exposing a `SYS_DENV` service in its [manifest](../specs/applications.md#execution-context).

## Permissions

A [DEA](#desktop-environment-applications) does not require specific permissions in order to work ; it only requires to expose a [specific integration service](../specs/services/integration/desktop-environments.md) in its [manifest](../specs/applications.md#execution-context).

## Display layers

The graphical interface is split into _layers_, which represent the display priority when two elements overlap. For instance, when two elements A and B overlap visually (= part of them is displayed at the same coordinate than the other), the element located in the highest layer will be displayed on top of the other element.

Layers are indexed, starting from `0` with the lowest priority.

## Windows

Windows are the base display element for applications. They can take any form depending on the DE's display method, but are usually made of the application's drawing zone and a titlebar.

Some desktop environments may not accept windows (for instance, [BareEnv](../applications/BareEnv.md) which is a text-only desktop environment). In such case, most applications will fail to run as they won't be able to build windows, but this is still allowed.

## Security and operation

Unlike other operating systems, [DEA](#desktop-environment-applications) can only access their own data and cannot manipulate the data inside other applications, even graphically.

Desktop environments rely on the [`sys::ui`](../specs/services/system/ui.md) system service to control the data they display.

This service provides them several [methods and events](../specs/services.md#communication), mainly to:

- Display graphical elements on [layer 0](#display-layers)
- Display the content of a window at provided coordinates
- Notify a window owner that its window should be closed
- Notify a window that a part of its [state should change](#window-states)
- Reject a window's [state change](#window-states)
- Be notified when a window's [state changes](#window-states)

At no moment can the desktop environment access the graphical content of a window, nor affect it, as windows are displayed starting from [layer 1](#display-layers).

On the other hand, the desktop environment can force a window owner (the application process that created it) to resize, minimize, restore, put to fullscreen, etc. and can also hide some elements from the system as it is not forced to display a window's content.

## Window states

A window's state is made of its characteristics:

- Title
- Buttons
- Icon
- Dimensions (width / height)
- Coordinates (X and Y)
- [Active attribute](#activeinactive-windows)
- [Interactive attribute](#interactive-windows)
- [Fixed-size attribute](#fixed-size-windows)
- [Display layer](#display-layers)
- [Display state](#window-display-state)
- Custom state attributes

The custom attributes are handled by the DEA itself, and can contain any piece of information relevant to displaying the window, such as the virtual desktop number if the DE supports it.

### Window display state

Windows have a _display state_ which indicate how they are displayed on the screen. These states can be:

- **Restored**: the default
- **Maximized:** the window takes all the available space, minus the space used by its optional titlebar and the elements displayed by the desktop environment
- **Minimized:** the window is hidden but still available
- **Fullscreenized:** the windows takes all the screen, hiding all other windows and elements from the desktop environment, including its own titlebar

## Active/inactive windows

All windows are considered _inactive_ unless they are _focused_, which on most desktop environments put them on the top layer. There are no specific difference between active and inactive windows, but this attribute is indicated to the owner application as this may impact the desired behaviour of the application.

## Interactive windows

By default, windows are _interactive_, meaning user inputs can be sent to them. They may be set _non-interactive_ to stop receiving such events and preventing users from interacting with them.

## Fixed-size windows

Fixed-size windows are windows whose size is fixed and cannot be resized by the end user.

## Common elements

Desktop environment are traditionally made of several elements:

- The *taskbar* lists all opened windows
- The *notification center* centralizes all [pending notifications](notifications.md)
- The *titlebar* is an element put on each window to see its title, icon and control [its state](#window-states)

These elements are common but are **_NOT_** required to be present in a desktop environment.

## Interface windows

_Interface windows_ are windows that are created by another application to be used in a specific part of the desktop environment. It results in the integration of an application with the current DEA.

Interface windows are created the same way as usual windows, but do not usually have a titlebar and can often not be moved. They are mostly used to create widgets and display context menus on items.

Typically, an interface windows created by an application is hidden by default, and the DEA shows it only after getting its identifier returned by the service it is communicating with.

## Popups

Popups are special windows which are not drawable directly by the application. They usually contain a single icon, as well as a message and at least one clickable button. They are used to transmit informations to the end user, such as an error or a warning message.