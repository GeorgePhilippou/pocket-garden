// Scene coordinates are percentages of the approved, unified 4:3 artwork.
export const LEAF_SITES=[{x:18,y:62},{x:25,y:68},{x:31,y:65},{x:23,y:57},{x:51,y:65},{x:57,y:69},{x:60,y:61},{x:73,y:73},{x:77,y:69}];
const AIR_SITES=[{x:17,y:19},{x:34,y:11},{x:51,y:9},{x:68,y:13},{x:79,y:26},{x:35,y:35},{x:47,y:48},{x:69,y:49},{x:83,y:56},{x:38,y:65},{x:12,y:49},{x:75,y:76}];
export const FLYERS=['moth','bee','wasp'];
const ALL=['moth','bee','wasp','ladybird','caterpillar','fox'];
export function makeVisitorLife(random=Math.random,start=0){
 let serial=0;const active=new Map(),lastSite={},next={moth:start+700,bee:start+6000,wasp:start+16000,ladybird:start+4000,caterpillar:start+9000,fox:start+55000};
 const range=(a,b)=>a+random()*(b-a);
 function choose(type,pool){let i=Math.floor(random()*pool.length);if(i===lastSite[type])i=(i+1+Math.floor(random()*(pool.length-1)))%pool.length;lastSite[type]=i;return {...pool[i]};}
 function allowed(type,light){return type==='moth'||type==='fox'?light!=='day':type==='bee'||type==='wasp'?light!=='night':true;}
 function spawn(type,time){const flying=FLYERS.includes(type);const p=type==='fox'?choose(type+'-arrival',[{x:39,y:48},{x:42,y:47},{x:40,y:52}]):choose(type+'-arrival',flying?AIR_SITES:LEAF_SITES);let path=[p];
  if(flying){
   // Small connected arcs: each visit explores a neighbourhood rather than zigzagging across the painting.
   const heading=range(0,Math.PI*2),span=type==='moth'?16:22,bend=range(-7,7);
   for(let i=1;i<=8;i++){const t=i/8,along=span*t,cross=Math.sin(t*Math.PI*2)*bend;
    path.push({x:Math.max(6,Math.min(85,p.x+Math.cos(heading)*along-Math.sin(heading)*cross)),y:Math.max(5,Math.min(79,p.y+Math.sin(heading)*along+Math.cos(heading)*cross))});
   }
  }
  else if(type==='fox')path=[p,{x:p.x+1,y:p.y},p];
  else path=[p,{x:p.x+.5,y:p.y-.2},p];
  const duration=flying?range(24000,38000):type==='fox'?range(15000,21000):range(32000,48000);
  const visit={id:`${type}-${++serial}`,type,path,x:p.x,y:p.y,born:time,duration,flying};active.set(type,visit);return visit;
 }
 function tick(time,light='dusk'){
  for(const [type,v] of active)if(time-v.born>=v.duration||!allowed(type,light)){active.delete(type);next[type]=time+range(type==='fox'?65000:9000,type==='fox'?150000:28000);}
  for(const type of ALL){if(active.has(type)||!allowed(type,light)||time<next[type])continue;if(FLYERS.includes(type)&&[...active.values()].filter(v=>v.flying).length>=2)continue;spawn(type,time);}
  return [...active.values()];
 }
 function depart(id,time){for(const [type,v] of active)if(v.id===id){active.delete(type);next[type]=time+range(12000,26000);}}
 return {tick,depart};
}
