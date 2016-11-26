## Crush Those Cookies
This is an extension for Pale Moon web browser which crushes those cookies which are no longer desirable. It simply removes cookies coming from websites when they are unloaded or their tabs are closed after specified delay. By default this also includes third-party cookies and LocalStorage data.

A whitelist can be used to manually exclude domains, subdomains or basic wildcard domains from crushing cookies of their origin. The extension comes with a toolbar menu button providing quick access to some common actions including whitelist modification.

### Usage
After installation the menu button should appear in the toolbar. All detailed preferences of the extension are accessible within Add-ons Manager page.

#### Example of manual domain whitelisting
- adding __palemoon.&#8203;org__ to whitelisted domains will prevent removing cookies coming from palemoon.org
- adding __*.palemoon.org__ will prevent removing cookies coming from its subdomains like forum.palemoon.org or addons.palemoon.org
- adding __.palemoon.org__ will prevent removing cookies coming from both palemoon.org and its subdomains like forum.palemoon.org or addons.palemoon.org

#### Strict domain and subdomain checking
When this option is disabled, the extension doesn't remove cookies from a specific domain when at least one website with a sub/parent domain for that one is still open. For example, when forum.palemoon.org is being closed and its parent palemoon.org remains open, then cookies from forum.palemoon.org aren't removed.

When this option is enabled, the extension strictly compares domains of closed websites with domains of websites that are still open. In this case it ignores relationship between domains and their sub/parent domains and removes cookies from domains which didn't get any match. For example, when forum.palemoon.org is being closed and its parent palemoon.org remains open, then cookies from forum.palemoon.org are plainly removed.

### Notice
As this extension by default removes third-party cookies, it might possibly break sessions or negatively affect browsing experience on some websites with distributed content. This may cover shopping, banking or any other interactive web services.

Be also careful while restoring previous tabs on the browser's startup. Either reload all the tabs at once or temporarily suspend crushing cookies until important tabs are loaded to avoid accidental cookie loss.

Use it at your own risk.

### Building
Run build.sh script in a terminal on Linux or any similar environment for Windows like Cygwin. The extension's .xpi archive containing all necessary files will be created automatically.

### Alternative extension
There is an alternative extension of this kind called Cookie Exterminator which is developed by JustOff. It has several improvements over this one while providing functionality from original Self-Destructing Cookies extension for Firefox and adding some interesting custom features as well. If you prefer more similarity to SDC, then you might want to try Cookie Exterminator instead of Crush Those Cookies. All detailed information about Cookie Exterminator are available [here](https://addons.mozilla.org/en-US/firefox/addon/cookies-exterminator/).