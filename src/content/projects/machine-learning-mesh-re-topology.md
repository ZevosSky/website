---
title: "Machine Learning Mesh Re-topology"
slug: "machine-learning-mesh-re-topology"
summary: "An ongoing experiment in learning machine learning through geometry processing, retopology, and artist-friendly Python tooling."
publishedDate: 2026-03-22
status: "in-progress"
tags:
  - "Machine Learning"
  - "Python"
  - "Geometry"
coverImage: "https://i.imgur.com/ueGHKGG.jpeg"
featured: true
homepageWeight: 1
links:
  - label: "Github"
    href: "https://github.com/ZevosSky/Retopo/tree/Gary"
---

## Summary

-----

This project is my on-going attempt to learn machine learning through a problem space I already care deeply about: clean geometry, artist workflows, and rig-ready meshes.

Instead of approaching ML as an isolated technical exercise, I wanted to apply it to a problem grounded in real production concerns. The current phase of the project focuses on understanding the pipeline end to end, including dataset preparation, mesh degradation, training experiments, and evaluation. Along the way, it has also helped me explore how tools like PyTorch, Trimesh, and graph-based mesh processing fit into a broader graphics and technical art workflow.

## Why This Matters

-----

I am most interested in projects that sit at the intersection of multiple disciplines. This one lives between graphics engineering, technical art, and machine learning, which makes it a strong long-term anchor for my portfolio.

What makes the project especially meaningful to me is that it is not just about whether a model can produce a plausible output. It is about whether that output could actually become useful in a real artist-facing workflow. I care a lot about the details that shape how something feels to use, whether that means clarity, consistency, reliability, or how much cleanup it creates downstream. For me, that is often where the difference lies between a technically interesting system and a genuinely useful one.

## The Big Idea

-----

The long-term goal of this project is to explore whether machine learning can help repair poor mesh topology while preserving the visible form of the original model.

That problem matters in several contexts. Whether a mesh comes from ZBrush, Blender, photogrammetry, or an AI generation pipeline, the same issues tend to appear repeatedly: inconsistent triangle density, broken edge flow, and topology that is not suitable for rigging or deformation. If those problems can be improved while keeping the original shape intact, it could help accelerate artist workflows and potentially make lower-quality or AI-generated meshes more viable in production.

## The Progress so far

-----

This project has gone through many attempts to create the correct topology from various techneques I learn as well as possible constraints

### Step 1: Collecting Good Meshes

The first step was building a set of meshes with topology that is suitable for rigging and animation. This was the most straightforward part of the process, since there are many open-source and freely available meshes online that provide strong reference examples.

This stage was less about collecting as many assets as possible and more about establishing a clear baseline for what “good” topology looks like in practice. Since the project is ultimately concerned with artist-usable output, the quality of the source data matters a great deal.

### Step 2: Generating Bad Meshes

This has been the most difficult and interesting part of the project so far.

To train a model to improve topology, I first needed a way to generate degraded versions of otherwise clean meshes. The challenge is that poor topology is not simply random damage. It often involves specific structural failures, such as broken edge loops or uneven triangle flow, while the visible surface shape remains largely intact.

My first experiments used edge collapse and edge flip operations. These introduced disorder, but they did not reliably destroy the loop structures that matter most for deformation. After that, I experimented with Blender-based workflows, including tools that can identify and dissolve loops more intentionally. That approach still has potential, but I was not yet able to make it consistent enough for this pipeline.

The most promising method so far has been using automatic mesh simplification and LOD-style degradation. Those systems are often poor at preserving animation-friendly topology, which made them useful for procedurally generating training examples. It is not a perfect solution, but it has produced meshes that are visibly degraded while still preserving much of the original surface form.

That gave me a workable starting point for training.

### Step 3: Constraints and training

The current training setup is still exploratory, but it has already been useful for learning how to frame the problem.

At the moment, I am primarily using Chamfer distance as a way to compare output geometry against the target. In practice, that means I am treating the mesh more like a relative point cloud than a fully structured topological object. This allows the model to learn surface-level geometric similarity even when vertex ordering changes.

