---
title: "The March of the Machines"
excerpt: "The scaling of AI tools and use. What I think is going to happen and how that is affecting my preparation for the future."
publishedDate: 2026-05-04
tags:
  - "AI"
  - "Home Lab"
  - "Opinion"
coverImage: "/images/blog/robots-marching-editorial.svg"

draft: false
---

# How I see it

----

No matter what your opinions on AI are, it has, at least in the coding sector, demonstrated that it is not only useful, but fully capable of doing a lot of the grunt coding work that would typically be handed to junior software engineers.

This has led to what I believe to be a short-sighted cash grab to lay off as many junior software engineers as possible and replace them with AI. Despite what I or anyone else feels about this, my read is this:  **it works and we must now deal with & plan around the consequences**.

## Thesis

----

My core claim is simple: AI capability is compounding quickly enough that it is already reshaping software labor, tooling, and business models. I expect that trend to continue if current incentives hold. The rest of this article is my best attempt to map what I see now, what I think happens next, and how I plan to adapt.

## At a glance

----

- Hardware constraints are still the main bottleneck, and likely get worse before they get better.
- Cheap access today is heavily subsidy-driven, so monetization pressure likely rises.
- Tool quality + user skill are compounding together, lowering build costs fast.
- Adoption will be uneven: fast in incentive-heavy orgs, slow in craft-and-ownership-heavy orgs.

### 1. The Hardware Wall Will Get Far Worse Before It Gets Better

#### Cost per request

If you follow hardware at all, you will know that AI infrastructure, as it currently stands, is incredibly expensive. Every ChatGPT & Claude prompt you run takes what I estimate to be a $50,000 enterprise-grade server node at minimum, using its full compute capacity per request as it generates one prompt response.

#### Infrastructure bottlenecks

That isn't even factoring in tool calls and agent looping that newer models seem to be doing internally alongside their base LLM models. That is simply running the LLM without any of the other infrastructure surrounding it.

The hardware supply chain, as it currently stands at the time of me writing this, was not meant for the extreme scaling of its use that we are currently in the middle of, and that is likely to get worse because TSMC is the only manufacturer producing a significant number of chips necessary for this scaling. China & the US are currently locked in a race to build out their own infrastructure for this, but it will be at least 6 years before the fruits of that can be seen on the proverbial tree. In the meantime, concentration risk around TSMC remains high, long enough that I personally fear the US & China might go to war over it.

Back to the point: until supply chains can catch up and/or we can make models smaller & faster, big companies are likely to keep throwing money at the problem because that's easier than optimizing in a gold-rush state.

