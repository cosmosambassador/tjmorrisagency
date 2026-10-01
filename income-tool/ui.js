'use strict';
const el=id=>document.getElementById(id),keys=['price','jobs','hours','hourly','direct','fixed','fee','goal','weekly'];
const completed=new Set();let lastPlan=null;
const money=value=>value===null?'Not available':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
function assumptions(){return Object.fromEntries(keys.map(key=>{const raw=el(key).value;if(!raw.trim())throw Error('Enter a value for '+key);return [key,Number(raw)];}));}
function guarded(fn){return()=>{try{fn();el('status').textContent='';}catch(e){el('status').textContent=e.message;}};}
function calculate(){
 const input=assumptions(),result=IncomeTool.calculate(input);lastPlan={input,result};el('results').replaceChildren();
 for(const [label,value] of [['Monthly revenue',result.revenue],['Cash surplus before tax',result.cash_surplus_before_tax],['Remaining after target labor',result.remaining_after_target_labor_before_tax],['Cash per work hour before tax',result.effective_hourly_cash_before_tax],['Price covering target pay and costs',result.sustainable_price_at_planned_volume]]){
  const box=document.createElement('div');box.className='result';box.textContent=label;const number=document.createElement('strong');number.textContent=money(value);box.append(number);el('results').append(box);
 }
 el('flags').textContent=`Cash-goal jobs needed: ${result.jobs_for_cash_goal===null?'Not attainable at this price':result.jobs_for_cash_goal}. Planned work: ${result.total_hours} hours/month. Capacity: ${result.capacity_ok?'within your estimate':'exceeds your available hours'}. Tools/overhead: ${result.tools_within_ten_dollars?'within $10/month':'above your $10/month ceiling'}.`;
}
for(const [index,task] of IncomeTool.DAYS.entries()){
 const label=document.createElement('label'),box=document.createElement('input'),text=document.createElement('span');box.type='checkbox';text.textContent=`Day ${index+1}: ${task}`;
 box.onchange=()=>{box.checked?completed.add(index+1):completed.delete(index+1);el('progress').textContent=`${completed.size} of 28 steps marked complete`;};label.append(box,text);el('days').append(label);
}
el('calculate').onclick=guarded(calculate);
el('offer').onclick=guarded(()=>{calculate();el('offerout').textContent=IncomeTool.offer(el('service').value,el('scope').value,lastPlan.input.price);});
el('export').onclick=guarded(()=>{
 calculate();const plan={schema_version:1,exported_at:new Date().toISOString(),service:el('service').value,scope:el('scope').value,...lastPlan,completed_days:[...completed].sort((a,b)=>a-b),offer:IncomeTool.offer(el('service').value,el('scope').value,lastPlan.input.price)};
 const url=URL.createObjectURL(new Blob([JSON.stringify(plan,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='TJ-Fair-Work-Plan-'+Date.now()+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});guarded(calculate)();
