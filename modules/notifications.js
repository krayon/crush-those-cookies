let EXPORTED_SYMBOLS = ["Notifications"];

let AlertsService = Components.classes["@mozilla.org/alerts-service;1"]
                              .getService(Components.interfaces.nsIAlertsService);

let Notifications = function(extName, Prefs) {
    this.imagesURL = "chrome://" + extName + "/content/images/";
    this.iconFileName = "icon.png";
    
    this.alertName = "ctcNotification";
    this.alertTitle = "Crushed cookies from";
    
    this.notify = function(crushedDomainsString) {
        if (Prefs.getValue("enableNotifications") && crushedDomainsString) {
            AlertsService.showAlertNotification(this.imagesURL + this.iconFileName, 
                                                this.alertTitle, crushedDomainsString, 
                                                false, "", null, this.alertName);
        }
    };
};