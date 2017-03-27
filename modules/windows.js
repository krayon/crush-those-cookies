let EXPORTED_SYMBOLS = ["Windows"];

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/PrivateBrowsingUtils.jsm");

let Windows = function(Tabs, Buttons, Crusher, Prefs) {
    this.onCloseWindow = function(window) {
        if (Services) {
            let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
            let windowsCounter = 0;
            
            while (windowsEnumerator.hasMoreElements()) {
                windowsEnumerator.getNext();
                windowsCounter++;
            }
            
            if (windowsCounter > 0 || Prefs.getValue("crushOnLastWindowClose")) {
                let domains = [];
                
                let tabBrowser = window.gBrowser;
                for (let tab of tabBrowser.tabs) {
                    let browser = tab.linkedBrowser;
                    let domain = browser.contentDocument.domain;
                    
                    domains.push(domain);
                }
                
                let immediatelyForLastWindow = (windowsCounter == 0);
                Crusher.prepare(domains, immediatelyForLastWindow);
            }
            
            Tabs.clear(window);
            Buttons.clear(window);
        }
    };
    
    this.onOpenWindow = function(window) {
        window.addEventListener("load", function() {
            window.removeEventListener("load", arguments.callee, false);
            
            if (window.document.documentElement.getAttribute("windowtype") == "navigator:browser") {
                if (!PrivateBrowsingUtils.isWindowPrivate(window)) {
                    Tabs.init(window);
                }
                
                Buttons.init(window);
            }
        });
    };
    
    this.windowObserver = {
        Windows: this,
        observe: function(aSubject, aTopic, aData) {
            let window = aSubject.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                                 .getInterface(Components.interfaces.nsIDOMWindow);
            
            if (aTopic == "domwindowopened") {
                this.Windows.onOpenWindow(window);
            } else if (aTopic == "domwindowclosed") {
                if (window.document.documentElement.getAttribute("windowtype") == "navigator:browser" &&
                    !PrivateBrowsingUtils.isWindowPrivate(window)) {
                    this.Windows.onCloseWindow(window);
                }
            }
        }
    };

    this.init = function(firstRun) {          
        let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
        
        while (windowsEnumerator.hasMoreElements()) {
            let window = windowsEnumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
            
            if (!PrivateBrowsingUtils.isWindowPrivate(window)) {
                Tabs.init(window);
            }
            
            Buttons.init(window, firstRun);
        }
        
        Services.ww.registerNotification(this.windowObserver);
    };
    
    this.clear = function() {
        Services.ww.unregisterNotification(this.windowObserver);
        
        let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
        
        while (windowsEnumerator.hasMoreElements()) {
            let window = windowsEnumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
            
            if (window.document.documentElement.getAttribute("windowtype") === "navigator:browser") {
                if (!PrivateBrowsingUtils.isWindowPrivate(window)) {
                    Tabs.clear(window);
                    window.removeEventListener("close", this.onCloseWindow, true);
                }
                
                Buttons.clear(window);
            }
        }
    }
};