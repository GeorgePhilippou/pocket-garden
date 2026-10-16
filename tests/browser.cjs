const {chromium}=require('/Users/georgephilippou/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto('http://127.0.0.1:5173');await page.evaluate(()=>document.fonts.ready);
 const options=async()=>{await page.locator('#options-button').click();};
 const close=async()=>{await page.locator('#options-done').click();};
 const garden=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('pocket-garden-v1')));
 for(const [name,width,height] of [['desktop',1440,900],['laptop',1366,768],['ipad-landscape',1024,768],['ipad-portrait',768,1024],['mobile',390,844],['phone-landscape',844,390]]){
  await page.setViewportSize({width,height});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight),false,`${name}: no page overflow`);
  const cabinet=await page.locator('.cabinet').boundingBox();assert.ok(cabinet.width>=width-2&&cabinet.height>=height-2,`${name}: fills viewport`);
  for(const id of ['#seeds-button','#water-button','#info-button','#options-button']){const r=await page.locator(id).boundingBox();assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=width&&r.y+r.height<=height,`${name}: ${id} is within viewport`);assert.ok(r.height>=30,`${name}: touch target`);}
  await page.screenshot({path:`artifacts/v2-${name}.png`});
  await page.locator('#seeds-button').click();assert.equal(await page.locator('#seed-drawer').isVisible(),true);
  const drawer=await page.locator('#seed-drawer').boundingBox();assert.ok(drawer.y>=0&&drawer.y+drawer.height<height,`${name}: seed drawer fits`);
  await page.locator('[data-seed="lavender"]').click();assert.equal(await page.locator('[data-plot="2"]').isVisible(),true);
  await page.locator('#close-seeds').click();
  await options();assert.equal(await page.locator('#options-dialog').isVisible(),true);await close();
 }
 await page.setViewportSize({width:1024,height:768});
 await page.locator('#seeds-button').click();await page.locator('[data-seed="lavender"]').click();await page.locator('[data-plot="2"]').click();assert.equal((await garden()).plots[2].type,'lavender');
 await page.locator('#water-button').click();assert.equal((await garden()).plots[2].water,1);
 await options();await page.locator('#skip-time').click();assert.ok((await garden()).plots[2].growth>=.25);await page.locator('[data-theme-choice="night"]').click();await close();await page.waitForTimeout(1700);await page.screenshot({path:'artifacts/v2-moonlight.png'});
 await page.locator('#info-button').click();assert.equal(await page.locator('#dialog-content h3').textContent(),'Lavender');assert.match(await page.locator('#dialog-content').textContent(),/Full size in about 18h/);await page.keyboard.press('Escape');
 await page.reload();assert.equal(await page.locator('body').getAttribute('data-theme'),'night');assert.equal((await garden()).plots[2].type,'lavender');
 await options();await page.locator('[data-theme-choice="windowsill"]').click();await close();await page.waitForTimeout(400);await page.screenshot({path:'artifacts/v2-windowsill.png'});
 await page.locator('#help-button').click();assert.match(await page.locator('#dialog-content').textContent(),/no harvesting/);await page.keyboard.press('Escape');
 await page.addInitScript(()=>{const raw=localStorage.getItem('pocket-garden-v1');if(raw){const s=JSON.parse(raw);s.updatedAt-=12*3600000;localStorage.setItem('pocket-garden-v1',JSON.stringify(s));}});await page.reload();assert.ok((await garden()).plots[2].growth>=.75);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: 6 viewport layouts, visible tools, seed overlay bounds, options, planting, watering, growth, inspection milestones, all themes, persistence, offline growth; no browser/asset errors.');
})().catch(e=>{console.error(e);process.exit(1)});
