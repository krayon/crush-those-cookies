## Crush Those Cookies
This is an extension for Pale Moon web browser which crushes those cookies which are no longer desirable. It simply removes cookies coming from websites when they are unloaded or their tabs are closed after specified delay. By default this also includes third-party cookies. Whitelist can be used to exclude domains, subdomains or basic wildcard domains from crushing cookies of their origin. The extension comes with a toolbar menu button providing quick access to some common actions.

### Building
Run build.sh script in a terminal on Linux or any similar environment for Windows like Cygwin. The extension's .xpi file should appear right away in the same location.

### Usage
After installation the menu button should appear in the toolbar. All detailed preferences of the extension are accessible within Add-ons Manager page.

#### Example of manual domain whitelisting
- adding __palemoon.&#8203;org__ to whitelisted domains will prevent removing cookies coming from palemoon.org
- adding __*.palemoon.org__ will prevent removing cookies coming from its subdomains like forum.palemoon.org or addons.palemoon.org
- adding __.palemoon.org__ will prevent removing cookies coming from both palemoon.org and its subdomains like forum.palemoon.org or addons.palemoon.org

### Notice
As this extension by default removes third-party cookies, it might possibly break sessions or negatively affect browsing experience on some websites with distributed content. This may cover banking, social or any other interactive web services. Be also careful while restoring previous tabs on the browser's startup. Either reload all the tabs at once or temporarily suspend crushing cookies until important tabs are loaded to avoid accidental cookie loss. Use it at your own risk.