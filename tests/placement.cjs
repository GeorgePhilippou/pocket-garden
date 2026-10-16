const {chromium}=require('/Users/georgephilippou/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{const raw=sessionStorage.getItem('qaGarden');if(raw)localStorage.setItem('pocket-garden-v1',raw);});
 await page.goto('http://127.0.0.1:5173');
 let checks=0;
 for(const [size,w,h] of [['desktop',1440,900],['wide',1920,1000],['ipad-landscape',1024,768],['ipad-portrait',768,1024],['phone',390,844],['short',844,390]]){
  await page.setViewportSize({width:w,height:h});
  for(const layout of ['compact','expanded']){
  for(const theme of ['courtyard','windowsill','night']){
   for(const [stage,growth,types] of [['sprout',0,['basil','marigold','lavender']],['seedling',.25,['strawberry','lavender','basil']],['growing',.55,['basil','marigold','lavender']],['mature',1,['strawberry','lavender','marigold']]]){
    await page.evaluate(({theme,growth,types})=>{const t=Date.now();sessionStorage.setItem('qaGarden',JSON.stringify({version:1,theme,offset:0,startedAt:t,updatedAt:t,plots:types.map(type=>({type,growth,water:.8}))}));},{theme,growth,types});
    await page.reload();if(layout==='expanded')await page.locator('#expand-button').click();await page.locator('.plant-art svg image').first().waitFor();
    const results=await page.evaluate(async()=>{
     const {SPRITES}=await import('/sprites.js?v=3');
     const scene=document.querySelector('.scene').getBoundingClientRect();
     return [...document.querySelectorAll('.plot')].map(plot=>{
      const art=plot.querySelector('.plant-art'),box=art.getBoundingClientRect(),anchor=plot.querySelector('.root-anchor').getBoundingClientRect();
      const spec=SPRITES.find(s=>s.name===art.dataset.rootedSprite);
      const actualRootX=box.left+(spec.rootX-spec.x)/spec.w*box.width;
      const actualRootY=box.bottom-1/spec.h*box.height;
      const label=plot.querySelector('.plot-label').getBoundingClientRect();
      return {dx:Math.abs(actualRootX-anchor.left),dy:Math.abs(actualRootY-anchor.top),rootY:(anchor.top-scene.top)/scene.height,artTop:box.top-scene.top,artLeft:box.left-scene.left,artRight:box.right-scene.right,labelBottom:(label.bottom-scene.top)/scene.height};
     });
    });
    for(const r of results){assert.ok(r.dx<1&&r.dy<2,`${size}/${theme}/${stage}: stem meets anchor ${JSON.stringify(r)}`);assert.ok(r.rootY>.53&&r.rootY<.59,`${size}: roots in soil`);assert.ok(r.artTop>=0&&r.artLeft>=0&&r.artRight<=0,`${size}: whole plant visible`);assert.ok(r.labelBottom<.72,`${size}: label stays above rim`);checks++;}
    if(theme==='courtyard'&&(size==='desktop'||size==='ipad-portrait')&&['sprout','mature'].includes(stage))await page.screenshot({path:`artifacts/v4-${size}-${layout}-${stage}.png`});
   }
  }
 }
 }
 assert.deepEqual(errors,[]);await browser.close();console.log(`PASS: ${checks} plant placements across 6 viewports, 2 layouts, 3 themes and 4 growth stages; root alignment, soil bounds, full sprite visibility and label clearance.`);
})().catch(e=>{console.error(e);process.exit(1)});
