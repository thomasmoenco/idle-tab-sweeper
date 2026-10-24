# Chrome Web Store listing — Idle Tab Sweeper 1.0.0

Upload: `idle-tab-sweeper-1.0.0.zip` (built from the extension root, without `store/`).

## Store listing
- **Name:** Idle Tab Sweeper
- **Summary (≤132 chars):** Automatically closes tabs and tab groups you haven't used for a while. Set the days yourself.
- **Category:** Productivity → Workflow & Planning
- **Language:** English
- **Icon:** `store/icon128.png`
- **Screenshot:** `store/screenshot-1280x800.png`

**Description:**

Too many tabs? Let them close themselves.

Idle Tab Sweeper closes tabs and tab groups you haven't used for a while. You choose how many days.

- Unused tab: a tab outside a group closes when it hasn't been used for the number of days you set.
- Unused tab group: a group closes as a whole when none of its tabs has been used for the number of days you set.
- Close all tab groups now: one button clears every tab group at once.

A tab counts as used when you look at it, or when it loads or navigates, so tabs that automated tools are working in stay open. Pinned tabs, tabs playing audio and the tab you're on are never closed automatically. Set a value to 0 to turn it off. Closed tabs can be reopened from your Chrome History.

Everything stays on your computer. No accounts, no tracking, no network requests.

## Privacy tab
- **Single purpose:** Close browser tabs and tab groups that have not been used for a user-chosen number of days.
- **tabs:** Read each tab's URL to remember when it was last used, also across browser restarts, and close tabs that have been idle too long.
- **tabGroups:** Tell grouped tabs apart so a tab group can be closed as a whole.
- **storage:** Save the user's day settings and the last-used time per open URL, locally on the device.
- **alarms:** Check once a minute for tabs and groups that have been idle too long.
- **Remote code:** No, I am not using remote code.
- **Data usage:** Web history (URLs of open tabs) is handled only locally on the device to measure idle time. It is never transmitted, sold or shared. Tick the three certifications.
- **Privacy policy URL:** https://github.com/thomasmoenco/idle-tab-sweeper/blob/main/PRIVACY.md
