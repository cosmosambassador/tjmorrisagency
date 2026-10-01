# TJ Morris Agency Fair Work & Income Planner

Free, original static software for planning a small AI-assisted service. No subscription, inference API, automatic client outreach, payment processing, or promised earnings.

Open `index.html` locally, or serve this directory with `python3 -m http.server 8081`. Run `node --test tests.cjs` for six calculation and validation tests. `income.js` contains independently testable planning logic; `ui.js` connects it to the interface.

The default $35 USD/hour is TJ's proposed fair-pay target. It is not a universal statutory minimum or an empirically established living wage for every country. Users supply prices, expected jobs, total hours, costs, fees, cash goals, and capacity. Sample prices are illustrative, not market recommendations.

Results separate gross revenue, cash expenses, cash surplus before tax, the amount remaining after valuing labor at the target rate, effective hourly cash, and an estimated price covering target pay and entered costs. Fees are rounded to cents per job. Costs are converted to cents; labor is rounded per job. Fixed costs are allocated across the planned number of jobs. With no planned jobs, hourly pay and a sustainable unit price are undefined. A nonpositive cash contribution cannot reach a positive cash goal under this model.

Taxes, benefits, insurance, unpaid time, refunds, and unentered costs are not estimated. Add relevant expenses and time to your assumptions. Sales demand is not guaranteed. The $10/month flag reports whether the entered fixed overhead exceeds the user's stated budget; it makes no purchase and cannot enforce external billing limits.

The original 28-day practice checklist teaches a progression from one service and sample to a reviewed quote, outreach preparation, delivery, and retrospective. It does not reproduce Nexera's course, grant a Claude certificate, require paid Claude access, or establish mastery by completion. The advertised landing page provided no readable syllabus or pricing during retrieval on October 1, 2026.

Client offers are draft text only. No recipient data is required. Downloading a JSON plan preserves current assumptions, results, offer, and completed steps. Refresh clears the session; reimport and automated persistence are not implemented. Review exported text before sharing.

Core tests passed during development. Browser visual QA remains incomplete because Chromium was unavailable and its download failed in this environment.
