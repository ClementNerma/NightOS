# Cloudy

While the system and main data can be backed up using [TimeTravel](TimeTravel.md), it's not always handy to manage backups on an external hard drive and keep it safe.

This is where Cloudy comes: it allows to synchronize data on the cloud, using a master password which is stored nowhere but in the user's mind.

## How it works

In order to work, Cloudy needs a storage account where it can store its data. Multiple providers are supported: Dropbox, Google Drive, Amazon AWS, SFTP storages, etc.

It will then store all data on this account, in a dedicated folder (the path can be customized). All data will be encrypted by a _master password_ prompted when the application is opened for the first time, so no one will be able to access these date except the user who set it up itself.

## Integration

Applications can ask to store and synchronize their own data through Cloudy. They will not be able to access any other application's data, though.

## Collected data

The data that can be backup-ed and synchronized by Cloudy are:

- User's settings, computer's settings if the user is administrator
- Installed applications and their data
- Applications can ask to store additional custom data (e.g. a password manager)

## Synchronization

The synchronization process has two parts:

- The **up-sync** process, which sends new data to the cloud ;
- The **down-sync** process, which reflects these changes on the local computer

Up-sync can be performed manually at anytime, or scheduled to be performed frequently. It's also possible to ask, for instance, to update the list of applications when a new one is installed or removed, while only backuping applications' data once a day.

Down-sync can be performed anytime, and a preview will show which items will be restored and what will be overridden. It's possible to only restore a few items. By default, down-sync will be performed in real-time: as soon as an up-sync process is performed, down-sync will happen on every other computer of the synchronization chain.

## Synchronization chain

Data are synchronized through all computers of a single _synchronization chain_, which is simply a set of computers. Synchronization happens per user, which is why Cloudy doesn't backup every user of the computer, but only the one synchronization is enabled on. Of course, every user can enable synchronization for its account.

When a user enabled Cloudy for its account, it must connect with a NightOS account, and it is then added to the synchronization chain consisting of every computer having Cloudy enabled with this NightOS account.

For down-sync to happen, the username must be on the receiving computers than on the upload computer, else a specific setting will need to be changed in Cloudy.
