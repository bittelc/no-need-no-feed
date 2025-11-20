# LinkedIn Feed Remover

Hide LinkedIn's home/news feed while leaving messaging, search, jobs, and profiles untouched. The extension runs fully client-side, uses Manifest V3, and works on Chromium browsers (Chrome, Brave, Edge, etc.) and Firefox 109+ (MV3).

## What it does
- Automatically removes the main feed on `linkedin.com` as soon as the page loads.
- Watches for LinkedIn's SPA updates and removes the feed again if it reappears.
- No background script, no network calls, and no data collection.

## Installation
### Chrome / Brave / Edge
1. Clone or download this repository.
2. Open `chrome://extensions` (or the equivalent for your browser).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select this project folder.
5. Refresh LinkedIn.

### Firefox (MV3)
1. Open `about:debugging` → **This Firefox** → **Load Temporary Add-on...**.
2. Select `manifest.json` from this project folder.
3. Refresh LinkedIn.

> Firefox uses the same MV3 manifest. If you publish, update `browser_specific_settings.gecko.id` in `manifest.json` to an ID you control.

## How it works
- Static content script (`content.js`) runs at `document_idle` on `https://www.linkedin.com/*`.
- Finds likely feed containers (e.g., `.feed-outlet`) and removes them. A `MutationObserver` keeps applying the removal when LinkedIn re-renders the feed.
- A small debounce keeps the observer lightweight. The script fails silently if it doesn't find a feed.

### Optional tweaks
Inside `content.js` you can adjust:
- `SHOW_PLACEHOLDER` — set to `true` to replace the feed with a friendly message instead of removing it.
- `DEBUG` — set to `true` to log diagnostics in the console.

## Privacy
- No analytics, telemetry, or remote requests.
- All logic runs locally in the content script.

## Packaging for stores
- **Chromium stores:** zip the contents of this folder (keep the root files and `icons/` at the top level) and upload.
- **Firefox:** use the same files; ensure `browser_specific_settings.gecko.id` matches your add-on ID before signing or distribution.

## Project structure
```
manifest.json
content.js
icons/
  icon16.png
  icon48.png
  icon128.png
```
