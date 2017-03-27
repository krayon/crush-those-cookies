#### 1.4.0
* Fixed cookie crushing not being properly executed on browser exit.
* Removed unnecessary toolbar button tooltip state "Previously crushed..."
* Updated preferences window layout.

#### 1.3.0
* Fixed some things related to window close handling.
* Fixed tooltip text not being cleared after purging session history.
* Added large icon support for toolbar button.
* Added a slight delay for tab initialization on startup.
* Limited activity log to 25 last messages.
* Simplified activity logging and update window layout.

#### 1.2.0
* Added a shortcut to removing individual cookies dialog inside toolbar button menu.
* Added clearing activity log content when clearing browser history.
* Fixed activity log content not updating in real time when its window is open.
* Improved toolbar button's menu readability.
* Changed date format in activity log to monospace.
* Limited activity log to 100 last messages.
* Changed some minor internal things.

#### 1.1.2
* Added suspended state checking also right before cookie crushing execution.
* Provided some sanity checks for private windows.

#### 1.1.1
* Fixed broken browser exit on Linux.
* Changed some minor internal things.

#### 1.1.0
* Added basic A-Z sorting for whitelisted domains list.
* Removed auto-update support.

#### 1.0.1
* Fixed still sometimes broken toolbar button positioning.

#### 1.0.0
* Refactored some pieces of code.

#### 0.4.1
* Fixed toolbar button positioning.
* Fixed some minor internal issues.

#### 0.4.0
* Added auto-update support.
* Changed domain and subdomain checking to be less strict by default.
* Changed suspended and whitelisted toolbar button icons to be slightly darker.
* Restyled pop-up notifications.
* Removed displaying www. prefix for domains in notifications and activity log.
* Updated preferences window layout.

#### 0.3.1
* Fixed partially broken domain removal invoked from toolbar button's menu.
* Fixed some minor preferences window related issues.

#### 0.3.0
* Fixed opening multiple preferences and activity log windows.
* Fixed some other minor input related issues in preferences window.
* Added support for editing existing entries in whitelisted domains list.
* Added minimize buttons to whitelisted domains and activity log windows.
* Changed whitelisted domains and activity log windows to be non-modal on Windows.

#### 0.2.0
* Added support for crushing cookies on browser's window close.
* Added a preference to decide whether to crush cookies on browser's last window close.
* Updated preferences window layout.

#### 0.1.1
* Fixed broken toolbar button orientation on Linux.
* Changed suspended and whitelisted toolbar button icons to be brighter.

#### 0.1.0
* Fixed lacking initial toolbar button tooltip text.
* Added basic support for primitive dot and wildcard domains.
* Added support for pop-up notifications.
* Added toolbar button indication support for whitelisted domains.
* Added preferences sync support.
* Improved the way domain transition is detected.
* Changed toolbar button notification timeout to be shorter.

#### 0.0.1
* Published initial version.