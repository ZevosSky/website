---
title: "Procedural Level Generation"
slug: "procedural-level-generation"
summary: "A basic 2D procedural level generator in Unity focused on repeatable rules, layout variation, and practical iteration."
publishedDate: 2025-03-02
status: "completed"
tags:
  - "Unity"
  - "Procedural Generation"
  - "Tools"
coverImage: "https://i.imgur.com/WiZhOob.gif"
featured: false
homepageWeight: 5
links: []
---
# Summary

----

This was a compact procedural generation prototype built to test whether simple rules could quickly produce interesting 2D layouts.

While it is fairly basic on the surface, I am still very proud of how customizable it became directly from the component UI. Almost everything in the generator could be tuned and configured without needing to rewrite the core logic.

I took special care to make the interface itself highly configurable.

## Configuration

----

**From the Room sizes...**

![PCGRoomGen](https://i.imgur.com/gcRQbuq.png)

**To the mobs that spawned in each sector...**

![PCG_Enemes](https://i.imgur.com/QeXnvSb.png)

## Retrospective

----

If I look back at this project as one of my first more serious procedural generation implementations, there are a lot of things I would change if I were to tackle the problem again.

Before getting into the limitations, I do want to say that it is extremely **fast**. The GIF used for the project preview is slowed down significantly, and if I had not intentionally added a pause each time it generated a room, the system would move so quickly that it would barely need a loading screen at all.

That said, this is also where my praise for the project starts to become more critical. The way I defined rooms is not especially scalable. I essentially defined room shapes manually and then rasterized them across a tile-based system. That worked well enough for a prototype, but it is not an approach I would want to rely on if I were building a larger or more flexible generator.

I think that is one of the major lessons this project taught me about procedural generation in general: **it is incredibly finicky**. Even when the main idea works, there are always edge cases, structural weaknesses, and unexpected interactions that only reveal themselves as the system grows.
