# Foreword

## Welcome!

Welcome to NightOS' documentation! This book will show you how the system is designed, how it works, and all the little things it can offer to the end user as well as the features availables for application developers.

**Before reading this documentation, please note that** I'm developing this project on my own and I'm by no mean an operating system expert. I do not even as a professional low-level developer though I have some knowledge on how low-level software and hardware work to some extent.

This means there are surely many flaws in the very low-level aspects, especially in the microkernel, like the way hardware devices are handled and mapped in memory. If you find a flaw, feel free to fill an [issue](https://github.com/ClementNerma/NightOS/issues/new).

The main point of this project is the many middle-level/high-level aspects, not the very low-level ones which will take quite a lot of time to design completely and surely require the knowledge of people more experimented in this field than I am.

On the other hand, specification documents are not like specification documents you may have seen from, let's say, WhatWG or other consortiums. As NightOS is only a prototypal O.S., the documents you will find here are meant to be easily understandable. Specification documents are meant to describe completely a specific concept or part of the system, but without being hard to read. Some will argue it's not close enough to a "real" specification, but I think it's enough for now, regarding the very early state of the project.

Also, this project is far from being finished, so many things are still missing from the documentation. I frequently add new design documents and complete existing ones, but feel free to create a new issue if you think something should be added to the project :)

By the way, you can also find answers to the most [frequently-asked questions here](FAQ.md).

## What is NightOS?

NightOS is an operating system aiming to replace ancient systems like Windows, Linux or MacOS. Well, this is the _ideal_ goal but given how much Windows/Linux/MacOS and other systems are deeply installed in today's computers, NightOS is more of a theorical operating system that shows what we could get if we hadn't to maintain legacy compatibility with ancient architectures.

## What? Another O.S.? Why?

The problem with current OSes like Windows, Linux or MacOS is they were built on bad roots. At the time they were created, security wasn't a concern like today, and computers weren't nearly as powerful as they are now. Which means a lot of things we have to deal with today in order to maintain a good level of security or performance isn't met at all with these systems, because they can't just be rewritten from scratch or break compatibility with older pieces of software.

NightOS, on its side, starts from a blank page. There is no compatibility to maintain on the software level, and everything is designed from the start to be future-proof, meaning it will be easy to add new security features for instance, without breaking any software compatibility.

## What's the project's structure?

The project is composed of three distinct parts: the kernel, the system, and the desktop environment.

The first one is the part that allows the software to access the hardware, like writing files to the disk or making network requests. It's a microkernel, meaning it's easier to maintain and has a reduced attack surface for potential security issues than a monolithic kernel like Linux.
In its early stages though, we will use a the Linux kernel as a base, and the microkernel will be last "brick" to the project.

The system is the higher-level component that deals with everything that is not directly related to hardware or graphical interface. For instance, applications, user accounts and permissions are all managed by the system. It's a read-only part the user cannot modify by itself.

The desktop environment, finally, is the part the user sees when launching NightOS. It noteably contains the status bar, the windows manager, the notifications panel, and all graphical-related things.

The goal of NightOS is to provide an operating system that is far more **secure, robust and performant** than existing systems, and this for all users.

## What license is this project distributed under?

The NightOS project uses the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).
