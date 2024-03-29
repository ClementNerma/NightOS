# ShootingStar

ShootingStar is the default pictures viewer and editor of NightOS. Edition is limited to simple manipulations such as cropping and resizing.

## Library usage

ShootingStar exposes the `sys::shootingstar` library to manipulate, perform basic manipulations and most of all render different image formats.

It can also be used by [file managers](../specs/services/integration/file-managers.md) to generate [thumbnails](../specs/services/integration/file-managers.md#0x2000-get_thumbnail) and [video previews](../specs/services/integration/file-managers.md#0x2100-get_video_preview).

## Supported formats

- Joint Photographic Experts Group (`.jpg`, `.jpeg`)
- Joint Photographic Experts Group 2000 (`.jp2`, `.jpx`)
- Tagged Image File Format (`.tiff`, `.tif`)
- Graphics Interchange Format (`.gif`)
- Graphics Interchange Format Video (`.gifv`)
- AV1 Image File Format (`.avif`)
- Windows Bitmap (`.bmp`)
- NightOS [Bitmap Image](../specs/kernel/data-structures.md#bitmap-images) (`.nbi`)
- NightOS [Bitmap Video](../specs/kernel/data-structures.md#bitmap-videos) (`.nbv`)
- Portable Networks Graphics (`.png`)
- Portable Pixmap Format (`.ppm`)
- Portable Graymap Format (`.pgm`)
- Portable Bitmap Format (`.pbm`)
- Windows Icon (`.ico`)

## Viewer features

- View pictures
- Zoom in/out
- Fullscreen
- Fit image to width / height / both
- Put images side by side
- View a set of pictures as a gallery
- View a set of pictures as a slideshow (multiple possible transitions)
- Display EXIF metadata

## Edition features

- Resize (keep or ignore ratio)
- Crop
- Edit/remove EXIF metadata
- Convert to black and white
