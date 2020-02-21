# Frequently-Asked Questions

Welcome to NightOS' FAQ. Please note that several questions are already answered in the [project's README](../README.md).

## This project seems too good to be true

Well, it is in a way. NightOS can be designed as such a secure and robus O.S. because we consider there is no backward compatibility to assure - understand that existing applications from Linux, MacOS or Windows will **not be compatible with NightOS**. This is why we can afford to introduce so many new features and requirements current operating systems cannot.

The problem is that backward compatibility is absolutely mandatory when it comes to creating a general-purpose operating system. All applications would have to be developed again (in fact, they would just have to be _adapted_ for NightOS, but that's still quite a bit of work) which is of course impossible today.

This is why NightOS will probably never be completed. The current goal of this project is to build a **theorical O.S.** that demonstrates how good of an O.S. we could make if we hadn't to worry about backward compatibility.

Still, we do all we can to maintain as much compatibility as we can. For instance, we are currently investigating how existing Linux applications may be ran on NightOS, with a system call wrapper that would allow them to run correctly on the system, without compromising security, but with lacking features of course.

## What's the currente state of the project?

The project is currently in its very early stages. You can find more informations about this in the [ROADMAP](project/roadmap.md).

## Will this project replace Windows/MacOS/Linux/... one day?

No. Absolutely not. Because, as I said in sooner, it's not viable for an operating system today to just get rid of all backward compatibility with existing software, simply because what users are interested in is applications first, and **then** the system itself - is it secure, stable, performant, and so on.

Imagine someone introducing the perfect operating system, but with almost no application on it. Would you get rid of your Windows/MacOS/Linux/... system for this one? Surely not, at least not as your everyday system.

This is why this project is for now purely *theorical*. It aims to describe how great an OS could be if we did not have to care about backward compatibility. Changes to see it in a usable state one day are like very low.

## How does this project relates to NightOS [v1](https://github.com/ClementNerma/NightOS-v1), [v2](https://github.com/ClementNerma/NightOS-v2) and [v3](https://github.com/ClementNerma/NightOS-v3)?

The NightOS project is very different from the previous versions. Originally, the system intended to be a robust and secure while being written in JavaScript. Performances would of course be very bad, but it was more of a challenge than a serious project. Also, the project was meant to be a desktop environment, and use a Linux kernel under the hood to get rid of the "low-level part". I seriously lacked of knowledge about low-level concepts at this point in time.

This project does not use JavaScript anymore, but Rust, which is both performant and very robust to memory-related bugs (unless you use `unsafe` code). There is no "challenge" idea involved, only the aim to make the best possible (theorical) system.

In terms of similarities:

* The [v1](https://github.com/ClementNerma/NightOS-v1) was more of a draft, which had a lot of problems up to its roots. It was a pretty bad version overall, and was created when I did not have a real knowledge about how an operating system actually worked ;
* The [v2](https://github.com/ClementNerma/NightOS-v2) was a bit more realistic, but still far from being mature enough ;
* The [v3](https://github.com/ClementNerma/NightOS-v3) was more serious and ambitious, but it was still a desktop environment and not designed to be a full operating system

## Who are you?

My name is Clément Nerma (my last name is a pseudonym). I'm a back-end developer that loves to touch everything related to low-level things, like operating systems.

## Why did you create NightOS?

I created it as an answer to the frustration modern OSes provided me. All modern systems have many stability and security problems that cannot be resolved easily because they need to maintain backward compatibility with older pieces of software.
This is where I had the idea of creating NightOS: an operating system that is both robust (understand stable, with mechanisms to minimize data loss in case something goes wrong) and secure, with many security features available to the average user and some more complex ones for advanced users.

## How can I help?

Help is very welcome but there's not many things to help with currently, as the system is still being designed. You can still help by suggesting improvements or fixing an error (whatever it is, a design problem or a simple typo) by [submitting an issue](https://github.com/ClementNerma/NightOS/issues/new).