That works well enough as an initial step, but it also exposes the current limitation of the project: I am not yet directly evaluating or rewarding topological correctness. The model can learn to move points toward the right shape, but that does not necessarily mean it is restoring clean edge flow in a way that would actually be useful for rigging or deformation.

Right now, the system is better at recovering overall form than reasoning about mesh structure. As a result, the output may converge toward the correct shape while still introducing undesirable local artifacts or awkward deformations. Even so, this phase has been valuable because it makes the next problem much clearer: surface similarity alone is not enough, and the model will need stronger topology-aware constraints to become truly useful.

## The results so far

-----

**One of the original arms with decent edge loops**
<button
  type="button"
  class="lightbox-trigger"
  data-lightbox-src="/images/projects/MeganOriginal.png"
  data-lightbox-alt="Original mesh arm with decent edge loops">
  <img src="/images/projects/MeganOriginal.png" alt="Original mesh arm with decent edge loops" />
</button>

**Now degraded, notice how some of the edge loops are gone!**
<button
  type="button"
  class="lightbox-trigger"
  data-lightbox-src="/images/projects/MeganDegradedArm.png"
  data-lightbox-alt="Degraded mesh arm with missing edge loops">
  <img src="/images/projects/MeganDegradedArm.png" alt="Degraded mesh arm with missing edge loops" />
</button>

**Now what my moddel is doing so far, not great, but at least I know where I need to constrain now**
<button
  type="button"
  class="lightbox-trigger"
  data-lightbox-src="/images/projects/ModelOutput.png"
  data-lightbox-alt="Current model output for mesh recovery">
  <img src="/images/projects/ModelOutput.png" alt="Current model output for mesh recovery" />
</button>

The current results are not production-ready, but they are encouraging. The model is beginning to recover aspects of the original form, and in some cases hints of the underlying loop structure appear to return. More importantly, the project has already succeeded as a learning vehicle. It has forced me to think carefully about data generation, geometric constraints, evaluation methods, and the difference between a mesh that looks similar and one that is actually useful in an animation pipeline.

## What I'm Learning

-----

One of the most valuable parts of this project has been seeing how quickly a technically interesting idea turns into a usability and production problem.

It is not enough for a model to produce something that looks close to the source mesh. For this to be useful in a real pipeline, the output has to be structurally meaningful, predictable, and worth trusting. That distinction matters to me a great deal. I care about the details that make a system not just functional, but genuinely usable for the person on the other end of it.

This project has also made me think more carefully about working within constraints. I do not have access to unlimited GPU compute, so I have had to be deliberate about model scope, dataset design, and which experiments are worth the cost of running. That has made the process more disciplined, and in some ways more reflective of real engineering work, where time, hardware, and iteration budgets all shape the final solution.

That is part of what makes this project such a strong fit for my interests. It combines experimentation with a practical question: can this actually help someone work faster, cleaner, or with more confidence?

### Future Plans

1. **Better topolgy-aware constraints:** The next major step is to introduce stronger rewards and penalties related to topology itself, not just surface similarity. That may include tracking edge loop characteristics from the original mesh and developing metrics that better capture deformation-friendly structure. I also have a constraint using berycentric cordinates from the original mesh I want to try. 
   
2. **Better Degradation methods:** The current degrader is useful, but still incomplete. I want to keep improving the way poor-topology meshes are generated so the model is trained on examples that more closely reflect real production problems.
3. **Explore learned degradation approaches** If I can validate that the visible surface remains consistent, I would like to experiment with learned degradation methods, potentially including adversarial approaches, rather than relying entirely on procedural damage.
4. **Knowledge Distillation:** If the larger model becomes effective enough, I would like to explore distilling it into a smaller model that could be faster, lighter, and more practical in a tool context.
5. **A more formal white paper:** Once the project reaches a more mature state, I would like to document it more formally. Writing a paper would help me solidify what I have learned while also presenting the technical and workflow insights in a more rigorous way.
