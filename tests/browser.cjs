const {chromium}=require('/Users/georgephilippou/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto('http://127.0.0.1:5173');await page.evaluate(()=>document.fonts.ready);
 const options=()=>page.locator('#options-button').click(),close=()=>page.locator('#options-done').click(),garden=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('pocket-garden-v1')));
 assert.equal(await page.locator('body').getAttribute('data-layout'),'compact');let r=await page.locator('.cabinet').boundingBox();assert.ok(r.width<=560&&r.height<=480);
 await page.screenshot({path:'artifacts/v4-desktop-compact.png'});
 // Dragging stays within the page; expansion remains bounded.
 const head=await page.locator('.game-title h1').boundingBox();await page.mouse.move(head.x+head.width/2,head.y+head.height/2);await page.mouse.down();await page.mouse.move(120,150,{steps:8});await page.mouse.up();r=await page.locator('.cabinet').boundingBox();assert.ok(r.x>=8&&r.y>=8);assert.ok(r.x<400);
 for(const [name,width,height] of [['desktop',1440,900],['laptop',1366,768],['ipad-landscape',1024,768],['ipad-portrait',768,1024],['mobile',390,844],['phone-landscape',844,390],['small-window',580,530]]){
  await page.setViewportSize({width,height});
  for(const layout of ['compact','expanded']){
   if(await page.locator('body').getAttribute('data-layout')!==layout)await page.locator('#expand-button').click();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight),false);
   const panel=await page.locator('.cabinet').boundingBox();assert.ok(panel.x>=0&&panel.y>=0&&panel.x+panel.width<=width&&panel.y+panel.height<=height,`${name}/${layout}: bounded`);
   for(const id of ['#seeds-button','#water-button','#info-button','#collection-button','#options-button','#expand-button']){const b=await page.locator(id).boundingBox();assert.ok(b.x>=0&&b.y>=0&&b.x+b.width<=width&&b.y+b.height<=height,`${name}: ${id} visible`);}
   await page.locator('#seeds-button').click();let drawer=await page.locator('#seed-drawer').boundingBox();assert.ok(drawer.y>=0&&drawer.y+drawer.height<height);await page.locator('[data-seed="lavender"]').click();assert.equal(await page.locator('#seed-drawer').isVisible(),false);await page.keyboard.press('Escape');
   await options();await close();
   if(['mobile','small-window','ipad-portrait','desktop'].includes(name))await page.screenshot({path:`artifacts/v4-${name}-${layout}.png`});
  }
 }
 // Mature basil can be collected once, remains visible, and regrows.
 await page.setViewportSize({width:1440,height:900});if(await page.locator('body').getAttribute('data-layout')!=='compact')await page.locator('#expand-button').click();
 await page.locator('[data-plot="0"]').click();assert.equal(await page.locator('#info-dialog').isVisible(),true);assert.equal(await page.locator('#harvest-button').isEnabled(),true);await page.locator('#harvest-button').click();
 assert.equal((await garden()).collection.basil,3);assert.equal((await garden()).plots[0].regrowing,true);assert.equal(await page.locator('#harvest-button').isDisabled(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('[data-plot="0"] .plant-art').getAttribute('data-rooted-sprite'),'basil');
 await page.locator('#collection-button').click();assert.match(await page.locator('#dialog-content').textContent(),/3 things/);await page.screenshot({path:'artifacts/v4-collection.png'});await page.keyboard.press('Escape');
 await page.locator('#seeds-button').click();await page.locator('[data-seed="lavender"]').click();await page.locator('[data-plot="2"]').click();assert.equal((await garden()).plots[2].type,'lavender');await page.locator('#water-button').click();assert.equal((await garden()).plots[2].water,1);
 await options();await page.locator('#skip-time').click();assert.equal((await garden()).plots[0].growth,1);assert.ok((await garden()).plots[2].growth>=.25);await page.locator('[data-theme-choice="night"]').click();await close();await page.waitForTimeout(1700);await page.screenshot({path:'artifacts/v4-night-compact.png'});
 await page.reload();assert.equal((await garden()).collection.basil,3);assert.equal(await page.locator('body').getAttribute('data-layout'),'compact');assert.equal(await page.locator('body').getAttribute('data-theme'),'night');
 await options();await page.locator('[data-theme-choice="windowsill"]').click();await close();
 // Popup is explicitly user-triggered and shares progress through the same origin.
 await options();const popupPromise=page.waitForEvent('popup');await page.locator('#small-window-button').click();const popup=await popupPromise;await popup.waitForLoadState();assert.equal(await popup.locator('body').getAttribute('data-layout'),'compact');assert.equal(await popup.evaluate(()=>JSON.parse(localStorage.getItem('pocket-garden-v1')).collection.basil),3);await popup.close();
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: compact/expanded at 7 sizes, bounded dragging, visible controls, seed overlay, harvest once, persistent collection, mature regrowth artwork, repeat crop timing, planting, watering, themes, reload and separate window.');
})().catch(e=>{console.error(e);process.exit(1)});
