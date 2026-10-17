import {sprite as oldSprite} from './sprites.js?v=6';
export const FOLIAGE={peace:{box:[18,15,706,660],root:[418,660]},lime:{box:[724,80,724,600],root:[1094,660]},trailing:{box:[1448,140,704,562],root:[1784,660]}};
const BOUNDS=Object.fromEntries(Object.entries(FOLIAGE).map(([id,s])=>[id,s.box]));
export const POTS=[{x:342,y:850,width:28},{x:783,y:850,width:26},{x:1041,y:858,width:26}];
export function plantArt(type,cls=''){if(BOUNDS[type]){const b=BOUNDS[type];return `<span class="plant-art ${cls}" aria-hidden="true"><svg viewBox="${b.join(' ')}"><image href="assets/shelf/foliage.png" width="2172" height="724"/></svg></span>`;}const ids={basil:0,marigold:1,lavender:2,strawberry:3};return oldSprite(ids[type]??0,`plant-art ${cls}`);}
const PATTERNS={
 moth:['...a........a...','..abb......bba..','.abbbbc..cbbbba.','abbbbbbccbbbbbba','.abbbbccccbbbba.','..abbccccccbba..','...bccdccdcb....','..bbccdccdccbb..','...bccdccdcb....','....bcddddcb....','.....cddddc.....','......c..c......'],
 ladybird:['...kkkk...','..krrrrk..','.krrkrrrk.','krrrkkrrrk','krrrkkrrrk','.krrkrrrk.','..krrrrk..','...kkkk...'],
 fox:['..oo..........oo........','..obo........obo........','..owwoooooooowwo........','...owwwwwwwwwwo.........','...owkwwwwwkwo..........','....owwwbwwwo...........','.....owwwwwo............','......ooooo...oooo......','......oooooo.ooooo......','......oooooooooooww.....','......ooooooooooowww....','......ooooooooooooww....','.......oo...oo..........','.......bb...bb..........']
};
const COLORS={a:'#f6d48b',b:'#ffe8ba',c:'#d5ac6d',d:'#726047',k:'#263c2b',r:'#db5b3c',o:'#d78044',w:'#f1d7a0'};
export const INSECTS={moth:[18,104,515,365],bee:[585,68,440,427],wasp:[1054,67,470,441],ladybird:[73,599,425,337],caterpillar:[542,613,474,311]};
export function creature(type){
 if(INSECTS[type]){const b=INSECTS[type];return `<svg viewBox="${b.join(' ')}" aria-hidden="true" class="critter-art" data-insect-art="${type}"><image href="assets/shelf/insects.png" width="1536" height="1024"/></svg>`;}
 const p=PATTERNS[type];return `<svg viewBox="0 0 ${p[0].length} ${p.length}" aria-hidden="true" class="critter-art">${p.flatMap((row,y)=>[...row].map((c,x)=>c==='.'?'':`<rect x="${x}" y="${y}" width="1" height="1" fill="${COLORS[c]}"/>`)).join('')}</svg>`;
}
export function rootedPlantArt(type){
 const old={basil:{box:[43,55,465,481],root:[279,535]},marigold:{box:[566,66,452,478],root:[777,543]},lavender:{box:[1077,58,419,497],root:[1293,554]},strawberry:{box:[64,594,432,367],root:[289,960]}};
 const spec=FOLIAGE[type]||old[type],b=spec.box,x=(spec.root[0]-b[0])/b[2]*100,y=(spec.root[1]-b[1])/b[3]*100;
 const file=FOLIAGE[type]?'assets/shelf/foliage.png':'assets/plants.png',w=FOLIAGE[type]?2172:1536,h=FOLIAGE[type]?724:1024;
 return `<span class="plant-art rooted-art" data-stem-x="${x}" data-stem-y="${y}" style="aspect-ratio:${b[2]}/${b[3]};transform:translate(-${x}%,-${y}%);transform-origin:${x}% ${y}%"><svg viewBox="${b.join(' ')}"><image href="${file}" width="${w}" height="${h}"/></svg></span>`;
}
export function frontRims(){return `<svg class="pot-fronts" viewBox="0 0 1448 1086" aria-hidden="true"><defs><clipPath id="pot-front-clip"><path d="M255 825 Q342 863 430 825 L430 954 H255ZM703 826 Q783 861 865 826 L865 954 H703ZM963 835 Q1041 870 1119 835 L1119 963 H963Z"/></clipPath></defs><image href="assets/shelf/room.png" width="1448" height="1086" clip-path="url(#pot-front-clip)"/></svg>`;}
export function legoFlower(){return `<svg viewBox="275 74 735 743" aria-hidden="true"><image href="assets/shelf/lego-flower.png" width="1216" height="1293"/></svg>`;}
