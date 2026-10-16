import {sprite as oldSprite} from './sprites.js?v=5';
const BOUNDS={peace:[18,15,706,660],lime:[724,80,724,600],trailing:[1448,140,704,562]};
export function plantArt(type,cls=''){if(BOUNDS[type]){const b=BOUNDS[type];return `<span class="plant-art ${cls}" aria-hidden="true"><svg viewBox="${b.join(' ')}"><image href="assets/shelf/foliage.png" width="2172" height="724"/></svg></span>`;}const ids={basil:0,marigold:1,lavender:2,strawberry:3};return oldSprite(ids[type]??0,`plant-art ${cls}`);}
const PATTERNS={
 moth:['...a........a...','..abb......bba..','.abbbbc..cbbbba.','abbbbbbccbbbbbba','.abbbbccccbbbba.','..abbccccccbba..','...bccdccdcb....','..bbccdccdccbb..','...bccdccdcb....','....bcddddcb....','.....cddddc.....','......c..c......'],
 ladybird:['...kkkk...','..krrrrk..','.krrkrrrk.','krrrkkrrrk','krrrkkrrrk','.krrkrrrk.','..krrrrk..','...kkkk...'],
 fox:['..oo..........oo........','..obo........obo........','..owwoooooooowwo........','...owwwwwwwwwwo.........','...owkwwwwwkwo..........','....owwwbwwwo...........','.....owwwwwo............','......ooooo...oooo......','......oooooo.ooooo......','......oooooooooooww.....','......ooooooooooowww....','......ooooooooooooww....','.......oo...oo..........','.......bb...bb..........']
};
const COLORS={a:'#f6d48b',b:'#ffe8ba',c:'#d5ac6d',d:'#726047',k:'#263c2b',r:'#db5b3c',o:'#d78044',w:'#f1d7a0'};
export function creature(type){const p=PATTERNS[type];return `<svg viewBox="0 0 ${p[0].length} ${p.length}" aria-hidden="true" class="critter-art">${p.flatMap((row,y)=>[...row].map((c,x)=>c==='.'?'':`<rect x="${x}" y="${y}" width="1" height="1" fill="${COLORS[c]}"/>`)).join('')}</svg>`;}
