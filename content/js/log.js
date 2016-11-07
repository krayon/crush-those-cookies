let EXPORTED_SYMBOLS = ["Log"];

Components.utils.import("resource://gre/modules/Services.jsm");

let Log = function(Prefs) {
    this.maxMessages = 100;
    this.loggedMessages = [];
    
    this.log = function(crushedDomainsString) {
        if (Prefs.getValue("enableLogging") && crushedDomainsString) {
            let date = new Date();
            let readableDate = ("0" + date.getDate()).slice(-2) + "." +
                               ("0" + (date.getMonth() + 1)).slice(-2) + "." +
                               date.getFullYear() + " " +
                               ("0" + date.getHours()).slice(-2) + ":" +
                               ("0" + date.getMinutes()).slice(-2) + ":" +
                               ("0" + date.getSeconds()).slice(-2);
            
            let message = readableDate + " - crushed cookies from " +
                          crushedDomainsString;
            
            this.loggedMessages.push(message);
            
            if (this.loggedMessages.length > this.maxMessages) {
                this.loggedMessages.shift();
            }
            
            let ctcLogWindow = Services.wm.getMostRecentWindow("ctcLogWindow");
            if (ctcLogWindow) {
                let logTextbox = ctcLogWindow.document.getElementById("logTextbox");
                if (logTextbox) {
                    logTextbox.value += message + "\n\n";
                    logTextbox.selectionStart = logTextbox.value.length;
                }
            }
        }
    };
    
    this.onOpen = {
        Log: this,
        observe: function(aSubject, aTopic, aData) {
            let window = aSubject;
            let logTextbox = window.document.getElementById("logTextbox");
            
            if (logTextbox) {
                for (let message of this.Log.loggedMessages) {
                    logTextbox.value += message + "\n\n";
                }
                
                logTextbox.selectionStart = logTextbox.value.length;
            }
        }
    };
    
    this.onClear = {
        Log: this,
        observe: function(aSubject, aTopic, aData) {
            this.Log.loggedMessages = [];
        }
    };
};