# Symbolic links

_Symbolic links_, abbreviated _symlinks_, are files that point to another location.

## Concept

A symlink points to a specific item: file, folder, device, anything. It's just not a shortcut, though, as the symlink will still work if its target is moved.

When a symlink is accessed, the system will transparently access its target item instead.

When a symlink is removed, it does not affect the original target. Also, any number of symlinks can target the same item, and symlinks can target other symlinks to. When accessing a symlink, if its target item is a symlink itself, the latter's target will be accessed instead, and so on, until we do not encounter a symlink anymore.

This can be explicitly disabled when interacting with the filesystem, or limited to a specific number of children.

Also, symbolic links may point to a location on another storage.

## Cyclic symlinks

Given the following situation:

1. We create a symlink `A` which points to a random file
2. We create a symlink `B` which points to `A`
3. We update the target of `A` to be `B`

When we will try to access `A`, the system will access `B`, then `A`, then `B`, and so on. This is called a _cyclic symlink chain_. In such case, the chain is reduced to the minimum (for instance, if we had `C` pointing to `A`, the minimum chain would not be `C` `A` `B` but just `A` `B`), and marked as erroneous. The process that tried to access the symlink will receive a specific error code to indicate a cyclic symlink chain was encountered.
