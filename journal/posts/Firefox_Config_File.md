---
title: Firefox Config File
description: Persist Firefox preferences with a config file
tags: ['archlinux', 'config']
timestamp: 1719319341314
---

# Firefox Config File

Firefox preferences (e.g. toolbar layout) can be saved within a config file. 

## Locate Your Profile Folder

Config files are stored within a *profile folder*. Locate your profile folder by entering `about:profiles`. Here you may see a few profiles. The one you want is the one with `Default Profile` set to `Yes`. The `Root Directory` shows you the location of you *profile folder*.

On a Linux system, the location of a *profile folder* looks like:

```
/home/<user>/.mozilla/firefox/<random-char>.default-release
```

## Set Preferences with a Config File

Firefox preferences set within the UI are saved in `prefs.js` in your *profile folder*. This file **must not** be edited by hand. In the file, each line with `user_pref(...)` is a preference setting. 

If you wish to set preferences with a file:

  - Create a file `user.js` in your *profile folder*
  - Add the preferences you wish to set in `user.js`. You may refer to preference settings from `prefs.js`

The preference settings in `user.js` takes precedence over `prefs.js`.

This could be a good way to transfer Firefox preferences from one device to another.

Related links:

- <https://kb.mozillazine.org/User.js_file>
- <https://unix.stackexchange.com/questions/727999/which-files-can-be-used-to-configure-firefox-on-linux-mint-21-where-are-they-st>

<PostDate />
<PageTags />
