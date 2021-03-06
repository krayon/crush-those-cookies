let EXPORTED_SYMBOLS = ["Tabs"];

let Tabs = function(Crusher, Buttons, Utils) {
    this.onClose = function(event) {
        let tab = event.target;
        let browser = tab.linkedBrowser;
        let domain = browser.contentDocument.domain;
        
        if (domain) {
            Crusher.prepare(domain);
        }
    };
    
    this.onTabProgress = {    
        onLocationChange: function(aBrowser, aWebProgress, aRequest, aURI, aFlag) {            
            let domain = aBrowser.contentDocument.domain;
            let previousDomain = aBrowser.previousDomain;
            
            if (previousDomain && previousDomain != domain) {
                Crusher.prepare(previousDomain);
            }
            
            aBrowser["previousDomain"] = domain;
        }
    };
    
    this.onProgress = {
        onLocationChange: function(aWebProgress, aRequest, aLocation, aFlag) {            
            Buttons.refresh();
        }
    };
    
    this.init = function(window) {
        let Tabs = this;
        Utils.setTimeout(function() {
            if (!Components.utils.isDeadWrapper(window)) {
                let tabBrowser = window.gBrowser;
                
                for (let tab of tabBrowser.tabs) {
                    let browser = window.gBrowser.getBrowserForTab(tab);
                    browser["previousDomain"] = browser.contentDocument.domain;
                }
                
                tabBrowser.tabContainer.addEventListener("TabClose", Tabs.onClose, false);
                tabBrowser.addTabsProgressListener(Tabs.onTabProgress);
                tabBrowser.addProgressListener(Tabs.onProgress);
            }
        }, 3);
    };
    
    this.clear = function(window) {
        let tabBrowser = window.gBrowser;
        
        for (let tab of tabBrowser.tabs) {
            let browser = window.gBrowser.getBrowserForTab(tab);
            browser["previousDomain"] = undefined;
        }
        
        tabBrowser.tabContainer.removeEventListener("TabClose", this.onClose, false);
        tabBrowser.removeTabsProgressListener(this.onTabProgress);
        tabBrowser.removeProgressListener(this.onProgress);
    };
};