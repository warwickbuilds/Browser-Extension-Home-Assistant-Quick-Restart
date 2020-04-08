# Home Assistant Quick Restart Browser Extension
Simple page action browser extension that allows you to quickly restart Home Assistant if an instance is detect on the active page.

Browser button will activate when a Home Assistance instance is detected in the active browser tab, and when click a configuration check will first be performed and if successful a restart will be called.

Works with local and remote network access (Nabu Casa, VPN) to Home Assistance.


## Installation

#### Chrome Webstore

[<img src="https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png">](https://chrome.google.com/webstore/detail/home-assistant-quick-rest/eoekhnolflkjbpiafambpfemogdidlch)

#### Firefox Addons

[![Firefox Add-on](https://addons.cdn.mozilla.net/static/img/addons-buttons/AMO-button_1.png)](https://addons.mozilla.org/en-US/firefox/addon/home-assistant-quick-restart)

#### Edge Add-ons - Microsoft Store

[![Edge Add-on](screenshots/edge-addon-logo.png)](https://microsoftedge.microsoft.com/addons/detail/kolacdnkhgnmbgnfcekhdnkoghneemdf)

## Using The Extension

#### Button Click

If Home Assistant is detected on the active broswer page, the buttion with become active (not grayed out), when you're ready to restart, give it a click (there is no "Are you sure", this is quick restart for a reason)

![Gif-Button Restart](https://github.com/warwickofthegh/Browser-Extension-Home-Assistant-Quick-Restart/blob/master/screenshots/gif-buttonclick.gif)

#### Keyboard Shortcuts

There is also keyboard shortcut available to save that transition time between keyboard and mouse.

Windows / Default: `Ctrl+Shift+H`

Mac: `Ctrl+Shift+H`


## How It Works

#### Tab Load
On browser tab load, extension will look for HassConnection object in session, if found button will be enabled, if not left disabled

#### Button Click

1. REST Api access_token extracted from HassConnection object, checked if valid by calling /apicheck, if invalid new token requested using refresh_token
2. Config Check performed calling REST Api, if invalid the message is shown in extension pop-up
3. Restart performed calling REST Api, status shown in extension pop-up


## Screenshots

#### Home Assistant Not Found
![HA not found on page](https://github.com/warwickofthegh/Browser-Extension-Home-Assistant-Quick-Restart/blob/master/screenshots/screenshot-nothapage.png)

#### Config Error

![Config Error](https://github.com/warwickofthegh/Browser-Extension-Home-Assistant-Quick-Restart/blob/master/screenshots/screenshot-configerror.png)

#### In Progress

![In Progress](https://github.com/warwickofthegh/Browser-Extension-Home-Assistant-Quick-Restart/blob/master/screenshots/screenshot-inprogress.png)

#### Completed

![Completed](https://github.com/warwickofthegh/Browser-Extension-Home-Assistant-Quick-Restart/blob/master/screenshots/screenshot-completed.png)



## Support
 
If you found value in this I thrive on coffee!

[<img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" >](https://www.buymeacoffee.com/ZRQ2mkM5XJp)
