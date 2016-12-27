## Crush Those Cookies
This is an extension for Pale Moon web browser which crushes those cookies which are no longer desirable. It simply removes cookies coming from websites when they are unloaded or their tabs are closed after specified delay. By default this also includes third-party cookies and LocalStorage data.

A whitelist can be used to manually exclude domains, subdomains or basic wildcard domains from crushing cookies of their origin. The extension comes with a toolbar menu button, providing quick access to some common actions including whitelist modification.

### Usage
After installing the extension, its menu button should appear in the toolbar. It can be used to temporarily suspend crushing cookies, add a current website's domain to the whitelist or remove individual cookies. You can adjust some settings regarding specific behavior and manually manage whitelisted domains in the extension's preferences.

#### Example of manual domain whitelisting
- adding __palemoon.&#8203;org__ to whitelisted domains will prevent removing cookies coming from palemoon.org
- adding __*.palemoon.org__ will prevent removing cookies coming from its subdomains like forum.palemoon.org or addons.palemoon.org
- adding __.palemoon.org__ will prevent removing cookies coming from both palemoon.org and its subdomains like forum.palemoon.org or addons.palemoon.org

#### Strict domain and subdomain checking
When this option is disabled, the extension doesn't remove cookies from a specific domain, when at least one website with a sub/parent domain for that one is still open. For example, after closing forum.palemoon.org, while its parent palemoon.org remains open, cookies from forum.palemoon.org won't be removed.

When this option is enabled, the extension strictly compares domains of closed websites with domains of websites which are still open. In this case it ignores relationship between domains and their sub/parent domains and removes cookies from domains which didn't get any match. For example, after closing forum.palemoon.org, while its parent palemoon.org remains open, cookies from forum.palemoon.org will be removed.

### Notice
As this extension by default removes third-party cookies, it might possibly break sessions or negatively affect browsing experience on some websites with distributed content. This may cover shopping, banking, social or any other interactive web services.

Be also careful while restoring previous tabs on the browser startup. Either reload all the tabs at once or temporarily suspend crushing cookies until important tabs are loaded to avoid accidental cookie loss.

Use it at your own risk.

### Building
Execute `build.sh` script. The extension .xpi file will be created automatically.