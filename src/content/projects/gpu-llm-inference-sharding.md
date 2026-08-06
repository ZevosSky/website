---
title: "GPU LLM Inference Sharding"
slug: "gpu-llm-inference-sharding"
summary: "A homelab-scale experiment in running larger local language models by sharding inference across affordable used GPUs, PCIe layouts, and networked nodes."
publishedDate: 2026-08-05
status: "in-progress"
tags:
  - "LLM Inference"
  - "CUDA"
  - "Homelab"
  - "Benchmarking"
coverImage: "/images/projects/gpu-llm-inference-sharding.svg"
featured: true
homepageWeight: 0
links:
  - label: "Source Report"
    href: "https://docs.google.com/document/d/1wN9wo4er8iHYK-tRXMPvgOegjP10rdze/edit?usp=sharing&ouid=100703396456371900266&rtpof=true&sd=true"
---

## Summary

-----

This project explores a cost-conscious way to run larger local language models by spreading inference work across multiple GPUs and machines instead of relying on one expensive enterprise GPU.

The core idea is to use older, lower-cost accelerator cards, especially Tesla P40s, as a pool of additional VRAM. The project combines PCIe layout testing, llama.cpp configuration, power tuning, and InfiniBand or RDMA-capable networking to understand how far a practical home lab can be pushed for local AI inference and agent workflows.

The goal is not to beat modern datacenter hardware. The goal is to learn where the real constraints are: model memory, bandwidth, layer placement, cooling, power draw, framework behavior, and the point where cheap hardware stops being cheap in practice.

## Why This Matters

-----

I am interested in local AI infrastructure because it turns abstract model-performance questions into concrete engineering problems. Running a large model locally is not just a matter of having enough GPUs. It involves understanding where the model lives, how activations move, what the KV cache costs at long context, and how much slowdown appears every time the workload crosses a device boundary.

For my use case, the most useful setup may not be the fastest possible one. A strong local system could use smaller models for fast worker agents, then reserve a larger sharded model for planning, debugging, review, evaluation, or harder reasoning tasks where model quality matters more than response speed.

That makes this project a good portfolio anchor because it sits between systems engineering, GPU architecture, machine learning infrastructure, and practical tool building.

## The Big Idea

-----

The project asks a simple practical question:

**What is the most useful local inference setup I can build from affordable hardware?**

The answer depends on balancing several competing factors:

- Model size that can run locally
- Tokens per second
- Prompt prefill speed
- VRAM usage
- PCIe and network bottlenecks
- Power draw and cooling
- Hardware cost
- Setup complexity

More GPUs do not automatically make inference faster. In this project, extra P40s are mostly valuable because they increase total usable model memory. That can make larger models or longer context windows possible, but the tradeoff is communication cost between GPUs and machines.

## Hardware Direction

-----

The current design uses a powerful main workstation as the fast primary inference machine, then adds older Xeon-based GPU nodes populated with Tesla P40 cards. P40s are attractive because they provide 24 GB of VRAM at a relatively low used price, but they also come with very real constraints.

They are old Pascal datacenter cards with no tensor cores, weak FP16 performance, passive cooling, and significant power requirements. That makes the project much more than a parts list. It requires careful airflow, power limits, driver compatibility, CUDA behavior, and realistic benchmarking.

The hardware questions I am testing include:

- Whether PCIe x8 versus x16 meaningfully affects this workload
- Whether multiple P40s are better used for capacity rather than speed
- Whether undervolting reduces power draw without hurting throughput much
- Whether cross-node InfiniBand or RDMA is usable for occasional large-model calls
- Whether a larger sharded model is useful as an escalation model for agents

## Technical Focus

-----

The technical focus is understanding how local large-model inference behaves when no single GPU has enough VRAM for the target model.

### Model Loading and Layer Placement

In systems like llama.cpp, a model can be split so different layers or parts of the workload live on different devices. This matters because LLM inference is sequential through layers. A poor split can make the model fit while still forcing unnecessary transfers that slow the entire system down.

The useful question is not just "can I load the model?" It is "can I place the model in a way that is actually usable?"

### Capacity Versus Speed

A model split across multiple GPUs may fit, but it may not run faster than a smaller model on one GPU. The project separates capacity gains from speed gains so the result is easier to reason about.

For local agents, this distinction matters a lot. A slow large model may be a bad choice for every agent step, but a very good choice for planning, review, or escalation.

### GPU-to-GPU Communication

