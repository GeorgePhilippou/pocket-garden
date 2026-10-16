export const PLANTS = {
 basil:{name:'Basil',sprite:0,hours:12,label:'A happy little herb',description:'Big green leaves and a sunny disposition. The quickest little grower in your garden.'},
 marigold:{name:'Marigold',sprite:1,hours:18,label:'A pocket of sunshine',description:'A burst of golden petals to brighten your pot. Give it time and it will bring the sunshine.'},
 lavender:{name:'Lavender',sprite:2,hours:24,label:'Slow, soft, and purple',description:'Quiet purple flower spikes, growing at their own pace. Good things are worth a little patience.'},
 strawberry:{name:'Strawberry',sprite:3,hours:20,label:'Something a little sweet',description:'A little tangle of leaves with bright red berries. A tiny bit of summer, right here on your desk.'}
};
const HOUR=3600000, DRY_TIME=72*HOUR;
export function createGarden(time=Date.now()) { return {version:1,theme:'courtyard',offset:0,startedAt:time,updatedAt:time,plots:[{type:'basil',growth:1,water:.78},{type:'marigold',growth:.48,water:.78},null]}; }
export function advanceGarden(state,time) {
 const elapsed=Math.max(0,time-state.updatedAt);
 for(const p of state.plots) {if(!p)continue;const wetDuration=Math.min(elapsed,p.water*DRY_TIME);p.growth=Math.min(1,p.growth+wetDuration/((p.regrowing ? HARVEST[p.type].regrowHours : PLANTS[p.type].hours)*HOUR));p.water=Math.max(0,p.water-elapsed/DRY_TIME);}
 state.updatedAt=Math.max(state.updatedAt,time); return state;
}
export function plantSeed(state,index,type,time) { if(!PLANTS[type]||!Number.isInteger(index)||index<0||index>=3||state.plots[index])return false;advanceGarden(state,time);state.plots[index]={type,growth:0,water:.7};return true; }
export function waterGarden(state){for(const p of state.plots)if(p)p.water=1;}
export function waterLevel(state){const plants=state.plots.filter(Boolean);return plants.length?plants.reduce((sum,p)=>sum+p.water,0)/plants.length:0;}
export function stageOf(plant){return plant.regrowing&&plant.growth<1?'regrowing':plant.growth<.17?'sprout':plant.growth<.43?'seedling':plant.growth<1?'growing':'fully grown';}

export const HARVEST = {
 basil:{action:'Pick leaves',item:'Basil leaves',unit:'leaves',yield:3,regrowHours:6},
 marigold:{action:'Collect flowers',item:'Marigold flowers',unit:'flowers',yield:1,regrowHours:12},
 lavender:{action:'Collect sprigs',item:'Lavender sprigs',unit:'sprigs',yield:1,regrowHours:18},
 strawberry:{action:'Pick berries',item:'Strawberries',unit:'berries',yield:3,regrowHours:12}
};
export function ensureCollection(state) {
 if(!state.collection||typeof state.collection!=='object'||Array.isArray(state.collection))state.collection={};
 for(const type of Object.keys(PLANTS))if(!Number.isFinite(state.collection[type])||state.collection[type]<0)state.collection[type]=0;
 return state;
}
export function harvestPlant(state,index,time) {
 if(!Number.isInteger(index)||index<0||index>=3)return null;
 advanceGarden(state,time);
 const p=state.plots[index];if(!p||p.growth<1)return null;
 ensureCollection(state);
 const h=HARVEST[p.type];state.collection[p.type]+=h.yield;p.growth=0;p.regrowing=true;
 return {type:p.type,amount:h.yield,item:h.item};
}
