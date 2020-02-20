# Vocabulary

This document introduces all vocabulary related to NightOS;

## Graphics-related terms

## Surface

A _surface_ is a two-dimension area displayed on the screen. It is often used to refer to an application's window.

## Interaction

An _interaction_ with a given [surface](#surface) consists in the user clicking on it on pressing a key while this surface is focused.

### Windows

#### Window

A _window_ is a 2D figure provided to an application for manipulation.
It does not refer to the desktop environment itself, or to the bootloader's screens for example.
There are several types of windows: [resizable windows]

#### Borderless windows

_Borderless_ windows are windows without any titlebar nor [resizing lines](#windows-resizing-lines).

#### Resizable windows

_Resizable_ windows are the most common type of windows. They feature a [title bar](#windows-title-bar) as well as [resizing lines](#windows-resizing-lines).

#### Windows' title bar

A window's _title bar_ is a bar located above the window's content. It contains:

* On its left: a set of four buttons (customizable) which allow to hide the window in the taskbar, restore/maximize it, close it, or suspend/resume the related application ;
* On its center: the window's title, which is controlled by the application and may change during the window's lifetime

#### Windows' resizing lines

A window's _resizing lines_ are four lines on all sides of a window, 1-pixel wide or high, which allow to extend or reduce the window's size relatively to the line's position.

For example, dragging the top line to a pixel higher on the screen will result in the window being extended to this direction - but other borders of the window won't move. Dragging the top line to the opposite direction will result in the window being compressed to this direction.

The top line is located above the window's titlebar.