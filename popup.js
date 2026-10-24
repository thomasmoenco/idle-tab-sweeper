const DEFAULTS = { tabDays: 1, groupDays: 2 };

chrome.storage.sync.get(DEFAULTS).then((settings) => {
  for (const [name, value] of Object.entries(settings)) {
    const input = document.getElementById(name);
    input.value = value;
    input.addEventListener('change', () => {
      chrome.storage.sync.set({ [name]: Math.max(0, Number(input.value) || 0) });
    });
  }
});

const button = document.getElementById('closeGroups');
button.addEventListener('click', async () => {
  const grouped = (await chrome.tabs.query({})).filter((t) => t.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE);
  const count = new Set(grouped.map((t) => t.groupId)).size;
  await Promise.allSettled(grouped.map((t) => chrome.tabs.remove(t.id)));
  button.textContent = `Closed ${count} tab group${count === 1 ? '' : 's'}`;
});
