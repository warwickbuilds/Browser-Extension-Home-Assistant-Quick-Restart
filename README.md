# Home Assistant Quick Restart Browser Extension
Simple page action browser extension that allows you to quickly restart Home Assistant if an instance is detect on the active page.

If button is active a Home Assistant instance has been detected and when click a configuration check will first be performed and if successful a restart will be called.

- Only tested with HASSio via direct access or Nuba Casa remote link (Let me know if it works/doesn't work with other access method and Home Assistant)

## Using Extension

### Button Click

If Home Assistant is detected on the active broswer page, the buttion with become active (not grayed out), when you're ready to restart, give it a click (there is no "Are you sure", this is quick restart for a reason)

![Gif-Button Restart](https://github.com/warwickofthegh/Browser-Extension-Home-Assistant-Quick-Restart/blob/master/screenshots/gif-buttonclick.gif)

### Keyboard Shortcut

There is also keyboard shortcut available to save that transition time between keyboard and mouse.

Windows / Default: `Ctrl+Shift+H`

Mac: `Ctrl+Shift+H`

## Installation

### Chromium Basesed Browser (Chrome / Edge / Brave)

[<img src="https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png">](https://chrome.google.com/webstore/detail/home-assistant-quick-rest)

### Firefox

[![Firefox Add-on](https://addons.cdn.mozilla.net/static/img/addons-buttons/AMO-button_1.png)](https://addons.mozilla.org/en-US/firefox/addon/home-assistant-quick-restart)

## Screenshots

### Home Assistant Not Found
![HA not found on page](https://github.com/warwickofthegh/Browser-Extension-Home-Assistant-Quick-Restart/blob/master/screenshots/screenshot-nothapage.png)

### Config Error

![Config Error](https://github.com/warwickofthegh/Browser-Extension-Home-Assistant-Quick-Restart/blob/master/screenshots/screenshot-configerror.png)

### In Progress

![In Progress](https://github.com/warwickofthegh/Browser-Extension-Home-Assistant-Quick-Restart/blob/master/screenshots/screenshot-inprogress.png)

### Completed

![Completed](https://github.com/warwickofthegh/Browser-Extension-Home-Assistant-Quick-Restart/blob/master/screenshots/screenshot-completed.png)
