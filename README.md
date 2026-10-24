# Idle Tab Sweeper

Chrome extension that closes tabs and tab groups you haven't used for a while. You choose the number of days.

- **Unused tab:** a tab outside a group closes after the set number of idle days.
- **Unused tab group:** a group closes as a whole when none of its tabs has been used for the set number of days.
- **Close all tab groups now:** one button clears every tab group.

A tab counts as used when you look at it, or when it loads or navigates. Pinned tabs, tabs playing audio and the tab you're on are never closed automatically. 0 turns a rule off.

Design: Leir, the HuginOS dark theme. Fonts are bundled under the SIL Open Font License (`fonts/`).

Privacy: everything stays on your device. See [PRIVACY.md](PRIVACY.md).

## Install from source
1. Open `chrome://extensions` and turn on Developer mode.
2. Click **Load unpacked** and pick this folder.

## Release
`zip -qrX store/idle-tab-sweeper-<version>.zip manifest.json background.js popup.html popup.js icons fonts`, then upload in the Chrome Web Store developer dashboard. Listing text: `store/LISTING.md`.
