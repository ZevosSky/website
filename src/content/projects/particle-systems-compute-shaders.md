---
title: "Particle Systems & Compute Shaders"
slug: "particle-systems-compute-shaders"
summary: "A lightweight particle system in a custom 2D engine exploring compute-driven updates, simple vector motion, and orbit behaviors."
publishedDate: 2024-12-14
status: "completed"
tags:
  - "Compute Shaders"
  - "C/C++"
  - "C#"
  - "Particles"
  - "Custom Engine"
  - "ECS"
  - "JSON"
coverImage: "https://i.imgur.com/O1TbYIn.gif"
featured: false
homepageWeight: 8
links: []
---

# Summary

----

This was one of my first graphics-heavy projects, and it taught me a lot about how compute shaders actually work in practice. It was also one of the projects that pushed me deeper into custom engine architecture, data flow, and how simulation systems connect back into rendering.

Much of my early understanding as a graphics programmer came from this project: working inside a custom engine, learning how to structure ECS-style systems, and figuring out how to move particle data through update and render stages cleanly.

## What I built

- A lightweight particle system driven by compute shader updates
- Support for simple vector-based movement and orbital motion
- Integration work inside a custom engine architecture
- Supporting engine-side systems using templates, messaging, and structured data flow

## Why it mattered

This project helped bridge the gap between just writing graphics code and understanding how graphics features fit into a larger engine. It was not only about making particles move, but about learning how simulation, rendering, and engine systems all depend on one another. And although this project looks a little sillly to me now with how I implimented a lot of it. It was very important that I learned what I did from this project.
