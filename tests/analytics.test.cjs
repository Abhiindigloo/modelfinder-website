const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../analytics-core.js');
const row=(extra={})=>({timestamp:'2026-10-12T10:00:00Z',session_id:'s1',model:'M',input_tokens:1000,output_tokens:300,cost_usd:null,...extra});
test('aggregation deduplicates sessions, separates models, excludes future records, and reports cost coverage',()=>{
 const data=core.validate([row(),row({cost_usd:0.2}),row({session_id:'s2',model:'N',timestamp:'2026-10-11T10:00:00Z'}),row({timestamp:'2027-01-01T00:00:00Z'})]);
 const s=core.summarize(data,0,Date.parse('2026-10-12T11:00:00Z'));
 assert.equal(s.sessions,2);assert.equal(s.requests,3);assert.equal(s.tokens,3900);assert.equal(s.cost,0.2);assert.equal(s.knownCosts,1);assert.equal(s.favorite,'M');assert.equal(s.activeDays,2);
});
test('time windows use actual timestamps and normalize offsets to UTC',()=>{
 const data=core.validate([row({timestamp:'2026-10-12T00:30:00+05:30'}),row({timestamp:'2026-09-01T00:00:00Z'})]);
 const s=core.summarize(data,7,Date.parse('2026-10-12T11:00:00Z'));assert.equal(s.requests,1);assert.equal(s.dates[0][0],'2026-10-11');
});
test('rejects malformed objects, numbers, dates, and excessive record counts',()=>{
 for(const value of [null,{},[],[null],[row({input_tokens:-1})],[row({input_tokens:'100'})],[row({input_tokens:1.2})],[row({cost_usd:Infinity})],[row({timestamp:'2026-02-30T12:00:00Z'})],[row({timestamp:'2026-10-12'})],[row({model:'a'.repeat(121)})],Array(10001).fill(row())])assert.throws(()=>core.validate(value));
});
test('preserves malicious labels as inert strings and discards unneeded fields',()=>{
 const data=core.validate([row({model:'<img src=x onerror=alert(1)>',prompt:'private text',__proto__:null})]);assert.equal(data[0].model,'<img src=x onerror=alert(1)>');assert.equal(data[0].prompt,undefined);assert.equal(core.summarize(data,0,Date.parse('2026-10-12T11:00:00Z')).models[0].name,data[0].model);
});
test('model weights use binary GiB and selected precision, not decimal GB',()=>{
 const r=core.memory(7,16,20,24);assert.ok(Math.abs(r.weights-13.0385160446167)<1e-10);assert.ok(Math.abs(r.estimate-15.64621925354)<1e-10);assert.ok(r.headroom>0);assert.ok(core.memory(70,16,20,24).headroom<0);
 for(const params of [[0,16,20,24],[7,3,20,24],[7,16,-1,24],[7,16,20,-1],[NaN,16,20,24]])assert.throws(()=>core.memory(...params));
 const note=core.smallDeviceNote(3);assert.match(note,/phone as the screen/);assert.match(note,/private cloud/);assert.equal(core.smallDeviceNote(24),'');assert.equal(core.smallDeviceNote(4),note);assert.equal(core.smallDeviceNote(4.01),'');
});
