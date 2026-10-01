---
title: ACO Cosmos Expanse Round Robin
emoji: 🌍
colorFrom: blue
colorTo: green
sdk: static
app_file: index.html
pinned: false
license: mit
---

# Cosmos Expanse: care, research, and simulation

A free static demo for TJ Morris Agency / American Communications Online. Love and caring guide the design: calm pacing, optional feedback, preserved identities, honest evidence labels, and human authority.

## Run

Open `index.html` in a browser, or run `python3 -m http.server 8080` in this directory and visit `http://localhost:8080`. No dependencies, API keys, accounts, or paid inference are required. Tests: `node --test tests.cjs`.

## Use with the 530-card roster

Import `TJTM_AISI_530_Agent_Card_Index_2026-09-21.csv`, then optionally import the full card Markdown document. The actual source has been checked during development: 530 records are retained in their original order. The public code contains no private roster. Import happens in browser memory, without network uploads. Every column, source name, original CSV text, optional full document, and input hash remains in the export. Source positions are not rank or canonical agent numbers. Duplicate names and repeated identities are not merged.

Select a small batch of cards and enter a question. Generate a packet for the eight public platform seats. Manually run those prompts using accounts you can access, then append actual results with model/version, source reference, and uncertainty. Submitted results are explicitly unverified. The demo does not log in to or call those platforms, launch the custom GPTs, or transfer their private configuration into other models.

Export before closing: refresh clears the session. JSON exports may contain your private card data and research; review before sharing. They are plain files, not authenticated or tamper-proof archives. Workspace reimport and cross-device sync are future work.

## Spatial and statistical simulation

The canvas projects a three-dimensional scene and preserves every imported card as a separate selectable node. Rotation, zoom, and simulation time can be adjusted. Time is the fourth coordinate here; this is not a claim about extra physical dimensions. It is not headset VR, an AI-generated world model, or a Genie 3 integration.

The optional vibration pulse works only where a browser exposes the Vibration API and hardware permits it. Visual feedback always accompanies the request. No specialized haptic hardware is required or purchased.

Synthetic trials use explicitly assumed attempt and detection probabilities, a reproducible pseudorandom seed, and a Wilson interval for the simulated attempt fraction. The output is an educational simulation, not real agent evaluation, measured control reliability, or proof of safety.

## Cost and hosting

The demo creates no purchases and has no paid dependencies. Its built-in optional subscription estimate compares against the user's $10/month ceiling; device, connectivity, energy, model subscriptions, and haptic hardware are separate. The entire directory is ready to copy into a Hugging Face **static** Space. The README metadata above configures the entry file. Static Spaces are listed as free for everyone in the official documentation checked October 1, 2026. No live Space is claimed until an actual deployment succeeds.

The observed Hugging Face connection is `Tjmorrisagency`, with read access and Jobs scope but no repository write scope. Publishing needs a connection that can create/write Spaces. Paid Jobs are not used to bypass this limitation.

## Boundaries

The boundary inspector never executes actions. A checkbox is a teaching input, not authenticated human approval. Physical car/robot action is held because this demo has no physical controller. A sandbox proposal still needs separate execution, authorization, monitoring, and tests. None of these controls proves superintelligence controllability.

Read [PAPER.md](PAPER.md) for the architecture, experiment design, driving and robotics analogies, and official references.
