---
name: proof-tips
description: Practical tips for writing proofs in IML.
---

- The auto tactic, `auto` as in `[@@by auto]`, is ImandraX's flagship automated inductive waterfall proof strategy, which combines simplification and may decide to do induction. This is the most common way to prove a `theorem` in Imandra.
  - Simplification is in may ways the most important part of the waterfall, and the step that most often causes a clause to evaporate or the goal to be refuted
  - For this reason, making good use of rewrite rules (`[@@rw]`) in order to control simplification is perhaps the MOST POWERFUL tool ImandraX gives us. Thus it's important to spend as much time as possible teaching ImandraX a good set of rules to apply.
- Do proofs in small steps. If you want to sketch out a bunch of ideas, comment out the parts that is not yet ready to be proved.
- When you see `ImandraX internal error`, bisect the problem by commenting out parts of the code.
- Avoid inline lambdas in proofs. Use named functions instead.
- Resort to manual tactics chaining if you need surgical control.
- Do not blindly attempt trial-and-error. If you are stuck, make a concrete plan in natural language and try to prove it step by step. Revise your plan as you go along.
