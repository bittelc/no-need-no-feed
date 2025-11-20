// Popup script for LinkedIn Feed Remover toggle functionality

const toggleBtn = document.getElementById('toggleBtn');
const statusText = document.getElementById('status');

// Load current state and update UI
async function loadState() {
  try {
    const result = await chrome.storage.sync.get({
      feedRemoverEnabled: true // default to enabled
    });
    updateUI(result.feedRemoverEnabled);
  } catch (error) {
    console.error('Failed to load state:', error);
    statusText.textContent = 'Error loading state';
  }
}

// Update UI based on current state
function updateUI(enabled) {
  if (enabled) {
    toggleBtn.textContent = 'Show Feed';
    statusText.textContent = 'Feed is hidden';
    statusText.className = 'status-enabled';
  } else {
    toggleBtn.textContent = 'Hide Feed';
    statusText.textContent = 'Feed is visible';
    statusText.className = 'status-disabled';
  }
}

// Toggle the feed state
async function toggleFeed() {
  try {
    // Get current state
    const result = await chrome.storage.sync.get({
      feedRemoverEnabled: true
    });

    // Toggle state
    const newState = !result.feedRemoverEnabled;

    // Save new state
    await chrome.storage.sync.set({
      feedRemoverEnabled: newState,
      lastToggleTime: Date.now()
    });

    // Update UI
    updateUI(newState);

    // Send message to current tab immediately (for instant feedback)
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && tab.url.includes('linkedin.com')) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'toggle',
        enabled: newState
      }).catch(err => {
        // Tab might not have content script loaded yet, that's okay
        console.log('Could not send message to tab:', err.message);
      });
    }
  } catch (error) {
    console.error('Failed to toggle feed:', error);
    statusText.textContent = 'Error toggling feed';
  }
}

// Initialize
loadState();

// Add click handler
toggleBtn.addEventListener('click', toggleFeed);
