(function(root){
 'use strict';
 const DAYS=['Choose one service you can deliver','Describe the customer problem','Define one small deliverable','Write a clear AI prompt','Check a sample for factual errors','Improve the sample with feedback','Save your first portfolio sample','Estimate total delivery hours','Record direct costs and tool costs','Set your fair-pay target','Calculate a sustainable quote','Define scope and revision limits','Write an honest client offer','Review the offer with a trusted person','Identify appropriate potential customers','Prepare a short introduction','Share a sample with permission','Record responses without promising results','Ask what customers actually need','Refine the scope from feedback','Review demand before buying tools','Agree on scope before paid work','Prepare a delivery checklist','Check every source and claim','Deliver only work you have reviewed','Record payment and actual expenses','Compare actual hours with your estimate','Decide whether to repeat, revise, or stop'];
 function calculate(p){
  for(const key of ['price','jobs','hours','hourly','direct','fixed','fee','goal','weekly'])
   if(!Number.isFinite(p[key]) || p[key]<0 || p[key]>1000000)throw Error('Invalid nonnegative value: '+key);
  if(!Number.isInteger(p.jobs)||p.jobs>10000)throw Error('Jobs must be a whole number from 0 to 10000.');
  if(p.hours<=0)throw Error('Hours per job must be greater than zero.');
  if(p.fee>=100)throw Error('Fee must be below 100%.');
  if(p.weekly>168)throw Error('Weekly capacity cannot exceed 168 hours.');
  const cents=n=>Math.round(n*100),money=n=>Math.round(n)/100;
  const price=cents(p.price),direct=cents(p.direct),fixed=cents(p.fixed),labor=cents(p.hours*p.hourly);
  const fee=Math.round(price*p.fee/100),contribution=price-fee-direct;
  const surplus=p.jobs*contribution-fixed,afterLabor=surplus-p.jobs*labor;
  const allocatedFixed=p.jobs>0?fixed/p.jobs:null;
  const sustainable=allocatedFixed===null?null:Math.ceil((direct+labor+allocatedFixed)/(1-p.fee/100));
  return {revenue:money(price*p.jobs),fees:money(fee*p.jobs),cash_costs:money(direct*p.jobs+fixed),
   cash_surplus_before_tax:money(surplus),remaining_after_target_labor_before_tax:money(afterLabor),
   effective_hourly_cash_before_tax:p.jobs>0?money(surplus/(p.jobs*p.hours)):null,
   sustainable_price_at_planned_volume:sustainable===null?null:money(sustainable),
   jobs_for_cash_goal:contribution>0?Math.ceil((cents(p.goal)+fixed)/contribution):null,
   total_hours:p.jobs*p.hours,monthly_capacity_hours:p.weekly*52/12,
   capacity_ok:p.jobs*p.hours<=p.weekly*52/12,tools_within_ten_dollars:p.fixed<=10,
   target_hourly:p.hourly,taxes_included:false,guaranteed_income:false};
 }
 function offer(service,scope,price){
  if(!service.trim()||!scope.trim())throw Error('Choose a service and describe its scope.');
  if(!Number.isFinite(price)||price<0)throw Error('Enter a valid quoted price.');
  return `TJ Morris Agency / ACO Club\n\nService: ${service}\nScope: ${scope}\nProposed price: $${price.toFixed(2)} USD\n\nAI-assisted work with human review. Delivery date, revision limit, payment terms, and any taxes will be agreed before work begins. This offer does not promise earnings, investment results, or automatic publication.\n\nWe aim to serve with honesty, care, and respect for your time.`;
 }
 const api={DAYS,calculate,offer};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.IncomeTool=api;
})(typeof globalThis!=='undefined'?globalThis:this);
