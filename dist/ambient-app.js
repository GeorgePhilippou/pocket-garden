import {CATALOG,VISITORS,ACTIVE_VISITORS,createShelf,loadShelf} from './shelf-model.js?v=11';
import {plantArt} from './shelf-art.js?v=11';
import {makeVisitorLife,sampleVisit} from './visitor-life.js?v=11';
import {visitorArt} from './visitor-art.js?v=11';
const $=s=>document.querySelector(s),KEY='pocket-garden-shelf-v1',OLD='pocket-garden-v1';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state,storageOK=true,expanded=false,tab='visitors',view='',audio;
try{const old=JSON.parse(localStorage.getItem(OLD)||'null');state=loadShelf(localStorage.getItem(KEY),Date.now(),old);}catch{state=createShelf();storageOK=false;}
const life=makeVisitorLife(Math.random,Date.now()),nodes=new Map(),seen=new Set();
let currentVisits=[],frame=0;
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const still=()=>!state.motion||motionPreference.matches;
const today=t=>new Date(t).toLocaleDateString('en-CA');
const liveArt=visitorArt;
function save(){state.revision=(state.revision||0)+1;try{localStorage.setItem(KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}}
function adopt(){try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s?.revision>state.revision){const next=loadShelf(s,Date.now(),null,true);if(next)state=next;}}catch{}}
function preferences(){document.body.classList.toggle('reduced',still());$('#scene').dataset.light=state.light;$('#scene').classList.toggle('lego-off',!state.templeLights);$('#temple').setAttribute('aria-pressed',String(state.templeLights));}
function chime(){if(!state.sound)return;try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=523;g.gain.setValueAtTime(.02,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.2);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.22);}catch{}}
function paintVisitors(){const now=Date.now();for(const visit of currentVisits){const el=nodes.get(visit.id);if(!el)continue;const p=sampleVisit(visit,now,still());el.style.left=`${p.x}%`;el.style.top=`${p.y}%`;el.style.opacity=p.opacity;el.dataset.phase=p.phase;el.style.setProperty('--facing',visit.type==='moth'?1:p.facing);el.style.setProperty('--tilt',`${p.angle}deg`);}}
function renderFrame(){frame=0;if(document.hidden||still()||!currentVisits.length)return;paintVisitors();frame=requestAnimationFrame(renderFrame);}
function refreshMovement(){preferences();if(frame)cancelAnimationFrame(frame);frame=0;paintVisitors();if(!document.hidden&&!still())frame=requestAnimationFrame(renderFrame);}
motionPreference.addEventListener('change',refreshMovement);
function noteVisitor(visit){if(seen.has(visit.id)||visit.nudged)return;seen.add(visit.id);adopt();const now=Date.now(),first=!state.discoveries[visit.type];if(first)state.discoveries[visit.type]={time:now};if(first||!state.visits[visit.type]||today(state.visits[visit.type])!==today(now)){state.visits[visit.type]=now;state.events.unshift({text:visit.note,time:now});state.events=state.events.slice(0,40);save();$('#journal-dot').hidden=false;}}
function tick(){if(document.hidden)return;const t=Date.now(),visits=life.tick(t,state.light,state.templeLights),ids=new Set(visits.map(v=>v.id));currentVisits=visits;for(const [id,el] of nodes)if(!ids.has(id)){el.remove();nodes.delete(id);}
 for(const visit of visits){if(!nodes.has(visit.id)){const el=document.createElement(visit.flying?'button':'div');el.className=`visitor ${visit.type} ambient-visitor living-visitor`;el.dataset.visitor=visit.type;el.dataset.visitId=visit.id;el.dataset.startX=visit.x;el.dataset.startY=visit.y;el.dataset.destination=visit.target.place||'leaf';el.setAttribute('aria-label',`${VISITORS[visit.type].name}${visit.flying?' — gently send it on its way':''}`);if(!visit.flying)el.setAttribute('role','img');el.innerHTML=`<span class="contact-shadow"></span><span class="visitor-pose"><span class="visitor-facing">${liveArt(visit.type)}</span></span>`;if(visit.flying)el.addEventListener('click',()=>{life.depart(visit.id,Date.now());chime();tick();});$('#visitors').append(el);nodes.set(visit.id,el);}if(t>=visit.observedAt)noteVisitor(visit);}
 paintVisitors();if(!frame&&!still())frame=requestAnimationFrame(renderFrame);
}
function panel(title,kicker,content,kind){view=kind;$('#panel-title').textContent=title;$('#panel-kicker').textContent=kicker;$('#panel-content').innerHTML=content;if(!$('#panel').open)$('#panel').showModal();$('#panel').scrollTop=0;}
function closePanel(){$('#panel').close();view='';}
function visitors(){const count=ACTIVE_VISITORS.map(id=>state.visits[id]).filter(t=>t&&today(t)===today(Date.now())).length;return `<p class="small-note daily-note">${count?`${count} familiar ${count===1?'visitor has':'visitors have'} spent a little time here today.`:'A new day at the window. Let the little visits unfold.'}</p><div class="album-grid">${ACTIVE_VISITORS.map(id=>{const c=VISITORS[id];return `<article class="album-card ${state.discoveries[id]?'':'locked'}">${liveArt(id)}<strong>${state.discoveries[id]?c.name:'A visitor yet to arrive'}</strong><p>${state.discoveries[id]?c.note:'It may stop by while you enjoy the window.'}</p></article>`;}).join('')}</div><p class="small-note">A short note is kept after a visitor spends time here, once per kind each day. No clicking or plant care is needed.</p>`;}
function notebook(){return state.events.slice(0,20).map(e=>`<p class="log-entry">${escape(e.text)}<time>${new Date(e.time).toLocaleString(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</time></p>`).join('')||'<p class="small-note">A quiet page, waiting for a visitor.</p>';}
function earlier(){const sources=[state.collection,state.legacy?.collection||{}];return `<p class="small-note">The keepsakes and plant progress from your earlier garden are safely retained in your save. This scene no longer needs watering, harvesting, or growth controls.</p><div class="album-grid">${sources.flatMap(collection=>Object.entries(collection).filter(([,n])=>n>0).map(([id,n])=>`<article class="album-card">${plantArt(id)}<strong>${escape(CATALOG[id]?.name||id)}</strong><p class="count">${Number(n)}</p></article>`)).join('')||'<p class="small-note">Your original saved arrangement is preserved.</p>'}</div>`;}
function journal(next=tab){adopt();tab=next;$('#journal-dot').hidden=true;panel('A little life at the window.','YOUR OPTIONAL JOURNAL',`<nav class="tabs" aria-label="Journal sections">${Object.entries({visitors:'Visitors',notebook:'Notebook',earlier:'Earlier garden'}).map(([id,label])=>`<button data-tab="${id}" aria-selected="${tab===id}">${label}</button>`).join('')}</nav>${({visitors,notebook,earlier})[tab]()}`,'journal');}
function settings(){panel('A quiet corner, your way.','YOUR WINDOWSILL',`<div class="setting-row"><span>Window light</span><select id="light-choice" aria-label="Window light">${['day','dusk','night'].map(x=>`<option value="${x}" ${state.light===x?'selected':''}>${x[0].toUpperCase()+x.slice(1)}</option>`).join('')}</select></div><div class="setting-row"><span>Gentle sounds</span><button id="sound-choice" aria-pressed="${state.sound}">${state.sound?'On':'Off'}</button></div><div class="setting-row"><span>Visitor movement</span><button id="motion-choice" aria-pressed="${state.motion}">${state.motion?'On':'Off'}</button></div><div class="setting-row"><span>Scene size</span><button id="expand-choice">${expanded?'Make it small':'A closer look'}</button></div><div class="setting-row"><span>Beside your work</span><button id="window-choice">Open small window ↗</button></div><div class="setting-row"><span>Your saved garden</span><button id="export-choice">Save a copy</button></div><div class="setting-row"><span>Restore a saved copy</span><input id="import-choice" type="file" accept="application/json,.json" aria-label="Restore saved garden" style="max-width:175px;font-size:10px"></div><p class="small-note">Just a living scene. The plants and LEGO flower stay as illustrated; visitors come and go on their own.</p><p class="small-note">${storageOK?'Saved on this browser.':'Browser saving is unavailable. Save a copy to keep this visit.'}</p>`,'settings');}
$('#journal-button').addEventListener('click',()=>journal());$('#menu-button').addEventListener('click',settings);$('#close-panel').addEventListener('click',closePanel);$('#panel').addEventListener('close',()=>view='');
$('#panel').addEventListener('click',e=>{if(e.target===$('#panel')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePanel();}});
$('#panel-content').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tab){journal(b.dataset.tab);return;}switch(b.id){
 case 'sound-choice':state.sound=!state.sound;save();settings();chime();break;
 case 'motion-choice':state.motion=!state.motion;save();preferences();refreshMovement();settings();break;
 case 'expand-choice':expanded=!expanded;$('.shelf-shell').classList.toggle('expanded',expanded);closePanel();break;
 case 'window-choice':{const u=new URL(location.href);u.searchParams.set('companion','1');window.open(u,'little-windowsill','popup=yes,width=740,height=600,resizable=yes');closePanel();break;}
 case 'export-choice':{adopt();const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='my-little-windowsill.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}
}});
$('#panel-content').addEventListener('change',async e=>{if(e.target.id==='light-choice'){state.light=e.target.value;save();preferences();tick();}if(e.target.id==='import-choice'){try{const file=e.target.files[0];if(!file||file.size>1000000)throw Error();const restored=loadShelf(JSON.parse(await file.text()),Date.now(),null,true);if(!restored)throw Error();state=restored;save();preferences();refreshMovement();closePanel();}catch{let note=$('#import-error');if(!note){note=document.createElement('p');note.id='import-error';note.className='small-note';note.setAttribute('role','status');$('#panel-content').append(note);}note.textContent='That file is not a valid saved garden. Your current save is unchanged.';}}});
$('#temple').addEventListener('click',()=>{state.templeLights=!state.templeLights;save();preferences();tick();chime();});$('#creeper').addEventListener('click',chime);
window.addEventListener('storage',()=>{adopt();preferences();refreshMovement();});document.addEventListener('visibilitychange',()=>{if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;}else{adopt();preferences();tick();refreshMovement();}});window.addEventListener('pagehide',()=>{adopt();save();});document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||$('#panel').open)return;if(e.key.toLowerCase()==='j')journal();});
preferences();save();tick();setInterval(tick,250);

// Names only: artwork-aligned hit areas never open a plant panel.
const plantTooltip=$('#plant-tooltip');
function hidePlantName(){plantTooltip.hidden=true;}
function showPlantName(target){plantTooltip.textContent=target.dataset.name;plantTooltip.style.left=`${target.dataset.labelX}%`;plantTooltip.style.top=`${target.dataset.labelY}%`;plantTooltip.hidden=false;}
for(const target of document.querySelectorAll('#plant-names polygon')){
 target.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')showPlantName(target);});
 target.addEventListener('pointerleave',hidePlantName);
 target.addEventListener('focus',()=>showPlantName(target));target.addEventListener('blur',hidePlantName);
 target.addEventListener('keydown',e=>{if(e.key==='Escape'){hidePlantName();target.blur();}});
}
$('#scene').addEventListener('pointerdown',e=>{if(!e.target.closest('#plant-names'))hidePlantName();});
$('#panel').addEventListener('close',hidePlantName);
