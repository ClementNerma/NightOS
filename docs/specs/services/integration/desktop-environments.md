# Desktop Environments

- [User interface concepts](#user-interface-concepts)
- [Window's state](#windows-state)
  - [Header and content](#header-and-content)
    - [Delimited title strings](#delimited-title-strings)
    - [Icons](#icons)
    - [Buttons](#buttons)
    - [Display state](#display-state)
- [Methods](#methods)
  - [`0x01` SUBSCRIBE_CAPABILITIES](#0x01-subscribe_capabilities)
  - [`0x02` CAPABILITIES](#0x02-capabilities)
  - [`0x10` CREATE_WINDOW](#0x10-create_window)
  - [`0x11` UPDATE_WINDOW](#0x11-update_window)
  - [`0x12` GET_WINDOW_STATE](#0x12-get_window_state)
  - [`0x1F` DESTROY_WINDOW](#0x1f-destroy_window)
  - [`0x20` CREATE_POPUP](#0x20-create_popup)
  - [`0x2F` DESTROY_POPUP](#0x2f-destroy_popup)
  - [`0x30` SEND_BASIC_NOTIFICATION](#0x30-send_basic_notification)
  - [`0x31` SEND_MUSIC_PLAYER_NOTIFICATION](#0x31-send_music_player_notification)
  - [`0x32` SEND_VIDEO_PLAYER_NOTIFICATION](#0x32-send_video_player_notification)
- [Notifications](#notifications)
  - [`0x02` CAPABILITIES_CHANGED](#0x02-capabilities_changed)
  - [`0x10` WINDOW_CHANGED](#0x10-window_changed)
  - [`0x11` WINDOW_INTERACTION](#0x11-window_interaction)
  - [`0x1F` WINDOW_CLOSED](#0x1f-window_closed)
  - [`0x20` POPUP_INTERACTION](#0x20-popup_interaction)
  - [`0x2F` POPUP_CLOSED](#0x2f-popup_closed)
  - [`0x30` BASIC_NOTIFICATION_INTERACTION](#0x30-basic_notification_interaction)
  - [`0x31` AUDIO_PLAYER_NOTIFICATION_INTERACTION](#0x31-audio_player_notification_interaction)
  - [`0x31` VIDEO_PLAYER_NOTIFICATION_INTERACTION](#0x31-video_player_notification_interaction)
  - [`0x3F` NOTIFICATION_CLOSED](#0x3f-notification_closed)

The _Desktop Environment_ (DE) is an application that acts as the main graphical interface of NightOS.

It is launched with the system, does never stop until the system itself stops, and handles most of the user interface.

The exposed service for desktop environments is `SYS_DENV`.

## User interface concepts

User interface is technically free of any rule ; but it should usually follow the conventions described in the [user experience document](../../../ux/desktop-environment.md).

## Window's state

In this document, a _window's state_ is a data structure describing a window.

It is used both when getting informations about the window, or when changing them.

Custom elements are non-conventional elements handled by this specific desktop environment.

Note that each window has an identifier, used to access it or identify from notifications. These identifiers must either be different or scoped for each client process, as different clients should not be able to access one another's windows.

### Header and content

The window's state is made of a _header_, containing 1 bit for each conventional element to get/update (listed below). Each bit must be set if the element is provided, unset otherwise.

It is followed by the number of custom elements to get/update (2 bytes), and the list of custom elements' identifiers (4 bytes per identifier).

The header is followed by the value of each element to update, _only_ if the element must be updated.

| Header bit | Description                                                                     | Type / Size in bytes               | Content                     |
| ---------- | ------------------------------------------------------------------------------- | ---------------------------------- | --------------------------- |
| 0          | Title                                                                           | [String](#delimited-title-strings) |                             |
| 1          | Buttons                                                                         | [Buttons](#buttons)                |                             |
| 2          | Icon                                                                            | [Icon](#icons)                     |                             |
| 3          | Width                                                                           | 2 bytes                            | In pixels                   |
| 4          | Height                                                                          | 2 bytes                            | In pixels                   |
| 5          | X coordinate                                                                    | 2 bytes                            | In pixels                   |
| 6          | Y coordinate                                                                    | 2 bytes                            | In pixels                   |
| 7          | [Active attribute](../../../ux/desktop-environment.md#activeinactive-windows)   | 1 byte                             | `0x01` to set the attribute |
| 8          | [Interactive attribute](../../../ux/desktop-environment.md#interactive-windows) | 1 byte                             | `0x01` to set the attribute |
| 9          | [Fixed-size attribute](../../../ux/desktop-environment.md#fixed-size-windows)   | 1 byte                             | `0x01` to set the attribute |
| 10         | [Display layer](../../../ux/desktop-environment.md#display-layers)              | 1 byte                             | Layer number                |
| 11         | [Display state](../../../ux/desktop-environment.md#window-display-state)        | [Display state](#display-state)    |                             |
| 12-31      | _Future-proof_                                                                  |                                    |                             |

#### Delimited title strings

Delimited title strings are encoded as [delimited strings](../../kernel/data-structures.md#delimited-strings).

#### Icons

Icons are encoded as [bitmap images](../../kernel/data-structures.md#bitmap-images).

#### Buttons

- Buttons count (1 byte)

Then, for each button:

- Label's [delimited title string](#delimited-title-strings)
- Label's icon (1 byte):
  - Bit 0: does the button have an icon?
  - Bit 1: is the button placed on the left? (else will be placed on the right)
  - Bit 2: should the icon be displayed in monochrome?
- Label's [icon](#icons)
- State (1 byte):
  - Bit 0: Is disabled?
  - Bit 1: Does it use a custom color?
- Color (4 bytes for RGB and transparency) - filled with zeroes if custom color not set in state
- Callback code (1 byte) - for internal use in the client

#### Display state

The display state is one value among:

- `0x00`: Restored (default)
- `0x01`: Maximized
- `0x02`: Minimized
- `0x03`: Fullscreenized
- `0x04`: Kiosk mode

## Methods

### `0x01` SUBSCRIBE_CAPABILITIES

Subscribe to change of capabilities listed by the [`CAPABILITIES`](#0x02-capabilities) method.

**Arguments:**

_None_

**Answer:**

_None_

**Errors:**

_None_

### `0x02` CAPABILITIES

List elements which can be handled by the desktop environment.

For more informations about such elements, see the [user experience document](../../../ux/desktop-environment.md)

**Arguments:**

_None_

**Answer:**

Bits set to `1` if the element is handled (supported) by the DE, `0` else. In each byte below, bits are listed from the strongest to the weakest.

Note that the bit should only be set if the desktop environment is _currently_ able to handle the said element, which means that its display settings change, this answer's content will most probably change.

- Global mechanisms (4 bytes)
  - Bit  0: Windows
  - Bit  1: Moving windows
  - Bit  2: Display layers
  - Bit  3: Pointing devices
  - Bit  4: Notifications
  - Bit  5: Notification center
  - Bit  6: Quick settings
  - Bit  7: Lockscreen
  - Bit  8: Taskbar
  - Bit  9: Dock
  - Bit 10: Desktop icons
  - Bit 11: Wallpaper
  - Bit 12: Customizable wallpaper
  - Bit 13: Popups
  - Bit 14: Is the interface customizable?
  - Remaining bits: _Future-proof_

- Windows' outer interface (4 bytes)
  - Bit 0: Titlebar for windows
  - Bit 1: Custom title in titlebars
  - Bit 2: Custom icon in titlebars
  - Bit 3: Close button in titlebars
  - Bit 4: Customizable buttons in titlebars
  - Bit 5: Disabled buttons in titlebars
  - Bit 6: Custom colors for buttons in titlebars
  - Bit 7: Can windows be made non-interactive
  - Bit 8: Can windows be made fixed-size
  - Remaining bits: _Future-proof_

- Windows' dynamic changes (4 bytes)
  - Bit 0: Windows' focus
  - Bit 1: Ability to move windows
  - Bit 2: Ability to resize windows
  - Bit 3: Ability to reorder windows in layers (superposition)
  - Bit 4: Ability to hide or minimize windows
  - Bit 5: Ability to restore and maximize windows
  - Bit 6: Ability to set the window to fullscreen
  - Bit 7: Ability to set the window to kiosk mode
  - Remaining bits: _Future-proof_

- Windows' dynamic changes by the user (4 bytes)
  - Same as _Windows' dynamic changes_, but set only if the user can achieve the specified operation themselves

- Popups' dynamic changes (4 bytes)
  - Bit 0: Popups' focus
  - Bit 1: Ability to move popups
  - Bit 2: Ability to resize popups
  - Bit 3: Ability to reorder popups in layers (superposition)
  - Bit 4: Ability to hide or minimize popups
  - Bit 5: Ability to restore and maximize popups
  - Bit 6: Ability to set the window to fullscreen
  - Bit 7: Ability to set the window to kiosk mode
  - Remaining bits: _Future-proof_

- Popups' dynamic changes by the user (4 bytes)
  - Same as _Popups' dynamic changes_, but set only if the user can achieve the specified operation themselves

- Notifications (4 bytes) - filled with zeroes if notifications are not supported
  - Basic notifications (4 bytes):
    - Bit 0: Support for custom icons
    - Remaining bits: _Future-proof_
  - Music player notifications (4 bytes):
    - Bit  0: Support for music player notifications
    - Bit  1: Support for track's title
    - Bit  2: Support for album's title
    - Bit  3: Support for artist's name
    - Bit  4: Support for album art
    - Bit  5: Support for artist art
    - Bit  6: Support for track's year
    - Bit  7: Support for track's day/month/year
    - Bit  8: Support for track's genre
    - Bit  9: Support for playlist's name
    - Bit 10: Support for progress bar
    - Bit 11: Support for codec
    - Bit 12: Support for frequency
    - Bit 13: Support for resolution
    - Bit 14: Support for bitrate
    - Bit 15: Support for visualizer
    - Bit 16: Support for displaying next title in queue
    - Bit 17: Support for `current track/queue size` display
    - Bit 18: Support for pause/resume button
    - Bit 19: Support for stop button
    - Bit 20: Support for rewind/fast-forward button
    - Bit 21: Support for previous/next buttons
    - Bit 22: Support for like/dislike button
    - Bit 23: Support for shuffle button
    - Remaining bits: _Future-proof_
  - Video player notifications (4 bytes):
    - Bit  0: Support for video player notifications
    - Bit  1: Support for video's title
    - Bit  2: Support for video's author
    - Bit  3: Support for video's source
    - Bit  4: Support for episode's number
    - Bit  5: Support for episode's serie name
    - Bit  6: Support for codec
    - Bit  7: Support for bitrate
    - Bit  8: Support for video's `current track/queue size` display
    - Bit  9: Support for pause/resume button
    - Bit 10: Support for stop button
    - Bit 11: Support for rewind/fast-forward button
    - Bit 12: Support for previous/next buttons
    - Bit 13: Support for like/dislike button
    - Bit 14: Support for shuffle button
    - Remaining bits: _Future-proof_

- Integrations (4 bytes)
  - Bit 0: Integration with the [default file manager](file-managers.md)
  - Bit 1: Thumbnails generation through the [default file manager](file-managers.md)
  - Remaining bits: _Future-proof_

### `0x10` CREATE_WINDOW

Create a new window.

Unset elements in the provided [window's state](#windows-state) will be replaced by default values or behaviours.

Desktop environment-dependant errors can only be used if the error does not fit any other error code.

If the window is successfully create, the client is automatically subscribed to [`WINDOW_CHANGED`](#0x10-window_changed) notifications for this specific window.

**Arguments:**

- [Window's state](#windows-state)

**Answer:**

- Window identifier (8 bytes)
- [Window's state](#windows-state)

**Errors:**

- `0x20`: Invalid list of elements to create/update provided
- `0x30`: Client is not allowed to create/update a window
- `0x31`: Failed to create/update the window
- `0x40`: Title must be provided
- `0x42`: Title cannot be empty
- `0x43`: Title is not a valid UTF-8 string
- `0x44`: Unspecified error with the title
- `0x50`: Custom buttons provided but it is not customizable
- `0x51`: Too many custom buttons were provided
- `0x52`: A custom button's label is not a valid UTF-8 string
- `0x53`: A custom button's label cannot be empty
- `0x54`: Custom button's icon provided but it is not customizable
- `0x55`: Invalid custom button's icon buffer
- `0x56`: A custom button's icon is too small
- `0x57`: A custom button's icon is too large
- `0x58`: Unspecified error with a custom button's icon
- `0x59`: Unspecified error with a custom button's label
- `0x5A`: Custom button's color provided but it is not customizable
- `0x5B`: Custom button's color uses transparency but it is not customizable
- `0x5C`: Duplicate custom button's callback code
- `0x60`: Custom icon provided but it is not customizable
- `0x61`: Invalid custom icon buffer
- `0x62`: Custom icon is too small
- `0x63`: Custom icon is too large
- `0x64`: Unspecified error with the provided custom icon
- `0x70`: Window's width provided but it is not customizable
- `0x71`: Window's width is too small
- `0x72`: Window's width is too large
- `0x73`: Window's height provided but it is not customizable
- `0x74`: Window's height is too small
- `0x75`: Window's height is too large
- `0x76`: Window's X coordinate provided but it is not customizable
- `0x77`: Window's X coordinate is too small
- `0x78`: Window's X coordinate is too large
- `0x79`: Forbidden window's X coordinate
- `0x7A`: Window's Y coordinate provided but it is not customizable
- `0x7B`: Window's Y coordinate is too small
- `0x7C`: Window's Y coordinate is too large
- `0x7D`: Forbidden window's Y coordinate
- `0x7E`: Invalid window's width/height ratio
- `0x7F`: Invalid window's X/Y coordinates couple
- `0x80`: Active attribute provided but it is not customizable
- `0x81`: Invalid active attribute provided
- `0x82`: Cannot apply the custom active attribute for unspecified reasons
- `0x83`: Interactive attribute provided but it is not customizable
- `0x84`: Invalid interactive attribute provided
- `0x85`: Cannot apply the custom interactive attribute for unspecified reasons
- `0x86`: Display layer provided but it is not customizable
- `0x87`: Display layer is too low
- `0x88`: Display layer is too high
- `0x89`: Forbidden display layer
- `0x8A`: Display state provided but it is not customizable
- `0x8B`: Invalid display state provided
- `0x8C`: Cannot set this specific display state
- `0x90`: Provided custom elements but this DE does not have any custom one
- `0xA0` to `0xBF`: Errors for custom elements
- `0xD0` to `0xEF`: Desktop environment-dependant errors

### `0x11` UPDATE_WINDOW

Update an existing window.

**Arguments:**

- Window identifier (8 bytes)
- [Window's state](#windows-state)

**Return value:**

_None_

**Errors:**

Same errors as the [`CREATE_WINDOW`](#0x10-create_window) method, plus `0x3F` for unknown window identifier.

### `0x12` GET_WINDOW_STATE

Get informations about an existing window.

**Arguments:**

- Window identifier (8 bytes)
- [Window's state header](#header-and-content)

**Return value:**

- [Window's state get content](#header-and-content)

**Errors:**

- `0x20`: Invalid list of elements to create/update provided
- `0x30`: Unknown window identifier

### `0x1F` DESTROY_WINDOW

Destroy an existing window.

**Arguments:**

- Window identifier (8 bytes)
- Skip the [`WINDOW_CLOSED`](#0x1f-window_closed) (1 byte): `0x01` to skip the notification, `0x00` else

**Return value:**

_None_

**Errors:**

- `0x10`: Invalid skip mode provided
- `0x20`: Unknown window identifier
- `0x21`: Failed to destroy the window
- `0xD0` to `0xEF`: Desktop environment-dependant errors

### `0x20` CREATE_POPUP

Create a popup.

**Arguments:**

Same structure than for a [window's state](#windows-state), but with the following common elements:

| Header bit | Description | Type / length in bytes             |
| ---------- | ----------- | ---------------------------------- |
| 0          | Title       | [String](#delimited-title-strings) |
| 1          | Icon        | [Icon](#icons)                     |
| 2          | Buttons     | [Buttons](#buttons)                |

**Return value:**

- Popup identifier (8 bytes)

**Errors:**

- `0x20`: Invalid list of elements provided
- `0x30`: Client is not allowed to create a popup
- `0x31`: Failed to create/update the popup
- `0x40`: Title must be provided
- `0x42`: Title cannot be empty
- `0x43`: Title is not a valid UTF-8 string
- `0x44`: Unspecified error with the title
- `0x50`: Custom buttons provided but it is not customizable
- `0x51`: Too many custom buttons were provided
- `0x52`: A custom button's label is not a valid UTF-8 string
- `0x53`: A custom button's label cannot be empty
- `0x54`: Custom button's icon provided but it is not customizable
- `0x55`: Invalid custom button's icon buffer
- `0x56`: A custom button's icon is too small
- `0x57`: A custom button's icon is too large
- `0x58`: Unspecified error with a custom button's icon
- `0x59`: Unspecified error with a custom button's label
- `0x5A`: Custom button's color provided but it is not customizable
- `0x5B`: Custom button's color uses transparency but it is not customizable
- `0x5C`: Duplicate custom button's callback code
- `0x60`: Custom icon provided but it is not customizable
- `0x61`: Invalid custom icon buffer
- `0x62`: Custom icon is too small
- `0x63`: Custom icon is too large
- `0x64`: Unspecified error with the provided custom icon

### `0x2F` DESTROY_POPUP

Destroy an existing popup.

**Arguments:**

- Popup identifier (8 bytes)
- Skip the [`POPUP_CLOSED`](#0x2f-popup_closed) (1 byte): `0x01` to skip the notification, `0x00` else

**Return value:**

_None_

**Errors:**

- `0x10`: Invalid skip mode provided
- `0x20`: Unknown popup identifier
- `0x21`: Failed to destroy the popup
- `0xA0` to `0xBF`: Errors for custom elements
- `0xD0` to `0xEF`: Desktop environment-dependant errors

### `0x30` SEND_BASIC_NOTIFICATION

Send a basic notification, "basic" meaning a non-special notification.

**Arguments:**

Subset of a [window's state](#windows-state): title, icon, buttons.

**Return value:**

- Notification identifier (8 bytes)

**Errors:**

Relevant subset of the [`CREATE_WINDOW`](#0x10-create_window) method's errors.

### `0x31` SEND_MUSIC_PLAYER_NOTIFICATION

Send a music player notificaiton.

**Arguments:**

Same structure than for a [window's state](#windows-state), but with the following common elements:

| Header bit | Description             | Type / length in bytes             | Content                                                                    |
| ---------- | ----------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| 0          | Track's title           | [String](#delimited-title-strings) |                                                                            |
| 1          | Album's title           | [String](#delimited-title-strings) |                                                                            |
| 2          | Artist's name           | [String](#delimited-title-strings) |                                                                            |
| 3          | Album art               | [Icon](#icons)                     |                                                                            |
| 4          | Artist art              | [Icon](#icons)                     |                                                                            |
| 3          | Track's year            | 2 bytes                            |                                                                            |
| 4          | Track's date            | 4 bytes                            | Day (1 byte) ; Month (1 byte); Year (2 bytes)                              |
| 5          | Track's genre           | [String](#delimited-title-strings) |                                                                            |
| 6          | Playlist's name         | [String](#delimited-title-strings) |                                                                            |
| 7          | Progress time           | 8 bytes                            | Elapsed time in seconds (4 bytes) ; Total time in seconds (4 bytes)        |
| 8          | Pause state             | 1 byte                             | `0x01` for active playback, `0x02` for paused, `0x03` for stopped          |
| 9          | Like state              | 1 byte                             | `0x01` if liked, `0x02` if disliked, `0x00` if not liked nor disliked      |
| 10         | Codec                   | [String](#delimited-title-strings) |                                                                            |
| 11         | Frequency               | 4 bytes                            | Value in hertz (Hz)                                                        |
| 12         | Resolution              | 2 bytes                            | Value in bits                                                              |
| 13         | Bitrate                 | 4 bytes                            | Value in bits/second                                                       |
| 14         | Visualizer informations | 24 bytes                           | One byte per frequency range (see below)                                   |
| 18         | Next track's name       | [String](#delimited-title-strings) |                                                                            |
| 19         | Track position          | 8 bytes                            | Track index (4 bytes) ; Tracks in the queue (4 bytes)                      |
| 20         | Buttons availibility    | 1 byte                             | Pause/resume ; Rewind/Fast-forward ; Previous track ; Next track ; Shuffle |

The visualizer shows a value from 0 to 255 to indicate the bar eight. Each bar value corresponds to a specific frequency range. The lower frequency bound of each bar can be found with: `exponential(i / 1.88) - 1`, where `i` is the bar number, from 0 to 23.

**Return value:**

- Notification identifier (8 bytes)

**Errors:**

- `0x20`: Audio player notifications are not supported
- `0x21`: Invalid list of elements to create/update provided
- `0x30`: Client is not allowed to create/update an audio player notification
- `0x31`: Failed to create/update the notification
- `0x40`: Track's title is not a valid UTF-8 string
- `0x41`: Album's title is not a valid UTF-8 string
- `0x42`: Artist's name is not a valid UTF-8 string
- `0x70`: Invalid pause state
- `0x71`: Invalid like state
- `0x82`: Next track's title cannot be empty
- `0x83`: Next track's title is not a valid UTF-8 string
- `0x8F`: Button avaibility bit provided for unknown button
- `0xA0` to `0xBF`: Errors for custom elements
- `0xD0` to `0xEF`: Desktop environment-dependant errors

### `0x32` SEND_VIDEO_PLAYER_NOTIFICATION

Send a video player notificaiton.

**Arguments:**

Same structure than for a [window's state](#windows-state), but with the following common elements:

| Header bit | Description          | Type / length in bytes             | Content                                                                    |
| ---------- | -------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| 0          | Video's title        | [String](#delimited-title-strings) |                                                                            |
| 1          | Video's author       | [String](#delimited-title-strings) |                                                                            |
| 2          | Video's source       | [String](#delimited-title-strings) |                                                                            |
| 3          | Episode's number     | 4 bytes                            | Current episode (2 bytes) ; Total episodes in the season (2 bytes)         |
| 4          | Episode's serie name | [String](#delimited-title-strings) |                                                                            |
| 5          | Codec                | [String](#delimited-title-strings) |                                                                            |
| 6          | Bitrate              | 4 bytes                            | Value in bits/second                                                       |
| 7          | Video position       | 8 bytes                            | Video index (4 bytes) ; Videos in the queue (4 bytes)                      |
| 8          | Buttons availibility | 1 byte                             | Pause/resume ; Rewind/Fast-forward ; Previous track ; Next track ; Shuffle |

**Return value:**

- Notification identifier (8 bytes)

**Errors:**

- `0x20`: Audio player notifications are not supported
- `0x21`: Invalid list of elements to create/update provided
- `0x30`: Client is not allowed to create/update an audio player notification
- `0x31`: Failed to create/update the notification
- `0x40`: Video's title is not a valid UTF-8 string
- `0x41`: Video's author is not a valid UTF-8 string
- `0x42`: Video's source is not a valid UTF-8 string
- `0x43`: Codec is not a valid UTF-8 string
- `0xA0` to `0xBF`: Errors for custom elements
- `0xD0` to `0xEF`: Desktop environment-dependant errors

## Notifications

### `0x02` CAPABILITIES_CHANGED

Sent to clients that subscribed through the [`SUBSCRIBE_CAPABILITIES`](#0x01-subscribe_capabilities) method when the elements the desktop environment can handle changed (for instance when the taskbar is hidden, when the windows' layers become fixed, ...).

**Datafield:**

Equivalent content to the [`CAPABILITIES`](#0x02-capabilities)' answer.

### `0x10` WINDOW_CHANGED

Notification sent when a window's state changed.

Only the elements that changed since the last notification will be set in the sent window's state.

**Datafield:**

- Window identifier (8 bytes)
- [Window's state](#windows-state)

### `0x11` WINDOW_INTERACTION

Sent when the user interacts with a window. These events should not occur if the window is not [active](../../../ux/desktop-environment.md#activeinactive-windows)

**Datafield:**

- Window identifier (8 bytes)

This is followed by the interaction type on 1 byte, then by the interaction's data, which can be either:

- `0x00`: Pointing device event
  - Type (1 byte):
    - `0x00`: Pointer moved
    - `0x01`: Left click pressed
    - `0x02`: Left click released
    - `0x03`: Middle click pressed
    - `0x04`: Middle click released
    - `0x05`: Right click pressed
    - `0x06`: Right click released
  - X coordinate in pixels (2 bytes) (relative to the window's drawing zone left side)
  - Y coordinate in pixels (2 bytes) (relative to the window's drawing zone top side)

- `0x01`: Scrolling
  - Direction (1 byte):
    - `0x00`: Up
    - `0x01`: Down
    - `0x02`: Left
    - `0x03`: Right
    - `0x04`: Shake

- `0x02`: Keyboard event
  - Hold type (1 byte):
    - `0x00`: Key was pressed
    - `0x11`: Key was released
  - Key code (1 byte), normalized by the [`sys::hw`](../../services/system/hw.md) service

### `0x1F` WINDOW_CLOSED

**Datafield:**

- Window identifier (8 bytes)

### `0x20` POPUP_INTERACTION

Sent when the user selects a button in the list provided by the popup.

**Datafield:**

- Popup identifier (8 bytes)
- Callback code (1 byte)

### `0x2F` POPUP_CLOSED

Sent when a popup was closed by the end user.

**Datafield:**

- Popup identifier (8 bytes)

### `0x30` BASIC_NOTIFICATION_INTERACTION

Sent when the user interacts with a basic notification.

**Datafield:**

- Callback code (1 byte)

### `0x31` AUDIO_PLAYER_NOTIFICATION_INTERACTION

Sent when the user interacts with an audio player notification.

**Datafield:**

- Button code (1 byte):
  - `0x00`: Pause/Resume
  - `0x01`: Stop
  - `0x02`: Rewind
  - `0x03`: Fast-forward
  - `0x04`: Previous
  - `0x05`: Next
  - `0x06`: Like
  - `0x07`: Dislike
  - `0x08`: Like/dislike toggle
  - `0x09`: Shuffle

### `0x31` VIDEO_PLAYER_NOTIFICATION_INTERACTION

Sent when the user interacts with a video player notification.

**Datafield:**

- Button code (1 byte):
  - `0x00`: Pause/Resume
  - `0x01`: Stop
  - `0x02`: Rewind
  - `0x03`: Fast-forward
  - `0x04`: Previous
  - `0x05`: Next
  - `0x06`: Like
  - `0x07`: Dislike
  - `0x08`: Like/dislike toggle
  - `0x09`: Shuffle

### `0x3F` NOTIFICATION_CLOSED

Sent a notification is closed.

**Datafield:**

- Notification identifier (8 bytes)