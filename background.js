// Last use is stored per URL in storage.local, so it survives a browser restart
// (tab ids do not). Tabs sharing a URL share one clock; that only keeps tabs longer.
const DEFAULTS = { tabDays: 1, groupDays: 2 };
const DAY = 86_400_000;
const key = (url) => `u${url}`;
const urlOf = (tab) => tab?.url || tab?.pendingUrl;

function touchTab(tab) {
  const url = urlOf(tab);
  if (url) return chrome.storage.local.set({ [key(url)]: Date.now() });
}
const touch = (tabId) => chrome.tabs.get(tabId).then(touchTab, () => {});

// On install every open tab counts as just used, so nothing closes right away.
chrome.runtime.onInstalled.addListener(async () => {
  const seen = await chrome.storage.local.get(null);
  const now = Date.now();
  const fresh = (await chrome.tabs.query({})).map(urlOf).filter((url) => url && !seen[key(url)]);
  await chrome.storage.local.set(Object.fromEntries(fresh.map((url) => [key(url), now])));
  chrome.alarms.create('sweep', { periodInMinutes: 1 });
});
chrome.runtime.onStartup.addListener(() => chrome.alarms.create('sweep', { periodInMinutes: 1 }));

// "Used" = you look at it, or an agent loads, navigates or regroups it.
chrome.tabs.onCreated.addListener(touchTab);
chrome.tabs.onActivated.addListener(({ tabId }) => touch(tabId));
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.url || info.status === 'complete' || info.audible || info.groupId !== undefined) touchTab(tab);
});
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;
  const [tab] = await chrome.tabs.query({ active: true, windowId });
  touchTab(tab);
});

// Ungrouped tabs follow tabDays one by one. A group follows groupDays as a
// whole: it closes when none of its tabs has been used for that long. 0 = off.
async function sweep() {
  const { tabDays, groupDays } = await chrome.storage.sync.get(DEFAULTS);
  const seen = await chrome.storage.local.get(null);
  const tabs = await chrome.tabs.query({});
  const [focused] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const now = Date.now();

  const lastUsed = (t) => {
    if (seen[key(urlOf(t))]) return seen[key(urlOf(t))];
    touchTab(t);
    return now;
  };
  const keep = (t) => t.pinned || t.audible || t.id === focused?.id;
  const idle = (t, days) => now - lastUsed(t) > days * DAY;

  const close = [];
  const groups = new Map();
  for (const t of tabs) {
    if (t.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
      if (tabDays > 0 && !keep(t) && idle(t, tabDays)) close.push(t.id);
    } else {
      groups.set(t.groupId, [...(groups.get(t.groupId) ?? []), t]);
    }
  }
  if (groupDays > 0) {
    for (const members of groups.values()) {
      if (!members.some(keep) && members.every((t) => idle(t, groupDays))) {
        close.push(...members.map((t) => t.id));
      }
    }
  }

  // One tab that is already gone must not stop the rest.
  await Promise.allSettled(close.map((id) => chrome.tabs.remove(id)));

  // Forget URLs that are no longer open.
  const open = new Set(tabs.filter((t) => !close.includes(t.id)).map((t) => key(urlOf(t))));
  const stale = Object.keys(seen).filter((k) => !open.has(k));
  if (stale.length) await chrome.storage.local.remove(stale);
}
chrome.alarms.onAlarm.addListener((alarm) => alarm.name === 'sweep' && sweep());
