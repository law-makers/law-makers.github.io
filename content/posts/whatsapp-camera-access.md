---
title: "WhatsApp Desktop attempts to access the camera on MacOS"
date: "2022-01-06"
Description: "WhatsApp Desktop attempts to access the camera on MacOS"
draft: false
---

I use [Micro Snitch](https://www.obdev.at/products/microsnitch/index.html), a neat tool that shows a notification overlay whenever the microphone or camera is accessed. It also logs all access.

I noticed whenever I open WhatsApp Desktop on Macos it triggers the overlay notification even though WhatsApp doesn't use the camera, and AFAIK WhatsApp on the desktop does not use video.

Digging deeper, we can use `lsof` after restarting WhatsApp to see what it's trying to do

```bash
$ lsof  | grep -i whatsapp | grep -i camera
WhatsApp  21532  den  txt       REG               1,14     199264 1152921500312262343 /System/Library/Frameworks/CoreMediaIO.framework/Versions/A/Resources/AppleCamera.plugin/Contents/MacOS/AppleCamera
WhatsApp  21532  den  txt       REG               1,14     222419            38743723 /private/var/db/oah/279281326358528_279281326358528/d1adba6cbceda131a35067381665ea5fa48ee87432b319d959ba833218f44b50/AppleCamera.aot
WhatsApp  21532  den  txt       REG               1,14     544688 1152921500312262566 /System/Library/Frameworks/CoreMediaIO.framework/Versions/A/Resources/AppleH13CameraInterface.plugin/Contents/MacOS/AppleH13CameraInterface
WhatsApp  21532  den  txt       REG               1,14     313915            38743735 /private/var/db/oah/279281326358528_279281326358528/501b68cc7ae0999b4979c1655ffb32b36a88c589567dfbf2fee20035c5772625/AppleH13CameraInterface.aot
```

Now it's opening the regular files (`REG`) with the file descriptor reporting as `txt`, i.e., program text (code and data) according to the `lsof` man page.

I'm not sure why WhatsApp Desktop attempts to read `AppleCamera`, it's definitely not an electron thing since other well-known electron apps don't have this behaviour.
