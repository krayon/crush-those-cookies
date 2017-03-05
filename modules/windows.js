let EXPORTED_SYMBOLS = ["Windows"];

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/PrivateBrowsingUtils.jsm");

let Windows = function(Tabs, Buttons, Crusher, Prefs) {
    this.onCloseWindow = function(event) {
        let window = event.target;
        if (Services) {
            let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
            let windowsCounter = 0;
            
            while (windowsEnumerator.hasMoreElements()) {
                windowsEnumerator.getNext();
                windowsCounter++;
            }
            
            if (windowsCounter > 1 || Prefs.getValue("crushOnLastWindowClose")) {
                let domains = [];
                
                let tabBrowser = window.gBrowser;
                for (let tab of tabBrowser.tabs) {
                    let browser = tab.linkedBrowser;
                    let domain = browser.contentDocument.domain;
                    
                    domains.push(domain);
                }
                
                let immediatelyForLastWindow = windowsCounter < 2;
                Crusher.prepare(domains, immediatelyForLastWindow);
            }
            
            Tabs.clear(window);
            Buttons.clear(window);
        }
    };
    
    this.windowListener = {
        onOpenWindow: function(nsIObj) {
            let window = nsIObj.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                               .getInterface(Components.interfaces.nsIDOMWindow);
            
            let that = this;
            
            window.addEventListener("load", function() {
                window.removeEventListener("load", arguments.callee, false);
                
                if (window.document.documentElement.getAttribute("windowtype") === "navigator:browser") {
                    if (!PrivateBrowsingUtils.isWindowPrivate(window)) {
                        Tabs.init(window);
                        window.addEventListener("close", that.onCloseWindow, true);
                    }
                    
                    Buttons.init(window);
                }
            });
        }
    };
    
    this.windowListener.onOpenWindow = this.windowListener.onOpenWindow.bind(this);

    this.init = function(firstRun) {          
        let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
        
        while (windowsEnumerator.hasMoreElements()) {
            let window = windowsEnumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
            
            if (!PrivateBrowsingUtils.isWindowPrivate(window)) {
                Tabs.init(window);
            }
            
            Buttons.init(window, firstRun);
        }
        
        Services.wm.addListener(this.windowListener);
    };
    
    this.clear = function() {
        Services.wm.removeListener(this.windowListener);
        
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