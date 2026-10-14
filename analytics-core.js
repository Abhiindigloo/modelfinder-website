/* Pure calculations. This module never performs network or storage operations. */
(function (root) {
  'use strict';
  function validate(data) {
    if (!Array.isArray(data) || data.length < 1 || data.length > 10000) throw Error('Import 1–10,000 records as a JSON array.');
    return data.map((row, i) => {
      const fail = message => { throw Error(`Record ${i + 1}: ${message}`); };
      if (!row || typeof row !== 'object' || Array.isArray(row)) fail('expected an object.');
      const text = (key, max) => { const value = row[key]; if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u001f]/.test(value)) fail(`invalid ${key}.`); return value.trim(); };
      const timestamp = text('timestamp', 40);
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(timestamp) || !Number.isFinite(Date.parse(timestamp))) fail('timestamp must be ISO 8601 with a timezone.');
      const date = timestamp.slice(0, 10);
      if (new Date(date+'T00:00:00Z').toISOString().slice(0,10) !== date) fail('invalid calendar date.');
      const number = (key, max, integer=false) => { const value = row[key]; if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max || (integer && !Number.isSafeInteger(value))) fail(`invalid ${key}.`); return value; };
      return {timestamp: new Date(timestamp).toISOString(), session_id:text('session_id',128), model:text('model',120), input_tokens:number('input_tokens',1e9,true), output_tokens:number('output_tokens',1e9,true), cost_usd:row.cost_usd == null ? null : number('cost_usd',1e6)};
    });
  }
  function summarize(records, days=0, now=Date.now()) {
    const cutoff = days ? now-days*86400000 : -Infinity;
    const filtered = records.filter(r => Date.parse(r.timestamp)>=cutoff && Date.parse(r.timestamp)<=now);
    const models = new Map(), dates = new Map(), hours = new Map();
    let tokens=0, cost=0, knownCosts=0;
    for (const r of filtered) {
      const n=r.input_tokens+r.output_tokens; tokens+=n;
      const m=models.get(r.model)||{name:r.model,requests:0,input:0,output:0,cost:0,knownCosts:0};
      m.requests++;m.input+=r.input_tokens;m.output+=r.output_tokens;
      if(r.cost_usd!==null){cost+=r.cost_usd;knownCosts++;m.cost+=r.cost_usd;m.knownCosts++;}
      models.set(r.model,m);const date=r.timestamp.slice(0,10); dates.set(date,(dates.get(date)||0)+1);
      const hour=r.timestamp.slice(11,13);hours.set(hour,(hours.get(hour)||0)+1);
    }
    const sorted=[...models.values()].sort((a,b)=>b.requests-a.requests||a.name.localeCompare(b.name));
    return {requests:filtered.length,sessions:new Set(filtered.map(r=>r.session_id)).size,tokens,cost,knownCosts,activeDays:dates.size,favorite:sorted[0]?.name||'—',peak:[...hours].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0]?.[0]||null,models:sorted,dates:[...dates].sort((a,b)=>a[0].localeCompare(b[0]))};
  }
  function memory(parameters, bits, overhead, available) {
    if (![parameters,bits,overhead,available].every(Number.isFinite)||parameters<=0||parameters>10000||![4,8,16,32].includes(bits)||overhead<0||overhead>200||available<0||available>100000) throw Error('Enter parameters > 0, a supported precision, overhead 0–200%, and non-negative memory.');
    const weights=parameters*1e9*bits/8/2**30, estimate=weights*(1+overhead/100);
    return {weights,estimate,headroom:available-estimate};
  }
  function smallDeviceNote(available) {
    if (!Number.isFinite(available) || available > 4) return '';
    return 'This budget is handset-sized. Do not run several department assistants, a document index, or fine-tunes on the phone. Use the phone as the screen — web, mobile, Teams, or Slack — and keep the models and your business data on a server you control or a private cloud. Smaller than a generalist does not mean it fits in about 3 GB. Fully on this device, only one very small quantized model for one narrow task is a candidate, and that fit is unverified.';
  }
  const api=Object.freeze({validate,summarize,memory,smallDeviceNote});
  if(typeof module!=='undefined'&&module.exports) module.exports=api; else root.ModelFinderAnalytics=api;
})(typeof globalThis!=='undefined'?globalThis:this);
