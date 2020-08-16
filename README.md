# NightOS

![NightOS Logo](logo.png)

NightOS is an general-purpose operating system aiming to provide maximum security to the average user.

## Documentation

Design and specification documents can be found in the [`docs`](docs/) directory.

## How does it work?

The project is composed of three distinct parts: the kernel, the system, and the desktop environment.

The first one is the part that allows the software to access the hardware, like writing files to the disk or making network requests. It's a microkernel, meaning it's easier to maintain and has a reduced attack surface for potential security issues than a monolithic kernel like Linux.
In its early stages though, we will use a the Linux kernel as a base, and the microkernel will be last "brick" to the project.

The system is the higher-level component that deals with everything that is not directly related to hardware or graphical interface. For instance, applications, user accounts and permissions are all managed by the system. It's a read-only part the user cannot modify by itself.

The desktop environment, finally, is the part the user sees when launching NightOS. It noteably contains the status bar, the windows manager, the notifications panel, and all graphical-related things.

The goal of NightOS is to provide an operating system that is far more **secure, robust and performant** than existing systems, and this for all users.

## What? Another O.S.? Why?

The problem with current OSes like Windows, Linux or MacOS is they were built on bad roots. At the time they were created, security wasn't a concern like today, and computers weren't nearly as powerful as they are now. Which means a lot of things we have to deal with today in order to maintain a good level of security or performance isn't met at all with these systems, because they can't just be rewritten from scratch or break compatibility with older pieces of software.

NightOS, on its side, starts from a blank page. There is no compatibility to maintain on the software level, and everything is designed from the start to be future-proof, meaning it will be easy to add new security features for instance, without breaking any software compatibility.

## I have more questions!

Most frequent questions are answered [here](docs/FAQ.md). Feel free to [open an issue](https://github.com/ClementNerma/NightOS/issues/new) if you have additional questions!

## License

This project is released under the [Apache-2.0](LICENSE.md) license terms.

## Credits

The [project's logo](logo.png) was created using a night sky picture from [Joe Parks](https://www.flickr.com/people/34450190@N08), who owns the original image's rights.
You can find the original photo [here](https://www.flickr.com/photos/parksjd/9253056182/).
