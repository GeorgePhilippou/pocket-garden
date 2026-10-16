const {chromium}=require('/Users/georgephilippou/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:"chrome"});
 const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto('http://127.0.0.1:5173');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'artifacts/courtyard-desktop.png',fullPage:true});
 await page.locator('#seeds-button').click();assert.equal(await page.locator('#seed-drawer').isVisible(),true);
 await page.locator('[data-seed="lavender"]').click();await page.locator('[data-plot="2"]').click();
 let s=await page.evaluate(()=>JSON.parse(localStorage.getItem('pocket-garden-v1')));assert.equal(s.plots[2].type,'lavender');
 await page.locator('#water-button').click();s=await page.evaluate(()=>JSON.parse(localStorage.getItem('pocket-garden-v1')));assert.equal(s.plots[2].water,1);
 await page.locator('#skip-time').click();s=await page.evaluate(()=>JSON.parse(localStorage.getItem('pocket-garden-v1')));assert.ok(s.plots[2].growth>=.25);assert.ok(s.plots[2].growth<.26);
 await page.locator('#info-button').click();assert.equal(await page.locator('#info-dialog').isVisible(),true);assert.equal(await page.locator('#dialog-content h3').textContent(),'Lavender');await page.locator('#dialog-done').click();
 await page.locator('[data-theme-choice="night"]').click();await page.waitForTimeout(1700);await page.screenshot({path:'artifacts/moonlight-desktop.png',fullPage:true});
 await page.reload();assert.equal(await page.locator('body').getAttribute('data-theme'),'night');s=await page.evaluate(()=>JSON.parse(localStorage.getItem('pocket-garden-v1')));assert.equal(s.plots[2].type,'lavender');
 await page.locator('[data-theme-choice="windowsill"]').click();await page.waitForTimeout(500);await page.screenshot({path:'artifacts/windowsill-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.locator('#info-button').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#info-dialog').isVisible(),false);
 await page.locator('#help-button').click();assert.equal(await page.locator('#info-dialog').isVisible(),true);await page.keyboard.press('Escape');
 // Reload after 12 hours offline: new growth is computed on arrival.
 await page.addInitScript(()=>{const raw=localStorage.getItem('pocket-garden-v1');if(raw){const s=JSON.parse(raw);s.updatedAt-=12*3600000;localStorage.setItem('pocket-garden-v1',JSON.stringify(s));}});await page.reload();s=await page.evaluate(()=>JSON.parse(localStorage.getItem('pocket-garden-v1')));assert.ok(s.plots[2].growth>=.75);
 assert.deepEqual(errors,[]);
 console.log('PASS: planting, watering, 6h growth, plant info, 3 themes, saved reload, offline growth, mobile overflow, dialog Escape; no browser or asset errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
