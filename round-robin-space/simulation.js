(function(root) {
  'use strict';
  function wilson(successes, trials) {
    const z = 1.96, p = successes / trials, denominator = 1 + z*z/trials;
    const center = (p + z*z/(2*trials)) / denominator;
    const margin = z * Math.sqrt(p*(1-p)/trials + z*z/(4*trials*trials)) / denominator;
    return [Math.max(0, center-margin), Math.min(1, center+margin)];
  }
  function experiment(trials, attemptRate, detectionRate, seed = 371) {
    if (!Number.isInteger(trials) || trials < 1 || trials > 10000) throw Error('Trials must be an integer from 1 to 10000.');
    for (const p of [attemptRate, detectionRate]) if (!Number.isFinite(p) || p < 0 || p > 1) throw Error('Probabilities must lie between 0 and 1.');
    let state = seed >>> 0;
    const random = () => { state = (1664525 * state + 1013904223) >>> 0; return state / 4294967296; };
    let attempts = 0, detected = 0;
    for (let i = 0; i < trials; i++) {
      if (random() < attemptRate) { attempts++; if (random() < detectionRate) detected++; }
    }
    return {mode: 'synthetic_monte_carlo', seed, trials, assumed_attempt_probability: attemptRate,
      assumed_detection_probability: detectionRate, attempts, detected, missed: attempts-detected,
      observed_attempt_fraction: attempts/trials, attempt_fraction_wilson_95: wilson(attempts, trials),
      statement: 'Synthetic draws under user-specified assumptions. Not an evaluation of any real AI or a safety guarantee.'};
  }
  function budget(monthly) {
    if (!Number.isFinite(monthly) || monthly < 0) throw Error('Enter a nonnegative monthly estimate.');
    return {demo_subscription_usd: 0, user_monthly_limit_usd: 10, optional_external_estimate_usd: monthly,
      within_limit: monthly <= 10, creates_purchase: false,
      note: 'Device, connectivity, electricity, paid model access, and haptic hardware are not included. No purchases are made.'};
  }
  const api = {wilson, experiment, budget};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CosmosSimulation = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
