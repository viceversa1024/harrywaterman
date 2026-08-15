---
title: "AI Safety Should Hedge Against Low-compute Worlds"
date: "2026-08-15"
excerpt: "Compute-crunch worlds are underhedged."
---

Let's say the year is 2030-2035 and we're in a world where compute **isn't** extremely useful for the cause of AI safety. What happened? Some cases:

- AI progress fizzled
- We solved alignment with human labor or very early human+AI labor
  - Still likely we'd want compute to do non-alignment safety work, like philosophy/strategy
- The US and China credibly paused, and AI safety work became mandated and verified
- The AIs turned out to be really bad at work relevant to our interests, but good at irrelevant/dangerous capabilities
  - Still likely we'd want compute to do post-training and elicit capabilities we care about
- A much more compute-efficient architecture or hardware (e.g. Taalas) made compute cheap and abundant
- The architecture of frontier AI changed fundamentally such that H100s aren't used anymore
- We're dead
- … and some miscellaneous Nothing Ever Happens worlds

I think most of these are pretty good and conditionally likely, and we shouldn't hedge with them in mind so much. The worlds where compute for AI safety **is** useful, on the other hand, correlate more with "things get wild" and seem underhedged:

- Takeoff creates an insane compute crunch, and lab leadership spends less than "% that would mitigate loss of control and disastrous misalignment" (because they have overoptimistic views on the difficulty of alignment, different risk tolerances, or competing incentives that undervalue public goods like alignment research)
- Race conditions and soft nationalization cause safety teams to be disempowered inside labs for national security reasons
- There's a lot of macrostrategic/concentration-of-power/values work to be done that no single actor has an interest in doing

Basically, in worlds where compute becomes labor, we need compute.

It would be good to have a bunch of this compute in [labs](/blog/compute-share/), because that's where they keep the good AI models. You'd also want some compute outside the US, because the US could have a coherent agenda that doesn't include safety or better-futures work. A rough comparison of physical compute locations:

<table class="yesno">
  <thead>
    <tr><th>Location</th><th>Robust to lab politics</th><th>Robust to USG agenda</th><th>Easy access to frontier models</th><th>Robust to market going crazy</th></tr>
  </thead>
  <tbody>
    <tr><td>Platonic Ideal Compute</td><td class="yes">Yes</td><td class="yes">Yes</td><td class="yes">Yes</td><td class="yes">Yes</td></tr>
    <tr><td>Decentralized and rented</td><td class="yes">Yes</td><td class="yes">Yes</td><td class="no">No</td><td class="no">No</td></tr>
    <tr><td>Labs</td><td class="no">No</td><td class="maybe">Maybe</td><td class="yes">Yes</td><td class="maybe">Maybe</td></tr>
    <tr><td><a href="https://en.wikipedia.org/wiki/Five_Eyes">Five-eyes</a> non-lab</td><td class="yes">Yes</td><td class="no">No</td><td class="no">No</td><td class="yes">Yes</td></tr>
    <tr><td>Non-five-eyes non-lab</td><td class="yes">Yes</td><td class="yes">Yes</td><td class="no">No</td><td class="yes">Yes</td></tr>
  </tbody>
</table>

Compute buildout doesn't solve the entire problem of third-party automated safety work; [model access](https://www.lesswrong.com/posts/RuGZ5tMdqpnraJahJ/model-access-for-third-parties-it-s-a-big-deal) and scheming are still important considerations. But it does seem very neglected (and may put us in a higher-leverage place to secure model access, for example, through deals with frontier labs during compute crunches).

## How?

One exciting property of compute buildout is it could function as a "money pit," or in more positively connotational language, a "high-absorptive-capacity funding opportunity" that could consistently turn money into impact without hitting bottlenecks. How can we achieve this? I'm much less confident on prescriptions, but some questions worth considering:

**Economies of scale?** Procurement is hard, so a directly responsible individual or org would likely be more effective than a bunch of orgs trying to allocate a budget individually. I don't expect deals on the actual hardware, but rather savings on procurement labor. Burst capacity also seems easier when you don't have to wrangle different orgs.

**Could financial investments hedge the compute-crunch world?** Making large investments in stocks correlated with compute becoming very valuable, then cashing out without ever having to get our hands dirty in the actual procurement sounds like a promising alternative strategy. It fails in worlds where compute becomes illiquid; placing some probability on a fast demand shock combined with slow physical supply expansion or strategic rationing implies we should have some amount of physical compute anyway.

## How impactful could this be?

A rough way to value independent compute is to ask how many high-quality AI-safety-worker equivalents it could produce during an intelligence explosion. BOTEC: one AGI instance might cost about $22,000 per year to run and produce roughly 4.4 human-researcher-years if equally productive per hour, or about $5,000 per equivalent year. If less or more useful per hour, costs could range from about $20,000 to $1,700 per human-equivalent year.[^1] This is orders of magnitude cheaper than a human, **and at a $1B investment, could produce ten times more AI safety work in a single 3-month critical period than the cumulative work on AI safety thus far.**

This estimate is under ideal conditions, and assumes we get a lot of other things right (power, model access, control, models capable of relevant work). But the option value of compute under less than ideal worlds is huge: we could rent or sell it back to labs for a profit and invest in talent as usual, or broker model access deals using scarce compute as leverage. In most worlds where it genuinely isn't valuable to anyone, as I said, we're in a pretty good place.

[^1]: Author's BOTEC. As a real-world cost anchor, [Vultr announced a $1 billion, 24,000-GPU cluster](https://www.datacenterdynamics.com/en/news/vultr-plans-50mw-amd-mi355x-cluster-in-springfield-ohio/); because these are AMD MI355X GPUs rather than H100s, and because costs include power and infrastructure, I use a wider illustrative range of 10,000–24,000 H100-equivalent accelerators. [Epoch AI estimates](https://epoch.ai/gradient-updates/how-many-digital-workers-could-openai-deploy) that 480,000 H100-equivalents devoted to inference could support a median of about 7 million eight-hour digital workers, with an extremely wide uncertainty range. Scaling this linearly over 90 days gives approximately 105–252 million human-equivalent work-hours. For comparison, a 2025 field-size estimate puts AI safety at roughly 400 FTEs in 2022 and 1,100 in 2025. Back-casting and summing a plausible growth path gives roughly 5,000 cumulative FTE-years through mid-2026, or around 9–10 million hours at 1,800 hours per FTE-year. This comparison is highly speculative: the Epoch estimate applies only to tasks models can perform, and the historical total includes non-research and potentially non-x-risk-focused work.
