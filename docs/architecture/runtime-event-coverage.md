Current Runtime Event Coverage

Supported

✓ browser.window.created

✓ browser.window.focus

✓ browser.tab.created

✓ browser.tab.updated

✓ browser.tab.removed

✓ browser.navigation.started

✓ browser.navigation.completed

✓ storage.changed

✓ workspace.changed

✓ popup.connected

✓ options.opened

✓ options.closed

✓ content.connected

Future

popup.disconnected

content.disconnected

Reason

Current architecture uses MessageBus.send().

Disconnect lifecycle requires Port-based communication.

Planned Work Package

Connection Lifecycle Enhancement.