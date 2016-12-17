let EXPORTED_SYMBOLS = ["Buttons"];

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/PrivateBrowsingUtils.jsm");

let Buttons = function(extName, Prefs, Whitelist, Utils) {
    this.contentURL = "chrome://" + extName + "/content/";
    
    this.iconFileNames = {
        normal: "toolbar_icon.png",
        suspended: "toolbar_icon_suspended.png",
        crushed: "toolbar_icon_crushed.png",
        whitelisted: "toolbar_icon_whitelisted.png"
    };
    
    this.xulDocFileNames = {
        prefs: "prefs.xul",
        log: "log.xul"
    };
    
    this.buttonId = "ctcButton";
    this.buttonLabel = "Crush Those Cookies";
    
    this.tooltipTexts = {
        initial: "Didn't crush any cookies yet",
        suspended: "Suspended",
        crushed: "Recently crushed cookies from ",
        notCrushed: "Previously crushed cookies from ",
        privateWindow: "Private window omitted"
    };
    
    this.menuitemIds = {
        suspendResume: "ctcSuspendResume",
        whitelistAddRemove: "ctcWhitelistAddRemove",
        manageWhitelist: "ctcManageWhitelist",
        removeIndividual: "ctcRemoveIndividual",
        viewLog: "ctcViewLog"
    };
    
    this.menuitemLabels = {
        suspend: "Suspend crushing cookies",
        resume: "Resume crushing cookies",
        add: "Add ",
        addEnding: " to whitelist",
        remove: "Remove ",
        removeEnding: " from whitelist",
        addRemoveNoDomain: "Current document has no domain",
        privateWindow: "No action for a private window",
        manageWhitelist: "Manage whitelisted domains",
        removeIndividual: "Remove individual cookies",
        log: "Show activity log"
    };
        
    this.menupopupId = "ctcMenupopup";
    
    this.styleSheetId = "ctcStyle";
    
    this.notificationIconTimeout = 5;
    
    this.init = function(window, firstRun) {
        let document = window.document;
        
        if (document.getElementById(this.buttonId)) {
            return; // button already exists
        }
        
        // create button element
        let button = document.createElement("toolbarbutton");
        button.setAttribute("id", this.buttonId);
        button.setAttribute("label", "Crush Those Cookies");
        button.setAttribute("type", "menu");
        button.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
        button.setAttribute("tooltiptext", this.tooltipTexts.initial);
        button.style.listStyleImage = "url(" + this.contentURL + 'large_' + this.iconFileNames.normal + ")";
        button.style.MozBoxOrient = "inherit";
        
        button.setAttribute("state", "1");
        
        let rules = [];
        rules[0] = '                                                                                                        \
            #' + this.buttonId + '[state="1"] {                                                                             \
                list-style-image: url("' + this.contentURL + 'large_' + this.iconFileNames.normal + '") !important;         \
            }                                                                                                               \                                                                                                 \
        ';
        rules[1] = '                                                                                                        \
            #' + this.buttonId + '[state="2"] {                                                                             \
                list-style-image: url("' + this.contentURL + 'large_' + this.iconFileNames.suspended + '") !important;      \
            }                                                                                                               \                                                                                                \
        ';
        rules[2] = '                                                                                                        \
            #' + this.buttonId + '[state="3"] {                                                                             \
                list-style-image: url("' + this.contentURL + 'large_' + this.iconFileNames.crushed + '") !important;        \
            }                                                                                                               \                                                                                                \
        ';
        rules[3] = '                                                                                                        \
            #' + this.buttonId + '[state="4"] {                                                                             \
                list-style-image: url("' + this.contentURL + 'large_' + this.iconFileNames.whitelisted + '")  !important;   \
            }                                                                                                               \                                                                                                \
        ';
        rules[4] = '                                                                                                        \
            toolbar[iconsize="small"] #' + this.buttonId + '[state="1"] {                                                   \
                list-style-image: url("' + this.contentURL + this.iconFileNames.normal + '") !important;                    \
            }                                                                                                               \                                                                                                \
        ';
        rules[5] = '                                                                                                        \
            toolbar[iconsize="small"] #' + this.buttonId + '[state="2"] {                                                   \
                list-style-image: url("' + this.contentURL + this.iconFileNames.suspended + '") !important;                 \
            }                                                                                                               \                                                                                                \
        ';
        rules[6] = '                                                                                                        \
            toolbar[iconsize="small"] #' + this.buttonId + '[state="3"] {                                                   \
                list-style-image: url("' + this.contentURL + this.iconFileNames.crushed + '") !important;                   \
            }                                                                                                               \                                                                                           \
        ';
        rules[7] = '                                                                                                        \
            toolbar[iconsize="small"] #' + this.buttonId + '[state="4"] {                                                   \
                list-style-image: url("' + this.contentURL + this.iconFileNames.whitelisted + '") !important;               \
            }                                                                                                               \                                                                                             \
        ';
        
        let style = document.createElementNS("http://www.w3.org/1999/xhtml", "style");
        style.setAttribute("type", "text/css");
        style.setAttribute("id", this.styleSheetId);
        document.documentElement.appendChild(style);
        
        for (let rule of rules) {
            style.sheet.insertRule(rule, style.sheet.cssRules.length);
        }
        
        let Buttons = this;
        
        // create menuitems
        let menuitemSuspendResume = document.createElement("menuitem");
        menuitemSuspendResume.setAttribute("id", this.menuitemIds.suspendResume);
        menuitemSuspendResume.addEventListener("command", function(event) {
            if (Prefs.getValue("suspendCrushing")) {
                Prefs.setValue("suspendCrushing", false);
            } else {
                Prefs.setValue("suspendCrushing", true);
            }
            
            Prefs.save();
            Buttons.refresh();
        }, false);
        
        let menuitemWhitelistAddRemove = document.createElement("menuitem");
        menuitemWhitelistAddRemove.setAttribute("id", this.menuitemIds.whitelistAddRemove);
        menuitemWhitelistAddRemove.addEventListener("command", function(event) {
            let window = Services.wm.getMostRecentWindow("navigator:browser");
            let domain = window.gBrowser.contentDocument.domain;
            
            if (domain) {
                let rawDomain = Utils.getRawDomain(domain);
                
                let whitelisted = Whitelist.isWhitelisted(rawDomain);
                
                if (whitelisted) {
                    if (typeof whitelisted === "string") {
                        rawDomain = whitelisted;
                    }
                    
                    Whitelist.removeDomain(rawDomain);
                } else {
                    Whitelist.addDomain(rawDomain);
                }
                
                Buttons.refresh();
            }
        }, false);
        
        let menuitemManageWhitelist = document.createElement("menuitem");
        menuitemManageWhitelist.setAttribute("id", this.menuitemIds.manageWhitelist);
        menuitemManageWhitelist.setAttribute("label", this.menuitemLabels.manageWhitelist);
        menuitemManageWhitelist.addEventListener("command", function(event) {
            let existingWindow = Services.wm.getMostRecentWindow("ctcPrefsWindow");
            if (existingWindow) {
                existingWindow.focus();
            } else {
                let window = Services.wm.getMostRecentWindow("navigator:browser");
                window.openDialog(Buttons.contentURL + Buttons.xulDocFileNames.prefs, "", "minimizable,centerscreen", "whitelist");
            }
        }, false);
        
        let menuitemRemoveIndividual = document.createElement("menuitem");
        menuitemRemoveIndividual.setAttribute("id", this.menuitemIds.removeIndividual);
        menuitemRemoveIndividual.setAttribute("label", this.menuitemLabels.removeIndividual);
        menuitemRemoveIndividual.addEventListener("command", function(event) {
            let window = Services.wm.getMostRecentWindow("navigator:browser");
            let domain = window.gBrowser.contentDocument.domain;
            
            let params = null;
            
            if (domain) {
                let rawDomain = Utils.getRawDomain(domain);
                params = {filterString: rawDomain};
            }
            
            let existingWindow = Services.wm.getMostRecentWindow("Browser:Cookies");
            if (existingWindow) {
                existingWindow.focus();
            } else {
                let window = Services.wm.getMostRecentWindow("navigator:browser");
                window.openDialog("chrome://browser/content/preferences/cookies.xul", "Browser:Cookies",
                                  "minimizable,centerscreen", params);
            }
        }, false);
        
        let menuitemViewLog = document.createElement("menuitem");
        menuitemViewLog.setAttribute("id", this.menuitemIds.viewLog);
        menuitemViewLog.setAttribute("label", this.menuitemLabels.log);
        menuitemViewLog.addEventListener("command", function(event) {
            let existingWindow = Services.wm.getMostRecentWindow("ctcLogWindow");
            if (existingWindow) {
                existingWindow.focus();
            } else {
                let window = Services.wm.getMostRecentWindow("navigator:browser");
                window.openDialog(Buttons.contentURL + Buttons.xulDocFileNames.log, "", "minimizable,centerscreen");
            }
        }, false);
        
        // create menupopup element
        let menupopup = document.createElement("menupopup");
        menupopup.setAttribute("id", this.menupopupId);
        menupopup.addEventListener("popupshowing", function(event) {
            let window = Services.wm.getMostRecentWindow("navigator:browser");
            let document = window.document;
            
            let menuitemSuspendResume = document.getElementById(Buttons.menuitemIds.suspendResume);
            menuitemSuspendResume.setAttribute("label", Prefs.getValue("suspendCrushing") ?
                                                        Buttons.menuitemLabels.resume :
                                                        Buttons.menuitemLabels.suspend);
            
            let menuitemWhitelistAddRemove = document.getElementById(Buttons.menuitemIds.whitelistAddRemove);
            
            if (PrivateBrowsingUtils.isWindowPrivate(window)) {
                menuitemWhitelistAddRemove.setAttribute("disabled", "true");
                menuitemWhitelistAddRemove.setAttribute("label", Buttons.menuitemLabels.privateWindow);
            } else {
                let domain = window.gBrowser.contentDocument.domain;
                
                if (domain) {
                    let rawDomain = Utils.getRawDomain(domain);
                    
                    let whitelisted = Whitelist.isWhitelisted(rawDomain);
                    
                    if (whitelisted) {
                        if (typeof whitelisted === "string") {
                            rawDomain = whitelisted;
                        }
                        
                        menuitemWhitelistAddRemove.setAttribute("disabled", "false");
                        menuitemWhitelistAddRemove.setAttribute("label", Buttons.menuitemLabels.remove +
                                                                         rawDomain +
                                                                         Buttons.menuitemLabels.removeEnding);
                    } else {
                        menuitemWhitelistAddRemove.setAttribute("disabled", "false");
                        menuitemWhitelistAddRemove.setAttribute("label", Buttons.menuitemLabels.add +
                                                                         rawDomain +
                                                                         Buttons.menuitemLabels.addEnding);
                    }
                } else {
                    menuitemWhitelistAddRemove.setAttribute("disabled", "true");
                    menuitemWhitelistAddRemove.setAttribute("label", Buttons.menuitemLabels.addRemoveNoDomain);
                }
            }
            
            let menuitemViewLog = window.document.getElementById(Buttons.menuitemIds.viewLog);
            menuitemViewLog.setAttribute("disabled", !Prefs.getValue("enableLogging"));
        }, false);
        
        let menuseparator1 = document.createElement("menuseparator");
        let menuseparator2 = document.createElement("menuseparator");
        
        // append menuitems to the menupopup
        menupopup.appendChild(menuitemSuspendResume);
        menupopup.appendChild(menuseparator1);
        menupopup.appendChild(menuitemWhitelistAddRemove);
        menupopup.appendChild(menuitemManageWhitelist);
        menupopup.appendChild(menuseparator2);
        menupopup.appendChild(menuitemRemoveIndividual);
        menupopup.appendChild(menuitemViewLog);
        
        // append menupopup to the button
        button.appendChild(menupopup);
        
        // append the button to customization palette
        // this seems to be required even if the button will be placed elsewhere
        let navigatorToolbox = document.getElementById("navigator-toolbox");
        navigatorToolbox.palette.appendChild(button);
        
        let toolbarButtonPlaceId = Prefs.getValue("toolbarButtonPlaceId");
        let toolbarButtonPosition = Prefs.getValue("toolbarButtonPosition");
        
        if (toolbarButtonPlaceId != "") {
            if (firstRun) {
                // if it's the first run then just append the button at the end of the nav-bar
                let navBar = document.getElementById("nav-bar");
                navBar.insertItem(this.buttonId);
                
                // get button's position
                let buttonsArray = navBar.currentSet.split(",");
                let buttonPosition = buttonsArray.indexOf(this.buttonId) + 1;
                
                // update button's position in preferences and save it
                Prefs.setValue("toolbarButtonPosition", buttonPosition);
                Prefs.save();
            } else {
                // temporary check for compatibility with previous version
                if (toolbarButtonPosition < 0) {
                    toolbarButtonPlaceId = "addon-bar";
                    toolbarButtonPosition = -toolbarButtonPosition;
                    
                    // update button's place id and position in preferences and save it
                    Prefs.setValue("toolbarButtonPlaceId", toolbarButtonPlaceId);
                    Prefs.setValue("toolbarButtonPosition", toolbarButtonPosition);
                    Prefs.save();
                }
                
                let someBar = document.getElementById(toolbarButtonPlaceId);
                if (someBar) {
                    let buttonsArray = someBar.currentSet.split(",");
                    let before = null;
                    
                    for (let i = toolbarButtonPosition - 1; i < buttonsArray.length; i++) {
                        before = document.getElementById(buttonsArray[i]);
                        if (before) {
                            break;
                        }
                    }
                    
                    someBar.insertItem(this.buttonId, before);
                }
            }
        }
        
        this.afterCustomization = this.afterCustomization.bind(this);
        
        window.addEventListener("aftercustomization", this.afterCustomization, false);

        this.refresh();
    };
    
    this.afterCustomization = function(event) {
        let navigatorToolbox = event.target;
        let window = navigatorToolbox.ownerDocument.defaultView;
        
        let button = window.document.getElementById(this.buttonId);
        
        let newToolbarButtonPlaceId = "";
        let newToolbarButtonPosition = 0;
        
        if (button) {
            let buttonParent = button.parentNode;
            if (buttonParent.currentSet && buttonParent.id) {
                // get new button's place id
                newToolbarButtonPlaceId = buttonParent.id;
                
                // get new button's position
                let buttonsArray = buttonParent.currentSet.split(",");
                newToolbarButtonPosition = buttonsArray.indexOf(this.buttonId) + 1;
            }
        }
        
        // update button's place id and position in preferences and save them
        Prefs.setValue("toolbarButtonPlaceId", newToolbarButtonPlaceId);
        Prefs.setValue("toolbarButtonPosition", newToolbarButtonPosition);
        Prefs.save();
    };
    
    this.notify = function(crushedDomainsString) {
        if (Prefs.getValue("toolbarButtonPlaceId") == "") {
            return;
        }
        
        let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
        
        while (windowsEnumerator.hasMoreElements()) {
            let window = windowsEnumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
            let button = window.document.getElementById(this.buttonId);
            
            if (!button) {
                continue;
            }
            
            let Buttons = this;
            
            if (crushedDomainsString) {
                button.setAttribute("tooltiptext", this.tooltipTexts.crushed + crushedDomainsString);
                button.setAttribute("state", "3");
                
                Utils.setTimeout(function() {
                    Buttons.refresh(window);
                }, Buttons.notificationIconTimeout);
            } else {
                let buttonOldTooltipText = button.getAttribute("tooltiptext");
                
                // old tooltip text started with "Recently", change it to "Previously (...)";
                if (buttonOldTooltipText.substr(0, 1) == "R") {
                    button.setAttribute("tooltiptext", this.tooltipTexts.notCrushed +
                                                       buttonOldTooltipText
                                                       .substr(this.tooltipTexts.crushed.length,
                                                               buttonOldTooltipText.length));
                }
            }
        }
    };
    
    this.refresh = function(window) {
        if (Prefs.getValue("toolbarButtonPlaceId") == "") {
            return;
        }
        
        if (window) {
            this.refreshForWindow(window);
        } else {
            let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
            
            while (windowsEnumerator.hasMoreElements()) {
                let window = windowsEnumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
                
                this.refreshForWindow(window);
            }
        }
    };
    
    this.refreshForWindow = function(window) {
        let button = window.document.getElementById(this.buttonId);        
        
        if (button) {
            if (Prefs.getValue("suspendCrushing")) {
                button.setAttribute("tooltiptext", this.tooltipTexts.suspended);
                button.setAttribute("state", "2");
            } else if (PrivateBrowsingUtils.isWindowPrivate(window)) {
                button.setAttribute("tooltiptext", this.tooltipTexts.privateWindow);
                button.setAttribute("state", "4");
            } else {
                let domain = window.gBrowser.contentDocument.domain;
                let rawDomain = Utils.getRawDomain(domain);
            
                if (!rawDomain || Whitelist.isWhitelisted(rawDomain)) {
                    button.setAttribute("state", "4");
                } else {
                    button.setAttribute("state", "1");
                }
                
                let buttonOldTooltipText = button.getAttribute("tooltiptext");
        
                if (buttonOldTooltipText.substr(0, 1) == "S") {
                    button.setAttribute("tooltiptext", this.tooltipTexts.initial);
                }
            }
        }
    };
    
    this.clear = function(window) {
        let button = window.document.getElementById(this.buttonId);
        
        if (button) {
            button.parentNode.removeChild(button);
        }
        
        let css = window.document.getElementById(this.styleSheetId);
        if (css) {
            css.parentNode.removeChild(css);
        }
        
        let navigatorToolbox = window.document.getElementById("navigator-toolbox");
        
        // customization palette seems to be beyond DOM document
        // so just try to remove it the hard way
        for (let nodeIndex in navigatorToolbox.palette.childNodes) {
            let childNode = navigatorToolbox.palette.childNodes[nodeIndex];
            
            if (childNode && childNode.id == this.buttonId) {
                navigatorToolbox.palette.removeChild(childNode);
            }
        }
        
        window.removeEventListener("aftercustomization", this.afterCustomization, false);
    };
    
    this.onPrefsApply = function() {
        this.refresh();
    };
    
    this.clearTooltipText = function() {
        let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
        while (windowsEnumerator.hasMoreElements()) {
            let window = windowsEnumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
            let button = window.document.getElementById(this.buttonId);
            if (button) {
                button.setAttribute("tooltiptext", this.tooltipTexts.initial);
            }
        }
    };
};