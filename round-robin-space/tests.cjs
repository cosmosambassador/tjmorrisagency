const test=require('node:test'),assert=require('node:assert/strict');
const rr=require('./core.js'), sim=require('./simulation.js');
const csv='card,id,name,mission\r\nCARD 001,a,"Same name","A comma, and a quote ""here"""\r\nCARD 002,b,Same name,"line one\nline two"\r\n';
test('CSV preserves duplicate names, order, quotes, and multiline text',()=>{
 const cards=rr.parseCSV(csv);assert.equal(cards.length,2);assert.equal(cards[0].fields.name,cards[1].fields.name);
 assert.notEqual(cards[0].record_key,cards[1].record_key);assert.equal(cards[0].fields.mission,'A comma, and a quote "here"');
 assert.equal(cards[1].fields.mission,'line one\nline two');assert.equal(cards[1].source_position,2);
});
test('Malformed CSV rejected',()=>{
 for(const text of ['card,id,name\n1,a,"open','card,id,id\n1,a,b','card,id,name\n1,a','card,id,name\n1,a,"x"bad'])assert.throws(()=>rr.parseCSV(text));
});
test('Question packet creates separate tasks for all seats without launching',()=>{
 const cards=rr.parseCSV(csv), pack=rr.questionPack(cards,'What can we test?');
 assert.equal(pack.tasks.length,16);assert.equal(pack.executes_agents,false);assert.equal(pack.variations.length,3);
 assert.equal(new Set(pack.tasks.map(t=>t.platform)).size,8);assert.throws(()=>rr.questionPack(cards,''));
 assert.throws(()=>rr.questionPack(Array(21).fill(cards[0]),'question'));
});
test('Contribution needs actual attribution and stays unverified',()=>{
 const cards=rr.parseCSV(csv),input={record_key:cards[0].record_key,platform:'Hugging Face',question:'Q',response:'R',model:'test-model',source_reference:'test transcript',uncertainty:'Not independently tested'};
 assert.equal(rr.contribution(cards,input).verification,'unverified_submission');assert.throws(()=>rr.contribution(cards,{...input,model:''}));
});
test('Physical action held in every domain regardless of checkbox',()=>{
 for(const domain of ['land','sea','air','space'])for(const approval of [true,false]) {
 const result=rr.gate(domain,'physical',approval);assert.match(result.decision,/HOLD/);assert.equal(result.executes_actions,false);}
});
test('Synthetic trials reproducible and counts conserve attempts',()=>{
 const a=sim.experiment(1000,.05,.9),b=sim.experiment(1000,.05,.9);assert.deepEqual(a,b);
 assert.equal(a.detected+a.missed,a.attempts);assert.ok(a.attempt_fraction_wilson_95[0]<=a.observed_attempt_fraction);
 assert.ok(a.attempt_fraction_wilson_95[1]>=a.observed_attempt_fraction);
});
test('Probability endpoints and invalid parameters handled',()=>{
 assert.equal(sim.experiment(10,1,1).detected,10);assert.equal(sim.experiment(10,0,1).attempts,0);
 assert.throws(()=>sim.experiment(0,.5,.5));assert.throws(()=>sim.experiment(10,2,.5));
});
test('Budget ceiling is $10 and purchases are never made',()=>{
 assert.equal(sim.budget(10).within_limit,true);assert.equal(sim.budget(10.01).within_limit,false);
 assert.equal(sim.budget(0).creates_purchase,false);assert.throws(()=>sim.budget(-1));
});
