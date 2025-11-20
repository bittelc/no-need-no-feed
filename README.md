# LinkedIn Feed Remover

Hide LinkedIn's home/news feed while leaving messaging, search, jobs, and profiles untouched. Click the extension icon to toggle the feed on or off anytime.

## Features
- ✅ **Toggle on/off** — Click the extension icon to show or hide the feed
- ✅ **Fully client-side** — No background scripts, network calls, or data collection
- ✅ **Manifest V3** — Modern extension standard
- ✅ **Cross-browser** — Works on Chrome, Brave, Edge, and Firefox 109+
- ✅ **Persistent state** — Your toggle preference syncs across tabs and sessions

## Installation

### Chrome
1. **Download** or clone this repository to your computer
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the project folder (the one containing `manifest.json`)
6. Done! The extension is now installed

### Brave
1. **Download** or clone this repository to your computer
2. Open Brave and navigate to `brave://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the project folder (the one containing `manifest.json`)
6. Done! The extension is now installed

### Firefox
1. **Download** or clone this repository to your computer
2. Open Firefox and navigate to `about:debugging`
3. Click **This Firefox** in the left sidebar
4. Click **Load Temporary Add-on...**
5. Navigate to the project folder and select the `manifest.json` file
6. Done! The extension is now installed

> **Note for Firefox:** Temporary add-ons are removed when Firefox restarts. For permanent installation, you'll need to sign the extension through Mozilla's add-on developer portal, or use Firefox Developer Edition with the preference `xpinstall.signatures.required` set to `false` in `about:config`.

## Pinning the Extension to Your Toolbar

### Chrome & Brave
Extension icons appear in the toolbar automatically, but may be hidden in the extensions menu (puzzle piece icon).

To pin permanently:
1. Click the **puzzle piece icon** in the toolbar (Extensions menu)
2. Find **LinkedIn Feed Remover**
3. Click the **pin icon** next to it
4. The extension icon now appears in your toolbar

### Firefox
Firefox doesn't show extension icons by default to keep the toolbar clean.

To pin the icon:
1. Click the **puzzle piece icon** in the toolbar (Extensions menu)
2. Find **LinkedIn Feed Remover**
3. Click the **gear/settings icon** next to it
4. Select **Pin to Toolbar**
5. The extension icon now appears in your toolbar

Alternatively:
- Right-click the puzzle piece icon → Find your extension → Click the pin icon next to it

## How to Use

### Toggle Feed Visibility
1. **Click the extension icon** in your toolbar
2. A popup appears with a toggle button
3. Click **Show Feed** or **Hide Feed** to toggle
4. The change applies immediately to all LinkedIn tabs
5. Your preference persists across browser sessions

### Default Behavior
- By default, the feed is **hidden** when you first install
- You can toggle it on anytime by clicking the extension icon

## How It Works

### Technical Details
- **Content script** (`content.js`) runs at `document_start` on `https://www.linkedin.com/*`
- **CSS injection** hides feed elements immediately to prevent flash of content
- **DOM manipulation** removes feed containers using multiple detection strategies
- **MutationObserver** watches for LinkedIn's SPA re-renders and reapplies hiding
- **Storage API** persists toggle state across tabs and sessions
- **Debouncing** (200ms) keeps the observer lightweight and efficient

### Feed Detection
The extension uses 19+ CSS selectors and heuristics to find feed elements:
- Direct classes: `.feed-outlet`, `[data-test-id="feed-container"]`
- Data attributes: `[data-view-name^="feed-"]`, `[data-urn^="urn:li:activity"]`
- Component keys: `[componentkey*="FeedType_MAIN_FEED"]`
- Content analysis: detects elements containing multiple activity posts

### Optional Tweaks
Inside `content.js` you can adjust:
- `SHOW_PLACEHOLDER` — set to `true` to replace the feed with a friendly message instead of removing it
- `DEBUG` — set to `true` to log diagnostics in the console

## Privacy

This extension is built with privacy as a top priority:
- ❌ **No analytics or telemetry** — We don't track anything
- ❌ **No network requests** — Everything runs locally
- ❌ **No data collection** — We can't see what you do on LinkedIn
- ✅ **Open source** — All code is visible and auditable
- ✅ **Minimal permissions** — Only requests `storage` and `tabs` permissions

The only data stored is your toggle preference (on/off), saved locally using Chrome's `storage.sync` API.

## Packaging for Browser Stores

### Chrome Web Store / Edge Add-ons
1. Zip the contents of this folder (keep root files and `icons/` at top level)
2. Upload to the Chrome Web Store or Edge Add-ons developer dashboard
3. Complete store listing with description, screenshots, and privacy policy

### Firefox Add-ons (AMO)
1. Use the same files as Chrome
2. **Important:** Update `browser_specific_settings.gecko.id` in `manifest.json` to a unique ID you control (format: `name@yourdomain.com` or use a UUID)
3. Zip and upload to Firefox Add-ons developer hub
4. Mozilla will review and sign your extension

## Project Structure
```
manifest.json       # Extension configuration
content.js          # Main feed removal logic
popup.html          # Toggle UI
popup.js            # Popup logic and state management
icons/
  icon16.png        # Toolbar icon (16×16)
  icon48.png        # Extensions page icon (48×48)
  icon128.png       # Store icon (128×128)
CODEOWNERS          # Code review requirements
```

## Development

### Requirements
- No build process needed — pure JavaScript
- Works with latest Chrome, Brave, Edge, and Firefox 109+

### Testing
1. Load the extension using the installation instructions above
2. Navigate to `linkedin.com`
3. Feed should be hidden by default
4. Click extension icon to toggle
5. Open multiple LinkedIn tabs to test cross-tab sync
6. Restart browser to test state persistence

### Known Limitations
- Elements already removed from DOM won't reappear immediately when toggling on (LinkedIn's SPA will re-render them naturally on navigation)
- Feed selectors may need updates if LinkedIn changes their DOM structure significantly
- Firefox temporary add-ons are removed on browser restart

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request
4. Ensure all PRs require approval from @bittelc

## License

Apache License 2.0 — See `LICENSE` file for details.

## Support

If you encounter issues:
- Check the browser console for errors (toggle `DEBUG = true` in `content.js`)
- Ensure you're on the latest version
- Report issues on GitHub with browser version and error details
