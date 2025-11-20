# Privacy Policy for LinkedIn Feed Remover

**Last Updated:** November 20, 2025

## Overview

LinkedIn Feed Remover is a browser extension that helps users hide LinkedIn's home feed to reduce distractions while maintaining access to other LinkedIn features.

## Data Collection

**We do not collect, store, or transmit any personal data.**

## Data Usage

The extension stores only one piece of information locally on your device:

- **Toggle Preference**: A single boolean value indicating whether the LinkedIn feed should be hidden or visible

This preference is stored using your browser's local storage API (`chrome.storage.sync` or `browser.storage.sync`) and:
- Remains on your device
- Syncs across your browsers using your browser's built-in sync feature (if enabled)
- Is never transmitted to our servers (we don't have servers)
- Is never shared with third parties

## Permissions

The extension requires the following permissions:

### Storage
Used solely to save your toggle preference (feed hidden/visible) so it persists across browser sessions.

### Tabs
Used to send toggle messages to all open LinkedIn tabs when you change your preference, ensuring immediate updates without page refreshes.

### Host Permission (linkedin.com)
Required to inject CSS rules and run scripts that identify and hide feed elements on LinkedIn pages. The extension only runs on LinkedIn.com and does not access any other websites.

## Third-Party Services

This extension does not:
- Use analytics or tracking services
- Connect to any external servers
- Make any network requests
- Share data with third parties
- Use cookies

## Source Code

This extension is open source. You can review the complete source code at:
https://github.com/bittelc/no-need-no-feed

## Changes to Privacy Policy

We may update this privacy policy from time to time. Any changes will be reflected in the repository with an updated "Last Updated" date.

## Contact

If you have questions about this privacy policy, please contact:
cole.bittel@pm.me

## Your Rights

You can:
- Uninstall the extension at any time
- Clear all stored data by removing the extension
- Review the source code to verify our privacy claims

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- Mozilla Add-on Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)
