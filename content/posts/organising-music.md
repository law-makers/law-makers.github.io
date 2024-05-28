---
title: "Organising One's Music Library"
Description: "How I Organise my Music Library"
date: "2021-12-08"
draft: false
---

# The Setup

Recently I've made efforts to have a local lossless music collection. The setup is humble:

- The bare metal server is a mid-tier Synology NAS
- [Plex](https://www.plex.tv/) as the media server software
- With [Plexamp](https://plexamp.com/), a solid music player client for Plex (runs on all major OSes)

Here is the client on MacOS
![Wes Montgomery on Plexamp](/images/wes.webp)

Cool thing is it allows me to stream library when I'm outside, download locally, etc. most of the cool features that Spotify and Apple Music have, but without the negatives that come with it, like paying for a subscriptions, being tracked, or having your tracks from a playlist removed for whatever reason that the providers decide.
;

# Organising Music

Anyone that owned an iPod or MP3 player back in the day knows the pain of editing ID3 metadata and adding album art for their tunes so they appear clean on their device. Fortunately over the years, things have gotten easier—I'll go through some tools I tried and my thoughts on what worked and what didn't for me.

## [MusicBrainz Picard](https://picard.musicbrainz.org/)

Comment: Probably my favourite tool, most used for me.

Pros:

- Open Source and cross-platform
- Supports [AcoustID](http://acoustid.org/) for identification
- Supports [heaps of plugins](https://picard.musicbrainz.org/plugins/)

Cons:

- Not command-line driven (may be a con for some)
- Depending on your resources, it can be slow or crash with large libraries, so things may need to be chunked
- May give undesired metadata, so it's always a good idea to check the diffs

## [Beets](https://github.com/beetbox/beets)

Comment: Command line driven, very configurable, opinionated (in my opinion), but works well, and people seem to love the tool. However I just end up using MusicBrainz Picard most of the time.

Pros:

- Open source and cross-platform
- Active development
- [Well-documented](https://beets.readthedocs.io/en/stable/)
- Config-file driven, so easily portable
- Supports [heaps of plugins](https://beets.readthedocs.io/en/stable/plugins/index.html)

Cons:

- Command line may be off-putting for some
- May be too fiddly for some that just want better tags and album art
- Can be disastrous for libraries if misconfigured

## [Bliss](https://www.blisshq.com/)

Comment: Solid, but didn't work for me and I got a refund. It could work really well for others.

Pros:

- Works as a server, accessible via the web within your local network
- Nice UI
- Rule-based, which you set then it executes them on your library

Cons:

- Paid, closed
- Was very slow for me

## [Mp3tag](https://www.mp3tag.de/en/)

Comment: Similar to MusicBrainz Picard, but I didn't really use because it's [not open source](https://community.mp3tag.de/t/mp3tag-under-gpl/7976/4), and doesn't support linux. I've read it's solid for Windows users (but Picard supports windows anyway). An open source version I've seen of Mp3tag is [Puddletag](https://github.com/puddletag/puddletag).

## [MediaMonkey](https://www.mediamonkey.com/)

Comment: Also didn't really use this since it's Windows and Android only. Many that organised music in the early 2000s would remember MediamMonkey, good to know the project is still going strong. Note that although there is a free version, there are [higher paid tier versions](https://www.mediamonkey.com/windows), so for serious use it's probably not free.

## [Roon](https://roonlabs.com/)

Comment: Too expensive for many ($13/mo or $700 lifetime subscription), closed source. Would replace my entire Plex setup for music (organising isn't the main feature of roon). I've heard great things about it, especially with its features that appeal to audiophiles. There is a free trial, but if I like it I'd have to pay the sub, so you I can't miss out on what I don't know I guess?

## Miscellaneous Tools

- [Flacon](https://flacon.github.io/): Splits a single large audio file containing the entire album into the separate audio tracks.
- [eqMac](https://eqmac.app/): Parametric equaliser for MacOS. Supports [AutoEQ](https://github.com/jaakkopasanen/AutoEq) for headphone users (not free). [Soundsource](https://rogueamoeba.com/soundsource/) is another alternative, but also not free
- [foobar](https://www.foobar2000.org/mac): There's foobar for MacOS, not as full-featured as the Windows version, but good for audio files.
