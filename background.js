// Background service worker for LinkedIn Feed Remover
// Handles cross-tab synchronization of toggle state

// Initialize default state on installation
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.sync.get('feedRemoverEnabled');

  // Set default state if not already set
  if (result.feedRemoverEnabled === undefined) {
    await chrome.storage.sync.set({
      feedRemoverEnabled: true,
      lastToggleTime: Date.now()
    });
  }
});

// Listen for storage changes and broadcast to all LinkedIn tabs
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.feedRemoverEnabled) {
    const newState = changes.feedRemoverEnabled.newValue;

    // Query all LinkedIn tabs
    chrome.tabs.query({ url: '*://www.linkedin.com/*' }, (tabs) => {
      // Send toggle message to each tab
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'toggle',
          enabled: newState
        }).catch(err => {
          // Some tabs might not have content script loaded yet, that's okay
          console.log(`Could not send message to tab ${tab.id}:`, err.message);
        });
      });
    });
  }
});
