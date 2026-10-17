// Coordinates are centres, in percentages of the approved 4:3 painting.
export const LEAF_SITES=[{x:24,y:66},{x:30,y:62},{x:20,y:71},{x:49,y:63},{x:57,y:68},{x:60,y:61},{x:73,y:73},{x:77,y:69}];
export const FLYERS=['moth','bee','wasp'];
const TARGETS={
 moth:[{x:65,y:29,place:'the temple light'},{x:61,y:34,place:'the warm wooden shelf'},{x:44,y:23,place:'the window frame'}],
 bee:[{x:23,y:52,place:'the peace lily flowers'},{x:26,y:59,place:'the peace lily flowers'},{x:19,y:58,place:'the peace lily flowers'}],
 wasp:[{x:84,y:24,place:'the ivy'},{x:88,y:37,place:'the trailing ivy'},{x:78,y:22,place:'the ivy leaves'}],
 ladybird:LEAF_SITES,caterpillar:LEAF_SITES.filter(p=>p.x>=45&&p.x<=60)
};
const NOTES={moth:p=>`A moth folded its wings beside ${p}.`,bee:p=>`A bumblebee paused to inspect ${p}.`,wasp:p=>`A golden wasp stopped to explore ${p}.`,ladybird:()=> 'A ladybug explored a leaf and stopped for a little rest.',caterpillar:()=> 'A caterpillar took the slow route along a prayer plant leaf.'};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
function curve(a,b,c,d,t){const u=1-t;return {x:u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x,y:u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y};}
export function sampleVisit(v,time,reduced=false){
 const t=clamp((time-v.born)/v.duration,0,1),a=v.path[0],b=v.target;
 if(reduced)return {...b,phase:'resting',facing:1,angle:0,opacity:1};
 let p,phase;
 if(v.flying){
  if(t<.2){const u=t/.2;p=curve(a,v.controls[0],v.controls[1],b,smooth(u));phase='arriving';}
  else if(t<.36){const u=(t-.2)/.16,r=(1-u)*2;p={x:b.x+Math.sin(u*Math.PI*2)*r,y:b.y+(1-Math.cos(u*Math.PI*2))*r*.5};phase='exploring';}
  else if(t<.76){p=b;phase='resting';}
  else{const u=(t-.76)/.24;p=curve(b,v.controls[2],v.controls[3],v.path.at(-1),smooth(u));phase='leaving';}
 }else{
  const u=t<.45?smooth(t/.45):t<.66?1:1-smooth((t-.66)/.34);p={x:mix(a.x,b.x,u),y:mix(a.y,b.y,u)};phase=t>=.45&&t<.66?'resting':'walking';
 }
 // Look along travel without rolling or bobbing the entire illustration.
 let dx=1,dy=0;if(v.flying&&phase==='arriving'){dx=b.x-a.x;dy=b.y-a.y;}else if(v.flying&&phase==='leaving'){dx=v.path.at(-1).x-b.x;dy=v.path.at(-1).y-b.y;}else if(!v.flying&&t>.66)dx=-1;
 return {...p,phase,facing:dx<0?-1:1,angle:v.flying&&phase!=='resting'?clamp(dy/Math.max(5,Math.abs(dx))*6,-12,12):0,opacity:v.flying?1:clamp(Math.min(t/.05,(1-t)/.06),0,1)};
}
export function makeVisitorLife(random=Math.random,start=0){
 let serial=0;const active=new Map(),lastSite={},next={moth:start+1200,bee:start+1800,wasp:start+60000,ladybird:start+11000,caterpillar:start+38000};
 const range=(a,b)=>a+random()*(b-a);
 function choose(type,pool){let i=Math.floor(random()*pool.length);if(i===lastSite[type])i=(i+1+Math.floor(random()*(pool.length-1)))%pool.length;lastSite[type]=i;return {...pool[i]};}
 function allowed(type,light){return type==='moth'?light!=='day':type==='bee'||type==='wasp'?light!=='night':true;}
 function spawn(type,time,lampOn){
  const flying=FLYERS.includes(type);let target,path,controls=[],duration;
  if(flying){let pool=TARGETS[type];if(type==='moth'&&!lampOn)pool=[pool[2]];target=choose(type,pool);const right=random()>.5,entry={x:right?105:-5,y:range(12,48)},exit={x:right?-5:105,y:range(9,45)};
   controls=[{x:mix(entry.x,target.x,.35),y:target.y-12},{x:target.x+(right?9:-9),y:target.y-7},{x:target.x+(right?-8:8),y:target.y-8},{x:mix(target.x,exit.x,.65),y:exit.y-5}];path=[entry,target,exit];duration=range(30000,38000);
  }else{const p=choose(type,TARGETS[type]);target={x:p.x+1.8,y:p.y-.6};path=[p,target,p];duration=range(42000,56000);}
  const v={id:`${type}-${++serial}`,type,path,target,controls,x:path[0].x,y:path[0].y,born:time,duration,flying,note:NOTES[type](target.place),observedAt:time+duration*(flying?.5:.5)};active.set(type,v);return v;
 }
 function tick(time,light='dusk',lampOn=true){
  for(const [type,v] of active)if(time-v.born>=v.duration||!allowed(type,light)){active.delete(type);next[type]=time+range(65000,145000);}
  const due=Object.entries(next).sort((a,b)=>a[1]-b[1]);
  for(const [type,when] of due){if(active.has(type)||!allowed(type,light)||time<when)continue;
   if(active.size>=2)continue;
   if(FLYERS.includes(type)&&[...active.values()].some(v=>v.flying))continue;
   spawn(type,time,lampOn);
  }return [...active.values()];
 }
 function depart(id,time){for(const [type,v] of active)if(v.id===id){if(v.flying){const p=sampleVisit(v,time);v.path=[p,p,{x:p.x<50?-5:105,y:Math.max(3,p.y-20)}];v.target=p;v.controls=[p,p,{x:p.x,y:p.y-6},{x:v.path[2].x,y:p.y-12}];v.born=time-v.duration*.76;v.nudged=true;}else{active.delete(type);next[type]=time+range(90000,150000);}}}
 return {tick,depart};
}
