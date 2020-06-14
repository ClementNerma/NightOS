# Parental Control

_Parental control_ allows to manage a child's access to a computer running NightOS.

## How it works

Parental control works using (at least) two accounts: the parent's account, and the child's user account, which is related to as a _child user_. Note that multiple child users can be managed using parental control.

The parent account then gets access to an application called "Parental Control", which allows to access all parental control-related features for each child user.

It is also possible to get important notifications by email, and even to install a smartphone application (iOS/Android) which brings the parental control application to phones, allowing to manage child users even when not at home.

## Integration

Parental control's settings are available to third-party applications using specific permissions. This way, some applications can provide an additionally layer of security for child users, like preventing access to adult contents in a game store.

## Features

### Restrict usage hours

This feature allows to restrict usage of the computer by the child user during specific hours in the day.
These hours can be set independently for each day of the week, allowing for instance to set specific hours in the week-end.
It's also possible to set specific hours for some specific weeks or periods of times (e.g. for four specific days in a row), allowing for instance to set specific hours for vacations.

Child user will not be able to log in outside of these hours. If they are logged in when the upper limit is reached (e.g. only 8 AM to 9 AM is allowed and the child user is still logged in as 9 AM), a warning message will be shown 15 minutes before reaching the time limit, 5 minutes before, and 1 minute before, allowing the child to save its data.

When this final minute comes, a pop-up shows telling the session is going to be closed in 60 seconds, and a cooldown is shown in a closable pop-up balloon in the taskbar. An option is also shown to extend the session by up to fifteen minutes, sending a notification to the parent's phone as well as an e-mail.

The parent can then do nothing and the session will extend for a maximum of fifteen minutes, or reject it and the computer will shut down after 1 minute. Then another option shows to ask if the parent wants to permanently disable time extension.

Session time extension can be enabled/disabled during the parental control installation process (enabled by default). If disabled, the time extension option will not be shown to the child user during the timeout.

### Restrict session duration

This feature allows to restrict how much time a session can be active, allowing for instance to limit a child user's usage to one hour per day. Like the usage hours, it can be set independently for each day of the week, for specific weeks, and for specific periods.

Session time extension applies here as well, and works the same way as for restricted usage hours. The related settings are independent though, allowing for instance to enable session time extension for usage hours but not for session duration, or the opposite.

### Restrict access to applications

This feature restricts access to some applications, either using a whitelist (listing all the _allowed_ applications), or using a blacklist (listing all the _forbidden_ applications).

It's possible to automatically while/black-list new applications.

### Restrict access to websites

This feature restricts access to some websites, either using a whitelist or a blacklist. It's also possible to apply these restrictions only to compatible web browsers. Whitelist is strongly discouraged outside of web browsers-only usage, as it may prevent some applications to work properly.

Whenever an application tries to access a forbidden website, the request will fail with a specific code indicating it's forbidden by parental control. Applications can still enforce this rule but this requires a specific permission that cannot be allowed by child users.

These restrictions are enabled through the built-in firewall, [Vortex](../applications/Vortex.md).

### Restrict mature contents

The child user's birth date can be declared during setup, so its age (not its birth date) will be available to every application which asks for it (with a specific permission, which is by default automatically granted to all applications which ask it).

This allows, for instance, for web browsers to block websites that declare themselves as showing adult contents. Or even more precise protection, like a movies store not showing movies whom age limit is beyond the child user's age.

### Restrict installation of applications

This feature prevents child users from installing and running volatile applications.
By default, installation is allowed but sends a notification to the parent user asking if the child user is allowed to install the requested application ; while running volatile applications is simply disabled.

### Controlling session remotely

This feature allows parents to log out the child user remotely. This will show a pop-up indicating the session will be closed in 60 seconds, behaving just like usage hours restriction. It may also provide session time extension based on how the log out was triggered (log out the child user _or_ log out the child user and disable session time extension) and the setting selected during the setup process.
