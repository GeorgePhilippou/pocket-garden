// Measured opaque bounds and stem tips in the original 1536 × 1024 atlas.
// Cropping at display time isolates each sprite without changing the artwork.
export const SPRITES = [
 {name:'basil',x:43,y:55,w:465,h:481,rootX:279},
 {name:'marigold',x:566,y:66,w:452,h:478,rootX:777},
 {name:'lavender',x:1077,y:58,w:419,h:497,rootX:1293},
 {name:'strawberry',x:64,y:594,w:432,h:367,rootX:289},
 {name:'seedling',x:628,y:706,w:343,h:226,rootX:794},
 {name:'sprout',x:1213,y:782,w:193,h:156,rootX:1308},
];
export function sprite(index, className='') {
 const s=SPRITES[index];
 return `<span aria-hidden="true" class="sprite ${className}" data-sprite="${s.name}"><svg viewBox="${s.x} ${s.y} ${s.w} ${s.h}" preserveAspectRatio="xMidYMax meet"><image href="assets/plants.png" width="1536" height="1024"/></svg></span>`;
}
export function plantedSprite(index,growth) {
 const s=SPRITES[index];
 const scale=index===5 ? .28+growth*.5 : index===4 ? .46+growth*.25 : .78+growth*.22;
 const width=scale*(index===2?.86:index===1?.94:1)*100;
 const root=(s.rootX-s.x)/s.w*100;
 return `<span class="soil-shadow" aria-hidden="true"></span><span class="plant-art" data-rooted-sprite="${s.name}" style="width:${width}%;aspect-ratio:${s.w}/${s.h};transform:translateX(-${root}%);">${sprite(index)}</span><span class="root-anchor" aria-hidden="true"></span>`;
}
