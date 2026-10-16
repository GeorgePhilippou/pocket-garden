import { sprite, plantedSprite } from './sprites.js?v=3';
import { PLANTS, createGarden, advanceGarden, plantSeed, waterGarden, stageOf, waterLevel } from './garden.js';
const $ = (s) => document.querySelector(s);
const STORAGE_KEY = 'pocket-garden-v1';
let state;
try { const raw = localStorage.getItem(STORAGE_KEY); state = raw ? JSON.parse(raw) : null; if (!state || state.version !== 1 || !Array.isArray(state.plots) || state.plots.length !== 3 || !state.plots.every(p=>p === null || (PLANTS[p.type] && Number.isFinite(p.growth) && Number.isFinite(p.water))) || !Number.isFinite(state.updatedAt) || !Number.isFinite(state.offset) || !Number.isFinite(state.startedAt)) state = createGarden(); } catch { state = createGarden(); }
if (!['courtyard', 'windowsill', 'night'].includes(state.theme)) state.theme = 'courtyard';
let selected = 0, chosenSeed = null, seedsOpen = false, sound = false, audio;
const now = () => Date.now() + state.offset;
function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); $('#save-status').textContent = 'SAVED ON THIS BROWSER'; } catch { $('#save-status').textContent = 'THIS SESSION ONLY · SAVING UNAVAILABLE'; } }
function sync() { advanceGarden(state, now()); save(); }
function icon(name, cls = '') { return `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`; }
function spriteIndex(plant) { return plant.growth < .17 ? 5 : plant.growth < .43 ? 4 : PLANTS[plant.type].sprite; }
function status(plant) { return plant.water < .2 ? 'THIRSTY' : plant.growth >= 1 ? 'HAPPY' : 'GROWING'; }
function message(text) { $('#message').textContent = text; }
function chime(notes = [523, 659]) { if (!sound) return; try { audio ||= new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === 'suspended') audio.resume(); notes.forEach((frequency, i) => { const oscillator = audio.createOscillator(), gain = audio.createGain(); oscillator.type = 'triangle'; oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.025, audio.currentTime + i * .10); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + i * .10 + .15); oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(audio.currentTime + i * .10); oscillator.stop(audio.currentTime + i * .10 + .17); }); } catch {} }
function remaining(plant) { return plant.growth >= 1 ? 'FULLY GROWN' : plant.water <= 0 ? 'WAITING FOR WATER' : `${Math.max(1,Math.ceil((1-plant.growth)*PLANTS[plant.type].hours))}H TO GROW`; }
function render() {
 const focused=document.activeElement;
 const focusSelector=focused?.matches('[data-plot]')?`[data-plot="${focused.dataset.plot}"]`:focused?.matches('[data-select]')?`[data-select="${focused.dataset.select}"]`:null;
 document.body.dataset.theme = state.theme;
 document.querySelectorAll('[data-theme-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === state.theme)));
 $('#scene-caption').textContent = ({courtyard:'YOUR LITTLE COURTYARD',windowsill:'A SUNNY LITTLE WINDOWSILL',night:'UNDER THE SAME LITTLE MOON'})[state.theme];
 $('#day').textContent = `DAY ${String(Math.floor((now() - state.startedAt) / 86400000) + 1).padStart(2,'0')}`;
 $('#plots').innerHTML = state.plots.map((plant, i) => `<button class="plot ${selected === i && plant ? 'selected' : ''}" data-plot="${i}" aria-label="${plant ? `${PLANTS[plant.type].name}, ${status(plant).toLowerCase()}, ${Math.floor(plant.growth * 100)} percent grown` : `Empty planting spot ${i + 1}${chosenSeed ? `, plant ${PLANTS[chosenSeed].name}` : ', choose seeds to plant'}`}">${plant ? plantedSprite(spriteIndex(plant),plant.growth) : '<span class="empty-patch" aria-hidden="true">+</span>'}<span class="plot-label">${plant ? PLANTS[plant.type].name.toUpperCase() : chosenSeed ? 'PLANT HERE' : 'EMPTY PATCH'}</span></button>`).join('');
 $('#plant-list').innerHTML = state.plots.map((plant, i) => `<button class="plant-select ${plant ? '' : 'empty'}" data-select="${i}" aria-pressed="${selected === i}" aria-label="${plant ? `Select ${PLANTS[plant.type].name}` : `Plant in empty spot ${i + 1}`}">${sprite(plant ? spriteIndex(plant) : 5)}<span><span class="plant-name">${plant ? PLANTS[plant.type].name.toUpperCase() : 'EMPTY'}</span><small>${plant ? (plant.water < .2 ? 'THIRSTY' : remaining(plant)) : '+ PLANT'}</small></span></button>`).join('');
 const water = waterLevel(state), filled = Math.ceil(water * 4);
 $('#soil-drops').innerHTML = [0,1,2,3].map(i => icon('drop', i >= filled ? 'off' : '')).join('');
 $('#soil-status').textContent = water < .2 ? 'NEEDS A DRINK' : water < .5 ? 'A LITTLE DRY' : 'JUST RIGHT';
 $('#scene').classList.toggle('planting',!!chosenSeed);
 if(focusSelector)$(focusSelector)?.focus({preventScroll:true});
}
function renderSeeds() { $('#seed-options').innerHTML = Object.entries(PLANTS).map(([key, p]) => `<button class="seed-option" data-seed="${key}" aria-pressed="${chosenSeed === key}">${sprite(p.sprite)}<span><strong>${p.name.toUpperCase()}</strong><small>${p.label}</small><small class="seed-time">${p.hours}h to full size</small></span></button>`).join(''); }
function openSeeds(open = true) { seedsOpen = open; $('#seed-drawer').hidden = !open; $('#seeds-button').setAttribute('aria-expanded',String(open)); if (!open) { chosenSeed = null; render(); } else { $('#seed-hint').textContent = chosenSeed ? `${PLANTS[chosenSeed].name} selected. Tap an empty patch of soil.` : 'Choose a seed, then tap an empty patch of soil.'; renderSeeds(); message('Choose your seeds, then click an empty patch in the pot.'); } }
function choosePlot(i) {
 sync();
 if (state.plots[i]) { selected = i; if (chosenSeed) message('That spot already has a plant. Choose an empty patch for your seeds.'); else message(`${PLANTS[state.plots[i].type].name}: ${status(state.plots[i]).toLowerCase()}. Choose INSPECT to take a closer look.`); }
 else if (chosenSeed) { const name = PLANTS[chosenSeed].name; plantSeed(state,i,chosenSeed,now()); selected = i; chosenSeed = null; save(); renderSeeds(); message(`${name} planted! A little water and a little time will do wonders.`); chime([392,523,659]); if (state.plots.every(Boolean)) openSeeds(false); }
 else { selected = i; openSeeds(); message('A little empty patch. Pick a seed below to make it yours.'); }
 render();
}
$('#plots').addEventListener('click',e => { const b=e.target.closest('[data-plot]'); if(b)choosePlot(Number(b.dataset.plot)); });
$('#plant-list').addEventListener('click',e => { const b=e.target.closest('[data-select]'); if(b)choosePlot(Number(b.dataset.select)); });
$('#seeds-button').addEventListener('click',() => { openSeeds(!seedsOpen); chime([440]); });
$('#close-seeds').addEventListener('click',() => { openSeeds(false); $('#seeds-button').focus(); });
$('#seed-options').addEventListener('click',e => { const b=e.target.closest('[data-seed]'); if(!b)return; chosenSeed=b.dataset.seed; renderSeeds(); render(); $('#seed-hint').textContent = `${PLANTS[chosenSeed].name} selected. Click an empty patch in the pot above.`; message(`${PLANTS[chosenSeed].name} seeds ready. Tap an empty patch of soil.`); seedsOpen=false; $('#seed-drawer').hidden=true; $('#seeds-button').setAttribute('aria-expanded','false'); $('#scene').classList.add('planting'); $('[data-plot="'+state.plots.findIndex(p=>!p)+'"]')?.focus({preventScroll:true}); chime([659]); });
$('#water-button').addEventListener('click',() => { sync(); const hadPlants=state.plots.some(Boolean); waterGarden(state); save(); render(); message(hadPlants?'A little drink for everyone. The soil is lovely and moist.':'The soil is ready. Pick some seeds to bring your garden to life.'); $('#scene').classList.remove('watering'); void $('#scene').offsetWidth; $('#scene').classList.add('watering'); setTimeout(()=>$('#scene').classList.remove('watering'),1600); chime([440,554,659]); });
document.querySelectorAll('[data-theme-choice]').forEach(b=>b.addEventListener('click',()=>{state.theme=b.dataset.themeChoice;save();render();chime([523]);}));
function showDialog(content, eyebrow='GARDEN NOTES') { $('#options-dialog').close(); $('#dialog-eyebrow').textContent=eyebrow; $('#dialog-content').innerHTML=content; $('#info-dialog').showModal(); }
function plantInfo() { sync(); render(); const p=state.plots[selected]; if(!p){showHelp();return;} const plant=PLANTS[p.type]; showDialog(`${sprite(spriteIndex(p),'detail-plant')}<h3>${plant.name}</h3><p>${plant.description}</p><div class="detail-row"><span>Feeling</span><span>${status(p).toLowerCase()}</span></div><div class="detail-row"><span>Growth</span><span>${Math.floor(p.growth*100)}% · ${stageOf(p)}</span></div><div class="growth-track" role="progressbar" aria-label="Plant growth" aria-valuenow="${Math.floor(p.growth*100)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${p.growth*100}%"></span></div><div class="growth-stages">${['sprout','seedling','growing','fully grown'].map(stage=>`<span class="${stageOf(p)===stage?'current':''}">${stage}</span>`).join('')}</div><div class="detail-row"><span>Next milestone</span><span>${p.growth >= 1 ? 'Settled in · here to stay' : p.water <= 0 ? 'Water to resume growth' : `Full size in about ${Math.max(1,Math.ceil((1-p.growth)*plant.hours))}h`}</span></div><div class="detail-row"><span>Soil moisture</span><span>${Math.round(p.water*100)}%</span></div><p>About ${plant.hours} hours from seed to full size with moist soil. Dry plants rest until you water them. Mature plants stay in your pot; there is no harvesting in this version.</p>`, 'A CLOSER LOOK'); }
function showHelp(){showDialog(`<h3>Plant. Tend. Enjoy.</h3><p><strong>Plant:</strong> choose a seed, then tap an empty patch of soil. Each plant grows through sprout, seedling, growing, and full size.</p><table class="growth-table" aria-label="Growth times with moist soil">${Object.values(PLANTS).map(p=>`<tr><td>${p.name}</td><td>${p.hours} hours</td></tr>`).join('')}</table><p><strong>Water:</strong> one drink waters the whole pot. Soil dries slowly over three days. Dry plants pause; they never die.</p><p><strong>Inspect:</strong> select a plant and check its stage, moisture, and time to full size. Plants keep growing between visits.</p><p><strong>Enjoy:</strong> mature plants stay in the garden. There is no harvesting or replanting in this prototype.</p><p>Options holds themes, optional sound, and a +6 hour preview that advances your saved garden. Themes do not change growth speed.</p><p>Your garden saves in this browser on this device. It does not sync across devices. Keyboard: 1 plant, 2 water, 3 inspect.</p>`, 'YOUR LITTLE GARDEN');}
$('#info-button').addEventListener('click',plantInfo);$('#help-button').addEventListener('click',showHelp);
for(const id of ['#close-info','#dialog-done'])$(id).addEventListener('click',()=>$('#info-dialog').close());
$('#info-dialog').addEventListener('click',e=>{if(e.target===$('#info-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('#skip-time').addEventListener('click',()=>{state.offset+=6*3600000;sync();render();message('Six peaceful hours later… your garden has been growing.');$('#scene').classList.add('growing');setTimeout(()=>$('#scene').classList.remove('growing'),800);chime([392,494,587,784]);});
$('#sound-button').addEventListener('click',()=>{sound=!sound;$('#sound-button').setAttribute('aria-pressed',String(sound));$('#sound-button').setAttribute('aria-label',`Turn gentle game sounds ${sound?'off':'on'}`);$('#sound-button').textContent=`SOUND ${sound?'ON':'OFF'}`;chime([523,659]);});
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||$('#info-dialog').open||$('#options-dialog').open||['INPUT','TEXTAREA','SELECT','BUTTON'].includes(e.target.tagName))return;const selector={'1':'#seeds-button','2':'#water-button','3':'#info-button'}[e.key];if(selector){e.preventDefault();$(selector).click();}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){sync();render();}});window.addEventListener('pagehide',sync);
sync();render();setInterval(()=>{if(!document.hidden){sync();render();}},60000);

$('#options-button').addEventListener('click',()=>$('#options-dialog').showModal());
for(const id of ['#close-options','#options-done'])$(id).addEventListener('click',()=>$('#options-dialog').close());
$('#options-dialog').addEventListener('click',e=>{if(e.target===$('#options-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('#fullscreen-option').hidden = !document.fullscreenEnabled;
$('#fullscreen-button').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{message('Fullscreen is unavailable here. The garden already fills this browser window.');}});
document.addEventListener('fullscreenchange',()=>{$('#fullscreen-button').textContent=document.fullscreenElement?'EXIT FULLSCREEN':'FULLSCREEN';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(seedsOpen||chosenSeed)&&!$('#info-dialog').open&&!$('#options-dialog').open){openSeeds(false);$('#seeds-button').focus();}});