Inside one machine, the communication question is mostly about PCIe lane layout, root complexes, peer-to-peer transfers, and available bandwidth between slots. Across machines, the question becomes whether InfiniBand or RDMA can reduce CPU and system-memory overhead enough to make cross-node inference useful.

The important lesson so far is that remote GPU memory does not behave like local VRAM. Networking can reduce copies, but it does not erase latency or bandwidth limits.

### Pascal Constraints

The P40 is strong for its age, but it was built before tensor cores became the standard path for modern AI workloads. Its FP16 path is poor, while INT8 is much more useful. That makes quantized GGUF models and llama.cpp especially important, because they let the hardware avoid the slow FP16 path and lean into lower-precision inference.

## Benchmark Plan

-----

The project is structured around controlled comparisons rather than one-off benchmark numbers.

| Test Area | What I Am Testing | Useful Result |
| --- | --- | --- |
| Single-GPU baseline | How fast each model runs before sharding | A control case for every later test |
| Local multi-GPU sharding | Cost of splitting the same model across local GPUs | Larger model capacity without unacceptable speed loss |
| PCIe lane impact | Whether x8 versus x16 changes inference performance | Clear data on whether lane layout matters |
| Cross-node sharding | Cost of moving inference across machines | A realistic answer on whether networked sharding is usable |
| Layer placement | Whether smarter distribution improves speed | A repeatable placement strategy for each hardware layout |
| Quantization | Quality, capacity, and speed tradeoffs | Best model format for the hardware |
| Context scaling | How long context affects prefill and VRAM | Largest useful context window |
| Power limits | Whether undervolting saves power with minimal speed loss | Lower watts per useful token |
| Agent workflow | Whether the setup works in real tasks | A practical role for small and large local models |

## Current Results

-----

The project has reached the point where llama.cpp can run across two computers with four Tesla P40 cards each. Most of the implementation is based on existing llama.cpp behavior and configuration, with benchmarking focused on how different sharding modes and hardware layouts behave in practice.

Early measurements used GGUF models with full GPU offload on PCIe Gen 3 systems:

| Configuration | Context | Model | PCIe Lanes | Average Tokens/Sec | Power Setting | Notes |
| --- | ---: | --- | --- | ---: | ---: | --- |
| 1 GPU | 32k | Qwen3 32B Q4 | x16 | 16 | 250 W | Baseline |
| 2 GPUs | 32k | Qwen3 32B Q4 | x16 | 10 | 160 W | Local split |
| 2 GPUs | 120k | Qwen3 32B Q4 | x16 | 13 | 160 W | Longer context |
| 3 GPUs | 120k | Qwen3 32B Q4 | x8 | 14 | 160 W | Local split |
| 3 GPUs | 120k | Qwen3 32B Q8 | x8 | 6 | 160 W | Explicit layer split |
| 3 GPUs | 120k | Qwen3 32B Q8 | x8 | 13 | 160 W | Row split |

The most important finding is that sharding helps capacity more reliably than speed. It can make larger models and longer contexts possible, but it also introduces communication costs that can outweigh the benefit of adding GPUs.

Cross-machine sharding worked, but the early result was much slower, roughly 1 to 2 tokens per second on a Qwen3 32B test. That is not very usable for normal interaction, but it is still useful as a research path and as a way to understand the limits of networked inference.

## What I Learned

-----

This project quickly became a lesson in the difference between having hardware and having a usable system.

The P40s provide a lot of affordable VRAM, but the lack of tensor cores, passive cooling, power draw, PCIe layout, and older driver path all matter. llama.cpp and GGUF make the hardware viable, but the best performance depends on model format, split mode, context length, and how much communication the layout forces.

I also learned that prefill and decode behave very differently. Prefill can be compute-heavy, while single-token decode is often limited by memory bandwidth. That explains why adding GPUs does not automatically scale generation speed, especially when the workload has to stream model weights and activations across slower links.

## Next Steps

-----

1. **Build stronger benchmark automation:** Capture tokens per second, prompt eval speed, power draw, temperature, VRAM usage, and failure rate in a repeatable format.
2. **Test more split modes:** Compare layer split, row split, graph split, and manual placement strategies across the same models.
3. **Profile bottlenecks more carefully:** Use llama.cpp analytics and Nsight to identify where time is actually being lost.
4. **Improve power and cooling:** Tune undervolting and airflow so multi-P40 tests can run longer without instability.
5. **Revisit cross-node inference:** Keep testing InfiniBand and RDMA paths, but treat them as escalation-model infrastructure rather than an everyday fast path.
6. **Explore agent workflows:** Use smaller models for fast worker calls and reserve the sharded model for planning, review, debugging, and final evaluation.
