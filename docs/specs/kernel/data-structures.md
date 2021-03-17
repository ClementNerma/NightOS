# Data structures

This documents describes the structures used by the kernel to represent the data it uses in memory.

## Packed linked lists

_Packed linked lists_ (PLL) are linked lists used for items whose size is both small (usually <= 32 bytes) and fixed for all items.

It uses a system of same-size entries, each containing a micro bump allocator.

The goal of a PLL is to provide a blazing fast read and iteration speed, while compromising on insertion and deletion speeds.

### Caracteristics

A PLL is caracterized by its _item size_, _length_ (the number of items in the list) and the _number of items per entry_ (NIE) (up to 255), which is the number of items which can be stored per entry. It is noted `PLL(e=<number of items per entry>[, s=<item size in bytes>][, l=<number of elements currently in the list>])`.

### Structure in memory

Each entry is a contiguous suite of bytes which can store up to `NIE` items contiguously. It starts by either a pointer to the next entry (on 8 bytes), or the number of items actually initialized in the current entry (pre-filled with zeros to be stored on 8 bytes).

For instance, let's take a `PLL(e=3, s=2, l=4)`. Its content is the four following items:

* `0xDEADBEEF`
* `0x01234567`
* `0x89ABCDEF`
* `0xBEEFDEAD`

If the first entry is located at address `0x00001000` and the second at address `0x00002000`, here is the PLL's representation in memory with big-endian representation (with `_` representing garbade data):

```
0x0000000000001000: 00 00 20 00 DE AD BE EF 01 23 45 67 89 AB CD EF
0x0000000000002000: 00 00 00 01 BE EF DE AD __ __ __ __ __ __ __ __
```

As you can see, the first entry contains the address to the next entry, followed by the content of the first three items (contiguously).  
The second entry is the last one and so simply contains the number of initialized items, followed by the last item's content, and then garbage as this memory zone is not initialized yet.

### Checking an entry's type

To check if the first byte of an entry is the next entry's address or the number of initialized items, we simply have to perform a simple comparison: if the byte is greater than `0xFF` (255 in decimal, which is the maximum allowed number of items per entry), then it's an address, else it's a number of initialized elements.

### The ratio

A PLL also has a _ratio_, which is the number of bytes reserved for items in each entry, divided by the total number of bytes. So, in our example, 3 items per entry * 4 bytes = 12 bytes, while the total number of bytes per entry also takes into account the address itself, so 12 bytes + 8 bytes = 20 : our PLL's ratio is `0.6`.

This is quite a low ratio, meaning we waste a lot of space. The ratio must be kept as near as `1.0` as possible, while maintaining a reasonable memory footprint for each entry.

### Performances bottlenecks

A thing to keep in mind is that PLL have a considerable performances bottleneck: when an entry is filled, the next must be allocated with a size that's a lot larger than a single item's size. That's why, when an entry is full, it should be allocated on the moment time is the less critical.

Performances are especially bad when inserting new items in the list or when removing ones, as many data needs to be moved around.

Regarding updating elements, this requires to write both the item itself. Inserting elements in a not-yet full entry requires to write the element itself as well as incrementing the entry's counter.

### Performance advantages

As you can see in the above bottlenecks, PLL are not meant to be performant on writings. They are meant to be fast for reads, especially sequential reads. The higher the `NIE` of the list, the fastest it will be to find an element in it, or to read every element of the list one by one (iteration).

Also, as the counter is packed with the other data of each entry, it presents a reduced risk of cache miss.

Computing the length is reasonably fast.

### Length-first variant

There is a variant of the PLL that stores the total length of the list somewhere in the memory. In that case, the first byte of the last entry does not need to store the number of items in the entry.

This variant is interesting being we can instantly get the number of items in the list, but the downside is that reading sequentially the list will also incur an additional reading to know where the last entry ends, and updating the total length incur a high risk of cache fault as the chances of the memory area where the length is as well as the entry itself be in the cache at the same time are pretty low.

The length-first variant should only be used when accessing the length instantly is critical.

### Tricking the `NIE`

Increasing the NIE will:

- Reduce the needs of allocating
- Speed up iteration times
- Speed up insertion times when the last entry isn't full

But also:

- Increase the memory cost of the last entry when it isn't full
- Slow down insert times when the last entry is full (needs to allocate)

## Timestamps

Timestamps are stored as milliseconds, starting from January 1st, 1970. This is to guarantee interopability with existing algorithms using Unix's EPOCH constant.

They are represented as an 8-byte unsigned integer number.

## Simple lists

Simple lists are made of:

- Their length in bytes (8 bytes)
- Their content

Each element must be delimited.

## Delimited strings

Delimited strings are made of:

- Their length in bytes (8 bytes)
- Their content (UTF-8 encoded)

## Bitmap images

Bitmap images are represented as a _header_ and a _pixel list_.

The header is composed as a suite of 8 bytes:

- Image width (IW), in pixels (2 bytes)
- Image height (IH), in pixels (2 bytes)
- Number of colors (power of 256) for the red channel (NR), `0` if unused (1 byte)
- Number of colors (power of 256) for the green channel (NG), `0` if unused (1 byte)
- Number of colors (power of 256) for the blue channel (NB), `0` if unused (1 byte)
- Number of colors (power of 256) for the alpha channel (NA), `0` if unused (1 byte)

The pixel list is made of the data for each pixel, contiguously.

Each pixel is encoded as follows:

- Value for the red channel (NR bytes)
- Value for the green channel (NG bytes)
- Value for the blue channel (NB bytes)
- Value for the alpha channel (NA bytes)

As shown above, if the number of colors is set to `0` for a specific channel in the header, it must not be contained in the pixel's content. The number of bytes used for each channel of a pixel is equal to the number provided for this specific channel in the header, allowing for `256 power <number in the header>` different colors.

Pixels are listed from the top left corner of the image to the bottom right corner. They are always square.

The size of pixel list can be calculated as `IW * IH * (NR + NG + NB + NA)` bytes. Add another 8 bytes for the header.