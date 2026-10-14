'use strict';
const $ = id => document.getElementById(id);
const core = window.ModelFinderAnalytics;
let records = [], range = 0, importGeneration = 0;
const fmt = value => new Intl.NumberFormat('en-US').format(value);
const usd = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
function cell(row,value){const td=document.createElement('td');td.textContent=value;row.append(td);}
function draw(){
  const s=core.summarize(records,range);
  $('sessions').textContent=fmt(s.sessions);$('messages').textContent=fmt(s.requests);$('tokens').textContent=fmt(s.tokens);$('active-days').textContent=fmt(s.activeDays);$('favorite').textContent=s.favorite;$('peak').textContent=s.peak===null?'—':`${s.peak}:00 UTC`;
  $('spend').textContent=s.knownCosts?usd(s.cost):'Not supplied';
  $('cost-note').textContent=`${s.knownCosts} of ${s.requests} requests include cost. Totals cover supplied costs only. One record counts as one request; future records are excluded.`;
  $('model-rows').replaceChildren();
  for(const m of s.models){const tr=document.createElement('tr');[m.name,fmt(m.requests),fmt(m.input),fmt(m.output),m.knownCosts?usd(m.cost):'Not supplied',`${m.knownCosts}/${m.requests}`].forEach(v=>cell(tr,v));$('model-rows').append(tr);}
  $('activity').replaceChildren();
  if(!s.dates.length){const p=document.createElement('p');p.textContent='No activity in this range. Load the example or import your own file.';$('activity').append(p);}
  const max=Math.max(1,...s.dates.map(x=>x[1]));
  for(const [date,count]of s.dates){const item=document.createElement('div');item.className='activity-day';const label=document.createElement('span');label.textContent=date;const meter=document.createElement('meter');meter.min=0;meter.max=max;meter.value=count;meter.setAttribute('aria-label',`${date}: ${count} requests`);const value=document.createElement('span');value.textContent=`${count} requests`;item.append(label,meter,value);$('activity').append(item);}
}
$('range').addEventListener('change',()=>{range=Number($('range').value);draw();});
$('sample').addEventListener('click',()=>{importGeneration++;const now=Date.now();records=core.validate(Array.from({length:42},(_,i)=>({timestamp:new Date(now-(i%14)*86400000-(i%5)*3600000).toISOString(),session_id:`example-session-${i%12}`,model:['Example model A','Example model B','Example model C'][i%3],input_tokens:500+i*35,output_tokens:100+i*7,cost_usd:i%4===0?null:(500+i*35)*0.000001+(100+i*7)*0.000002})));$('data-status').textContent='Illustrative example loaded. These are synthetic records, not account usage or provider prices.';draw();});
$('upload').addEventListener('change',async()=>{
  const generation=++importGeneration;const file=$('upload').files[0];if(!file)return;
  try{if(file.size>2*1024*1024)throw Error('Choose a file no larger than 2 MiB.');const contents=await file.text();if(generation!==importGeneration)return;const parsed=core.validate(JSON.parse(contents));records=parsed;$('data-status').textContent=`Imported ${fmt(records.length)} records locally. No file contents were uploaded.`;draw();}
  catch(error){if(generation===importGeneration)$('data-status').textContent=`Import rejected. ${error instanceof SyntaxError?'Invalid JSON.':error.message} Previous data is unchanged.`;}
  finally{if(generation===importGeneration)$('upload').value='';}
});
$('clear').addEventListener('click',()=>{importGeneration++;records=[];$('upload').value='';$('data-status').textContent='Dashboard cleared. Imported data is not saved; reload also clears it.';draw();});
function size(){try{const ids=['parameters','precision','overhead','available'];if(ids.some(id=>$(id).value.trim()===''))throw Error('Complete all four fields.');const r=core.memory(...ids.map(id=>Number($(id).value)));$('weights').textContent=`${r.weights.toFixed(2)} GiB`;$('memory-total').textContent=`${r.estimate.toFixed(2)} GiB`;const fit=r.headroom>=0?`${r.headroom.toFixed(2)} GiB remains under these assumptions. This does not establish runtime fit.`:`${Math.abs(r.headroom).toFixed(2)} GiB over the entered memory budget, before any additional runtime requirements.`;const device=core.smallDeviceNote(Number($('available').value));$('memory-note').textContent=device?`${fit} ${device}`:fit;}catch(e){$('weights').textContent='—';$('memory-total').textContent='—';$('memory-note').textContent=e.message;}}
$('size-form').addEventListener('input',size);$('size-form').addEventListener('submit',e=>e.preventDefault());draw();size();
