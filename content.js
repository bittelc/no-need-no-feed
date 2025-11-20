(() => {
  // Prevent double-injection on page navigation within the SPA.
  if (window.__linkedinFeedRemoverInitialized) return;
  window.__linkedinFeedRemoverInitialized = true;

  const DEBUG = false;
  const SHOW_PLACEHOLDER = false; // Set to true to show a friendly replacement card instead of removing the feed outright.
  const REMOVAL_DEBOUNCE_MS = 200;
  const STYLE_ID = 'linkedin-feed-remover-style';

  const FEED_SELECTORS = [
    // Canonical feed containers
    'div.feed-outlet',
    'div[data-test-id="feed-container"]',
    'section[data-test-id="stream-container"]',
    'div[data-feed-root]',
    // Data attributes observed in posts
    'div[data-view-name="feed-full-update"]',
    'div[data-view-name="feed-news-module"]',
    'div[data-view-name="stream"]',
    'div[componentkey*="FeedType_MAIN_FEED"]',
    'div[data-live-test-urn*="feed"]',
    'div[data-view-name^="feed-"]',
    'div[componentkey^="urn:li:activity"]',
    'article[data-urn^="urn:li:activity"]',
    'div[data-urn^="urn:li:activity"]',
    // Scoped variants under main for redundancy
    'main[role="main"] div.feed-outlet',
    'main[role="main"] div[data-test-id="feed-container"]',
    'main[role="main"] section[data-test-id="stream-container"]',
    'main[role="main"] div[data-feed-root]',
    'main[role="main"] div[data-view-name="feed-full-update"]',
    'main[role="main"] div[data-view-name="feed-news-module"]',
    'main[role="main"] div[data-view-name="stream"]',
    'main[role="main"] div[componentkey*="FeedType_MAIN_FEED"]',
    'main[role="main"] div[data-live-test-urn*="feed"]',
    'main[role="main"] div[data-view-name^="feed-"]',
    'main[role="main"] div[componentkey^="urn:li:activity"]'
  ];

  const FEED_KEYWORD_PATTERNS =
    /(feed[-_ ]?outlet|news[-_ ]?feed|home[-_ ]?feed|voyager[-_ ]?feed|stream[-_ ]?container|feed-container|feed-full|feedtype|main[-_ ]?feed|stream)/;

  let observer;
  let removalScheduled = false;

  const log = (...args) => {
    if (!DEBUG) return;
    // eslint-disable-next-line no-console
    console.debug('[LinkedIn Feed Remover]', ...args);
  };

  const buildPlaceholder = () => {
    const container = document.createElement('div');
    container.dataset.liFeedRemoved = 'true';
    container.style.padding = '24px';
    container.style.margin = '16px 0';
    container.style.borderRadius = '12px';
    container.style.background = '#0a66c2';
    container.style.color = '#ffffff';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.textAlign = 'center';
    container.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.12)';

    const title = document.createElement('div');
    title.textContent = 'LinkedIn feed removed';
    title.style.fontSize = '18px';
    title.style.fontWeight = '700';
    title.style.marginBottom = '6px';

    const subtitle = document.createElement('div');
    subtitle.textContent = 'Breathe easy and get back to what matters.';
    subtitle.style.fontSize = '14px';
    subtitle.style.opacity = '0.9';

    container.appendChild(title);
    container.appendChild(subtitle);
    return container;
  };

  const isLikelyFeed = (el) => {
    if (!el || el.dataset?.liFeedRemoved === 'true') return false;

    const attributeText = [
      el.id,
      typeof el.className === 'string' ? el.className : '',
      el.getAttribute?.('data-test-id'),
      el.getAttribute?.('data-feed-root'),
      el.getAttribute?.('data-view-name'),
      el.getAttribute?.('componentkey'),
      el.getAttribute?.('data-live-test-urn'),
      el.getAttribute?.('data-view-name'),
      el.getAttribute?.('aria-label')
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (FEED_KEYWORD_PATTERNS.test(attributeText)) return true;
    if (el.matches?.('div.feed-outlet')) return true;

    const postCount = el.querySelectorAll?.(
      'article[data-urn^="urn:li:activity"], div[data-urn^="urn:li:activity"]'
    ).length;
    if (postCount >= 2) return true;

    const containsOutlet = el.querySelector?.('div.feed-outlet');
    if (containsOutlet) return true;

    return false;
  };

  const injectCssHideRules = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Hard hide known feed containers to avoid flash of feed content */
      div.feed-outlet,
      div[data-test-id="feed-container"],
      section[data-test-id="stream-container"],
      div[data-feed-root],
      div[data-view-name="feed-full-update"],
      div[data-view-name="feed-news-module"],
      div[data-view-name="stream"],
      div[componentkey*="FeedType_MAIN_FEED"],
      div[data-live-test-urn*="feed"],
      div[data-view-name^="feed-"],
      div[componentkey^="urn:li:activity"],
      article[data-urn^="urn:li:activity"],
      div[data-urn^="urn:li:activity"],
      main[role="main"] div.feed-outlet,
      main[role="main"] div[data-test-id="feed-container"],
      main[role="main"] section[data-test-id="stream-container"],
      main[role="main"] div[data-feed-root],
      main[role="main"] div[data-view-name="feed-full-update"],
      main[role="main"] div[data-view-name="feed-news-module"],
      main[role="main"] div[data-view-name="stream"],
      main[role="main"] div[componentkey*="FeedType_MAIN_FEED"],
      main[role="main"] div[data-live-test-urn*="feed"],
      main[role="main"] div[data-view-name^="feed-"],
      main[role="main"] div[componentkey^="urn:li:activity"],
      main[role="main"] article[data-urn^="urn:li:activity"],
      main[role="main"] div[data-urn^="urn:li:activity"] {
        display: none !important;
        visibility: hidden !important;
      }
    `;
    document.documentElement.appendChild(style);
  };

  const findFeedElements = () => {
    const found = new Set();

    FEED_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (isLikelyFeed(el)) found.add(el);
        const parent =
          el.closest?.(
            'div[componentkey*="FeedType_MAIN_FEED"], div.feed-outlet, section[data-test-id="stream-container"], main[role="main"] .scaffold-layout__main, main[role="main"]'
          ) || el.parentElement;
        if (parent && isLikelyFeed(parent)) found.add(parent);
      });
    });

    return Array.from(found);
  };

  const hideFeedElement = (el) => {
    if (!el || el.dataset?.liFeedRemoved === 'true') return;

    if (SHOW_PLACEHOLDER) {
      try {
        const replacement = buildPlaceholder();
        el.replaceWith(replacement);
        log('Replaced feed with placeholder', replacement);
        return;
      } catch (error) {
        log('placeholder error', error);
      }
    }

    try {
      el.remove();
      log('Removed feed element', el);
    } catch (error) {
      log('remove error', error);
    }
  };

  const removeFeed = () => {
    try {
      injectCssHideRules();
      const feeds = findFeedElements();
      if (!feeds.length) return;
      feeds.forEach(hideFeedElement);
    } catch (error) {
      log('removeFeed error', error);
    }
  };

  const scheduleRemoval = () => {
    if (removalScheduled) return;
    removalScheduled = true;
    setTimeout(() => {
      removalScheduled = false;
      removeFeed();
    }, REMOVAL_DEBOUNCE_MS);
  };

  const startObserver = () => {
    if (observer || !document.body) return;
    observer = new MutationObserver(scheduleRemoval);
    observer.observe(document.body, { childList: true, subtree: true });
  };

  const start = () => {
    try {
      injectCssHideRules();
      removeFeed();
      startObserver();
    } catch (error) {
      log('init error', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
