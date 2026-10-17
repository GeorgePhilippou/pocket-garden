export const HOUR=3600000;
export const CATALOG={
 peace:{name:'Peace lily',note:'Deep green leaves and little ivory sails.',item:'Ivory bloom',first:12,regrow:18,dry:72,sprite:'peace'},
 lime:{name:'Lime foliage',note:'The bright, feathered leaves from your shelf.',item:'Leaf impression',first:8,regrow:10,dry:60,sprite:'lime'},
 trailing:{name:'Trailing green',note:'A little tangle for the blue-and-white pot.',item:'Little cutting',first:10,regrow:12,dry:84,sprite:'trailing'},
 basil:{name:'Basil',note:'A familiar visitor from your first garden.',item:'Basil leaves',first:12,regrow:6,dry:72,sprite:0},
 lavender:{name:'Lavender',note:'Quiet purple flower spikes.',item:'Lavender sprig',first:24,regrow:18,dry:96,sprite:2},
 strawberry:{name:'Strawberry',note:'A little pocket of summer.',item:'Strawberries',first:20,regrow:12,dry:60,sprite:3},
 marigold:{name:'Marigold',note:'A small burst of gold.',item:'Golden bloom',first:18,regrow:12,dry:72,sprite:1}
};
export const VISITORS={
 moth:{name:'Window moth',note:'Drawn to the warm little window. It was here from the beginning.',hint:'Look near the top of the window.'},
 ladybird:{name:'Little ladybug',note:'A little red gardener, resting among the leaves.',hint:'Give two plants a drink. Look among the leaves.'},
 bee:{name:'Little bumblebee',note:'A fuzzy golden visitor, stopping to explore the leaves.',hint:'Give a plant a drink, then look near the window in daylight or dusk.'},
 wasp:{name:'Golden wasp',note:'A slender striped explorer with delicate wings.',hint:'Gather a keepsake and tend twice. Watch the ivy in daylight or dusk.'},
 caterpillar:{name:'Little leaf crawler',note:'A soft green neighbour, taking the slow route.',hint:'Tend two kinds of plant. Look closely at the lime leaves.'},
 fox:{name:'The evening fox',note:'A quiet neighbour, passing outside your window.',hint:'Meet the moth and tend three times. Look outside at dusk or night.'}
};
export function createShelf(time=Date.now(),legacy=null){
 const plants={peace:{id:'peace',type:'peace',water:.78,growth:.84,cycles:0},lime:{id:'lime',type:'lime',water:.72,growth:.7,cycles:0},trailing:{id:'trailing',type:'trailing',water:.8,growth:1,cycles:0}};
 if(legacy?.plots)legacy.plots.forEach((p,i)=>{if(p&&CATALOG[p.type])plants[`legacy-${i}`]={id:`legacy-${i}`,type:p.type,water:Math.min(1,Math.max(0,p.water||0)),growth:Math.min(1,Math.max(0,p.growth||0)),cycles:p.regrowing?1:0};});
 return {version:2,startedAt:time,updatedAt:time,offset:0,revision:0,plants,slots:['peace','lime','trailing'],collection:{},discoveries:{},visits:{},care:0,tendedTypes:[],gathered:0,light:'dusk',sound:false,motion:true,onboarded:false,events:[],legacy:legacy||null};
}
export function loadShelf(raw,time=Date.now(),legacy=null,strict=false){
 try{
 const s=typeof raw==='string'?JSON.parse(raw):raw,plain=x=>x&&typeof x==='object'&&!Array.isArray(x),number=x=>Number.isFinite(x)&&x>=0;
 if(!plain(s)||s.version!==2||!plain(s.plants)||Object.keys(s.plants).length>100||!Array.isArray(s.slots)||s.slots.length!==3||new Set(s.slots).size!==3||!s.slots.every(id=>typeof id==='string'&&s.plants[id]))throw Error('Invalid plants');
 if(!Object.entries(s.plants).every(([id,p])=>plain(p)&&p.id===id&&CATALOG[p.type]&&number(p.growth)&&p.growth<=1&&number(p.water)&&p.water<=1&&number(p.cycles)&&(!p.nickname||(typeof p.nickname==='string'&&p.nickname.length<=36))))throw Error('Invalid specimen');
 if(!['startedAt','updatedAt','offset','revision','care','gathered'].every(k=>number(s[k]))||!['day','dusk','night'].includes(s.light)||typeof s.sound!=='boolean'||typeof s.motion!=='boolean')throw Error('Invalid preferences');
 if(!plain(s.collection)||!Object.entries(s.collection).every(([type,n])=>CATALOG[type]&&number(n))||!plain(s.discoveries)||!Object.entries(s.discoveries).every(([type,v])=>VISITORS[type]&&number(v?.time))||!plain(s.visits)||!Object.entries(s.visits).every(([type,t])=>VISITORS[type]&&number(t)))throw Error('Invalid journal');
 if(!Array.isArray(s.tendedTypes)||!s.tendedTypes.every(type=>CATALOG[type])||!Array.isArray(s.events)||s.events.length>40||!s.events.every(e=>typeof e.text==='string'&&e.text.length<=300&&number(e.time)))throw Error('Invalid history');
 return s;
 }catch{return strict?null:createShelf(time,legacy);}
}
export function grow(s,time){const dt=Math.max(0,time-s.updatedAt);for(const p of Object.values(s.plants)){const c=CATALOG[p.type],wet=Math.min(dt,p.water*c.dry*HOUR);p.growth=Math.min(1,p.growth+wet/((p.cycles?c.regrow:c.first)*HOUR));p.water=Math.max(0,p.water-dt/(c.dry*HOUR));}s.updatedAt=Math.max(time,s.updatedAt);return s;}
export function record(s,text,time){s.events.unshift({text,time});s.events=s.events.slice(0,40);}
export function tend(s,index,time){grow(s,time);const p=s.plants[s.slots[index]];if(!p)return false;const useful=p.water<.95;p.water=1;s.onboarded=true;if(useful){s.care++;if(!s.tendedTypes.includes(p.type))s.tendedTypes.push(p.type);record(s,`A little drink for ${CATALOG[p.type].name.toLowerCase()}.`,time);}return true;}
export function gather(s,index,time){grow(s,time);const p=s.plants[s.slots[index]];if(!p||p.growth<1)return null;const c=CATALOG[p.type];s.collection[p.type]=(s.collection[p.type]||0)+1;s.gathered++;p.growth=0;p.cycles++;s.onboarded=true;record(s,`Gathered ${c.item.toLowerCase()}.`,time);return c.item;}
export function swap(s,index,type,time){if(!CATALOG[type]||!Number.isInteger(index)||index<0||index>2)return false;grow(s,time);const same=Object.values(s.plants).find(p=>p.type===type);const id=same?.id||type;const occupied=s.slots.indexOf(id);if(occupied===index)return true;if(occupied>=0){const old=s.slots[index];s.slots[index]=id;s.slots[occupied]=old;}else{if(!same)s.plants[id]={id,type,water:.8,growth:.35,cycles:0};s.slots[index]=id;}record(s,`${CATALOG[type].name} found a new place on the shelf.`,time);return true;}
export function visitorAvailable(s,type,time){if(!VISITORS[type])return false;if(s.visits[type]&&time-s.visits[type]<20*60000)return false;if(type==='moth')return s.light!=='day';if(type==='ladybird')return s.tendedTypes.length>=2;if(type==='bee')return s.care>=1&&s.light!=='night';if(type==='wasp')return s.care>=2&&s.gathered>=1&&s.light!=='night';if(type==='caterpillar')return s.tendedTypes.length>=2;if(type==='fox')return !!s.discoveries.moth&&s.care>=3&&s.light!=='day';return false;}
export function discover(s,type,time){if(!visitorAvailable(s,type,time))return false;s.visits[type]=time;if(!s.discoveries[type]){s.discoveries[type]={time};record(s,`Met ${VISITORS[type].name.toLowerCase()}.`,time);}return true;}
export function milestones(s){return [
 {id:'water',name:'A little care',hint:'Water your first plant.',done:s.care>0},
 {id:'gather',name:'Something to keep',hint:'Gather a bloom, leaf impression, or cutting.',done:s.gathered>0},
 {id:'moth',name:'A light in the window',hint:'Meet the moth at dusk or night.',done:!!s.discoveries.moth},
 {id:'variety',name:'A welcoming shelf',hint:'Tend two different kinds of plant.',done:s.tendedTypes.length>=2},
 {id:'ladybird',name:'A little red visitor',hint:'Find the ladybird among the leaves.',done:!!s.discoveries.ladybird},
 {id:'fox',name:'A quiet neighbour',hint:'Tend three times and meet the evening fox.',done:!!s.discoveries.fox},
 {id:'bee',name:'A golden hello',hint:'Meet the little bee in daylight or dusk.',done:!!s.discoveries.bee},
 {id:'wasp',name:'A striped explorer',hint:'Gather, tend twice, and watch the ivy.',done:!!s.discoveries.wasp},
 {id:'caterpillar',name:'The slow route',hint:'Find the caterpillar after tending two kinds of plant.',done:!!s.discoveries.caterpillar},
 {id:'collection',name:'A growing collection',hint:'Gather something from three different plants.',done:Object.values(s.collection).filter(n=>n>0).length>=3}
 ];}