![Current Blackwell Pro amazon price](https://i.imgur.com/0hSWtOd.png)
*enterprise motherboard, ram & misc hardware + 4 to 8 of these per server*

#### Consumer/local inference reality

Even with more consumer-grade equipment specialized for inference, with things like the DGX Spark and Thor, Ryzen AI Hailo, & Mac Studio/Mini setups, the cost to run what enthusiasts call middle-of-the-road open-source models will still run you around $3,500 at minimum. That is a rough order-of-magnitude estimate, but it matches what I keep seeing in practice. I might add that the models you can run on a single one of these still pale in size compared to the flagship models of the big 4 AI companies (OpenAI, Anthropic, Meta, & Google DeepMind).

Even miniaturized, the requirements to run these models can sometimes exceed the single hypothetical $50,000 server node I keep bringing up. I suspect this is part of why they slow-release models to the public: raw uncompressed models can be greater than 1 terabyte in size, and all of that has to sit in GPU memory. There are methods like [quantization](https://huggingface.co/docs/optimum/concept_guides/quantization), but until they can fully do that process, they limit who can use the model to people paying them $200 a month.

#### Near-term conclusion

But until LLMs get lighter to run and the hardware surrounding them gets better, one person can, with a single prompt, occupy that entire $50,000 server's compute for seconds to even minutes at a time. Hardware of this cost class can serve hundreds, if not thousands, of more traditional web requests, each requiring only split seconds of focus.

### 2. The Enshitification

AI as it is right now is extremely subsidized by VC and the AI companies that want to get us all hooked on it as a cloud service. The scary fact is that [it is working](https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html). AI adoption rates for both individuals and companies are happening at a staggering rate; in the last year alone, personal use grew from around ~35% to ~52%.

![*From the Federal Reserve & Census survey*](https://www.federalreserve.gov/econres/notes/feds-notes/figure2-4032.png)
*(Data from the Federal Reserve Census survey)*

In that time span, we have seen rate limits tighten, token limits imposed, and the gradual monetization of its every use. I expect this to get worse before it gets better if it ever does.

### 3. The Tools Get Better & People Get Better at Using Them

It is no longer a debate. Agentic tools are useful. As they continue to improve and people get accustomed to their use, those who are willing to learn and use them will have a huge advantage. The cost of creating software and infrastructure just became extremely cheap by relative metrics. This has many ramifications, enough to spawn an entirely separate article. But to paraphrase, at least for the period where tokens are subsidized and we haven't fully gotten to its full "enshitified" state, it is a great time to launch new coding projects.

### 4. Adaptation Will Be Fast and Slow at the Same Time

Adoption will be fast where incentives are immediate, and slow where identity, craft, or process is deeply entrenched.

#### Where adoption will be fast

There is going to be rapid adoption in places where cost, speed, and output pressure dominate. Teams that are willing to absorb tooling change will get immediate leverage.

#### Where adoption will be slow

There is also going to be extreme friction with the adaptation of these tools in places where craft and ownership are core to identity. Big SWE orgs (Amazon-style environments, for example) often enforce ownership as a business idea, and that still matters. But for people building partially or fully out of passion, ownership is more visceral and personal, and the pushback is much stronger. I deeply suspect that while some individuals in GameDev, for example, will embrace it, many more will not because of the artistic nature of the subfield. That artistry creates a deeper feeling of ownership over the whole project, which is something you tend to lose once AI starts writing larger portions of it. Though best practice says to look over everything an AI does, I know most people will give it the same LGTM treatment (looks good to me) they gave 1500-line pull requests of the past.

But before I launch too deeply into conjecture, my point is that there is going to be a lot of room for people who are willing to use the new tools to make things that were out of reach for those who didn't have the affordance to pay multiple software engineering salaries.

As bad as the cost of Claude gets, it's still far below the ~$100,000 per-year cost of a single traditional software developer.

## How I am Adapting

----

With the conclusions I've made above, this is what I'm planning on doing so that I'll be able to adapt, generate my own worth, and build out my career from here.

### Welcome To the Home Lab

I've started to run my own home server lab. It will have the traditional home server bells and whistles like distributed compute, personal NAS storage, and a few other fun side projects. I also plan on having the ability to locally host inference machines (LLM runners) and my own agent stack.

I'm learning the networking around how [InfiniBand](https://en.wikipedia.org/wiki/InfiniBand) works, and how other low-level tools like [vLLM](https://docs.vllm.ai/en/latest/) and [Llama.cpp](https://llama-cpp.com/) work. I think working with these tools will be highly valuable in the coming years, and I might be able to tackle problems like running inference faster or more efficiently across smaller systems that don't have all the high-tech bells and whistles, or the effectively infinite bankroll, bigger companies have.

My hope is that, with a little work and a lot of research into [ML Model Sharding](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/), I will be able to set up my own systems and work with LLM automation completely untethered from cloud services, and do it without answering to anyone but the power company. I will be documenting my journey here on this blog hopefully, so stay tuned for my journey to fulfill this objective as I optimize for cheapness & effectiveness. If AI moddels get smaller, I can simply run more. If they do not, I'll have the capacity to cruse ahead on my own.

### Training Models, Agents, & Development

I have already taken many steps to learn [PyTorch](https://pytorch.org/) and the underlying tools needed to train my own AI models, plus ways to incorporate it into things that interest me, like my [machine learning mesh retopology project](/projects/machine-learning-mesh-re-topology/). I plan on combining this with my work above, and hopefully using my other projects to create my own tools and speed up my own workflows. It really only has to work for me and my already software-attuned brain.

### Where I See Opportunity

There are a lot of opportunities, short and long term, that have come to light because of the current state of the world. I have a few ideas I'd like to brainstorm out, though if I do go through with them, any information on such an endeavor would be after the fact just by the nature of business. What I can say is that there are a lot of new technologies that can be made, and there are a lot of old technologies that suddenly became a lot cheaper to give a fresh coat of paint.

## The Future and Beyond

----

At the start of this article I stated that firing junior software engineers was extremely short-sighted, and I mean that. The fact of the matter is this job may not exist as it has in the past, but it will inevitably still need to exist in some capacity. No matter what your intent is, the way AI works right now (and I have no reason to suspect we are going to reach AGI any time soon) still needs someone to guide it along its path. The best people to do that are the senior software developers of today. *But what about when they retire?* When those seniors inevitably do, being a principal in the pipeline when there were no juniors produced from that generation means that when the snap-back comes, anyone who stayed sharp will be able to essentially name their price.

## Personal Position

----

I would also like to say that any personal feelings about AI & its use / its impacts are not the point of this article. It is a very candid and cold prediction. I personally love to code, and while it kind of sucks that I don't think I'm going to be paid to code in the future, I still plan on doing it as a hobby. Remember, no matter what AI automates in the future, that doesn't stop any of us from **creating with intention**, assisted with some AI tool or not.

A lot of people are about to get metaphorically run over. At least personally, my goal at the end of the day is to lay out how things are and how to not get run over.
