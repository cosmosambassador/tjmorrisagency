'use strict';
const worldCanvas = document.getElementById('world'), context = worldCanvas.getContext('2d');
let worldCards = [], projected = [];
const worlds = [
  {name:'Land · habitat',color:'#81e8b4',x:-125,y:0,z:0},
  {name:'Sea · coastal observatory',color:'#61bcff',x:0,y:15,z:110},
  {name:'Air · atmosphere',color:'#ecd296',x:125,y:0,z:0},
  {name:'Space · learning station',color:'#c6a0ff',x:0,y:-15,z:-110}
];
function drawWorld() {
  const w = worldCanvas.width, h = worldCanvas.height;
  context.fillStyle='#071221'; context.fillRect(0,0,w,h);
  const yaw=Number(document.getElementById('yaw').value)*Math.PI/180;
  const zoom=Number(document.getElementById('zoom').value)/100;
  const time=Number(document.getElementById('time').value);
  const project=(x,y,z)=>{
    const rx=x*Math.cos(yaw)-z*Math.sin(yaw), rz=x*Math.sin(yaw)+z*Math.cos(yaw);
    const depth=650+rz, scale=430/depth*zoom;
    return {x:w/2+rx*scale,y:h/2+y*scale+rz*.18*scale,scale,depth};
  };
  context.strokeStyle='#24425d'; context.lineWidth=1;
  for(let x=-300;x<=300;x+=30) {
    const a=project(x,80,-300),b=project(x,80,300);context.beginPath();context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);context.stroke();
    const c=project(-300,80,x),d=project(300,80,x);context.beginPath();context.moveTo(c.x,c.y);context.lineTo(d.x,d.y);context.stroke();
  }
  const planets=worlds.map((world,i)=>{
    const angle=time*.015; const x=world.x*Math.cos(angle)-world.z*Math.sin(angle),z=world.x*Math.sin(angle)+world.z*Math.cos(angle);
    return {...world,...project(x,world.y,z)};
  });
  planets.sort((a,b)=>b.depth-a.depth).forEach(p=>{
    context.fillStyle=p.color;context.beginPath();context.arc(p.x,p.y,25*p.scale,0,Math.PI*2);context.fill();
    context.font='13px system-ui';context.fillStyle='#f0f5ff';context.textAlign='center';context.fillText(p.name,p.x,p.y+25*p.scale+22);
  });
  projected=worldCards.map((card,i)=>{
    const angle=i*.46, radius=190+(i%7)*12;
    return {card,...project(Math.cos(angle)*radius, -60+(i%9)*13, Math.sin(angle)*radius)};
  }).sort((a,b)=>b.depth-a.depth);
  projected.forEach(p=>{
    context.fillStyle='#7de4c3';context.beginPath();context.arc(p.x,p.y,Math.max(2,4*p.scale),0,Math.PI*2);context.fill();
  });
  document.getElementById('worldstats').textContent=`${worldCards.length} separate card nodes · simulation time t=${time} · spatial projection, not headset VR`;
}
globalThis.setWorldCards = cards => { worldCards=cards;drawWorld(); };
for (const id of ['yaw','zoom','time']) document.getElementById(id).oninput=drawWorld;
document.getElementById('left').onclick=()=>{const slider=document.getElementById('yaw');slider.value=(Number(slider.value)-15+360)%360;drawWorld();};
document.getElementById('right').onclick=()=>{const slider=document.getElementById('yaw');slider.value=(Number(slider.value)+15)%360;drawWorld();};
worldCanvas.onclick=event=>{
  const rect=worldCanvas.getBoundingClientRect(),x=(event.clientX-rect.left)*worldCanvas.width/rect.width,y=(event.clientY-rect.top)*worldCanvas.height/rect.height;
  const nearest=projected.map(p=>({p,d:Math.hypot(p.x-x,p.y-y)})).sort((a,b)=>a.d-b.d)[0];
  if(nearest && nearest.d<18) document.getElementById('worldcard').textContent=JSON.stringify(nearest.p.card,null,2);
};
document.getElementById('haptic').onclick=()=>{
  let response='This browser does not expose vibration. Visual feedback is available.';
  if(typeof navigator.vibrate==='function') response=navigator.vibrate([25,60,25]) ? 'Vibration requested; actual feedback depends on device support.' : 'Vibration request declined by this browser.';
  document.getElementById('hapticstatus').textContent=response;
  worldCanvas.style.outline='3px solid #7de4c3';setTimeout(()=>{worldCanvas.style.outline='';},300);
};
document.getElementById('experiment').onclick=()=>{
  try { document.getElementById('experimentout').textContent=JSON.stringify(CosmosSimulation.experiment(
    Number(document.getElementById('trials').value),Number(document.getElementById('attempt').value),Number(document.getElementById('detection').value)),null,2); }
  catch(e){document.getElementById('experimentout').textContent=e.message;}
};
document.getElementById('cost').oninput=()=>{
  try{document.getElementById('costout').textContent=JSON.stringify(CosmosSimulation.budget(Number(document.getElementById('cost').value)),null,2);}
  catch(e){document.getElementById('costout').textContent=e.message;}
};
document.getElementById('cost').dispatchEvent(new Event('input'));drawWorld();

const learningMissions = {
 land: ['What observations would help us care for a garden without harming its living things?', 'Observe plants, compare notes, and ask a trusted adult before touching unfamiliar plants.'],
 sea: ['How could we study a shoreline and reduce pollution safely?', 'Imagine a cleanup plan. Real shorelines need adult guidance and safe conditions.'],
 air: ['How can we compare sky observations with reliable weather information?', 'Draw what you see and label your guesses. Clouds in this demo are fictional.'],
 space: ['What would a habitat need to help people feel safe, welcome, and cared for?', 'Design rest, accessibility, food, water, and shared learning spaces. This is a design story.']
};
for(const button of document.querySelectorAll('.learning')) button.onclick=()=>{
 const domain=button.dataset.domain;
 document.getElementById('question').value=learningMissions[domain][0];
 document.getElementById('domain').value=domain;
 document.getElementById('learningout').textContent=learningMissions[domain][1]+' Care comes before speed or winning.';
};
