---
title: "Free Up Disk Space on MacOS"
date: "2023-02-13"
description: "Free Up Disk Space on MacOS"
draft: false
---

Ignoring system caches, and logs in general for safety.

# Brew's Cache

```bash
brew cleanup --prune=all -s
```

- `brew cleanup` Remove stale lock files and outdated downloads for all formulae and casks, and
  remove old versions of installed formulae
- `--prune=all` removes everything (not up only a specified age, otherwise set by the env var `HOMEBREW_CLEANUP_MAX_AGE_DAYS`)
- `-s`: Scrub the cache, including downloads for even the latest versions. Note that downloads forany installed formulae or casks will still not be deleted
- `--dry-run` can be used to see what would be removed

# The `~/Library/Caches/` Folder

Though one could be brutal and wipe the entire folder

```bash
sudo rm -rfv ~/Library/Caches/
```

It may have unintended consequences, it's better to only delete the larger folders/files, i.e.,

```bash
sudo du -sm ~/Library/Caches/* 2> /dev/null | sort -n
```

Will list the folders in the directory sorted by size in MBs.

# Xcode Cache Data

To delete the derived data

```bash
rm -r ~/Library/Developer/Xcode/DerivedData/*/
```

For cached files

```bash
rm -rf ~/Library/Developer/CoreSimulator/Caches/dyld/*/*/
```

```bash
xcrun simctl delete unavailable
```

# Flush the DNS cache

```bash
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder
```

# CUPS Printer Job Cache

To delete your printer job cache

```bash
rm /var/spool/cups/cache/job.cache*
```

# QuickLook Thumbnail

Using the QuickLook Server debug and management tool

```bash
qlmanage -r cache
```

- `-r` resets Quick Look Server and all Quick Look client's generator cache
- [For more a more in-depth guide on cleaning QuickLooks and how it can leak encrypted data](https://objective-see.org/blog/blog_0x30.html)
