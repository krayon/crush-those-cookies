let EXPORTED_SYMBOLS = ["Windows"];

Components.utils.import("resource://gre/modules/Services.jsm");

let Windows = function(Tabs, Buttons, Crusher, Prefs) {
    this.onCloseWindow = function(event) {
        let domWindow = event.target;
        if (Services) {
            let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
            let windowsCounter = 0;
            
            while (windowsEnumerator.hasMoreElements()) {
                windowsEnumerator.getNext();
                windowsCounter++;
            }
            
            if (windowsCounter > 1 || Prefs.getValue("crushOnLastWindowClose")) {
                let tabBrowser = domWindow.gBrowser;
                
                let domains = [];
                
                for (let tab of tabBrowser.tabs) {
                    let browser = tab.linkedBrowser;
                    let domain = browser.contentDocument.domain;
                    
                    domains.push(domain);
                }
                
                let immediatelyForLastWindow = windowsCounter == 1;
                
                Crusher.prepare(domains, immediatelyForLastWindow);
            }
            
            Tabs.clear(domWindow);
            Buttons.clear(domWindow);
        }
    };
    
    this.windowListener = {
        onOpenWindow: function(nsIObj) {
            let domWindow = nsIObj.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                                  .getInterface(Components.interfaces.nsIDOMWindow);
            
            let that = this;
            
            domWindow.addEventListener("load", function() {
                domWindow.removeEventListener("load", arguments.callee, false);
                domWindow.setTimeout(function() {
                    if (domWindow.document.documentElement.getAttribute("windowtype") === "navigator:browser") {
                        Tabs.init(domWindow);
                        Buttons.init(domWindow);
                        
                        domWindow.addEventListener("close", that.onCloseWindow, true);
                    }
                }, 0, domWindow);
            }, false);
        }
    };
    
    this.windowListener.onOpenWindow = this.windowListener.onOpenWindow.bind(this);

    this.init = function(firstRun) {          
        let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
        
        while (windowsEnumerator.hasMoreElements()) {
            let window = windowsEnumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
            
            Tabs.init(window);
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
                window.removeEventListener("close", this.onCloseWindow);
                Tabs.clear(window);
                Buttons.clear(window);
            }
        }
    }
};