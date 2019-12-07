// list for calls from content.js to enable icon
chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (typeof message === 'object' && message.type === 'showPageAction') {
            chrome.pageAction.setIcon({tabId:sender.tab.id, path:"images/icon_enabled-32.png"});
            chrome.pageAction.show(sender.tab.id);
        }
        if (typeof message === 'object' && message.type === 'hidePageAction') {
            //chrome.pageAction.setIcon({tabId:sender.tab.id, path:"icon_disabled.png"});
            chrome.pageAction.hide(sender.tab.id); 
        }
    }
);
