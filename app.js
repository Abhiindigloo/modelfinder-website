'use strict';
const byId = id => document.getElementById(id);
byId('brief').addEventListener('submit', event => {
  event.preventDefault();
  const task = byId('task').value.trim();
  const quality = byId('quality').value.trim();
  if (!task || !quality) { byId(!task ? 'task' : 'quality').focus(); return; }
  byId('prompt').value = `Help me compare AI models across providers for this task: ${task}\n\nMandatory quality requirements: ${quality}\nBudget: ${byId('budget').value.trim() || 'Ask me if needed'}\nUsage: ${byId('volume').value.trim() || 'Ask me if needed'}\n\nVerify current model IDs, deployment routes, capabilities and official pricing. Shortlist suitable candidates and explain tradeoffs. Include Claude and Gemini when they fit. Design an evaluation with representative examples, pass/fail criteria, difficult cases, cost measurements and latency measurements. Recommend the cheapest candidate that passes my mandatory requirements. Distinguish researched facts from assumptions; do not invent test results. Ask about privacy, input size and tool needs if these change the shortlist.`;
  byId('result').hidden = false;
  byId('copy-status').textContent = '';
  byId('prompt').focus();
});
byId('copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(byId('prompt').value); byId('copy-status').textContent = 'Copied. Paste this into Model Finder in ChatGPT.'; }
  catch { byId('prompt').focus(); byId('prompt').select(); byId('copy-status').textContent = 'Select and copy the prompt using your browser’s Copy command.'; }
});
byId('cost-form').addEventListener('submit', event => event.preventDefault());
byId('cost-form').addEventListener('input', () => {
  const ids = ['requests', 'input-tokens', 'output-tokens', 'input-price', 'output-price'];
  const values = ids.map(id => byId(id).value.trim());
  const numbers = values.map(Number);
  if (values.some(value => value === '') || numbers.some(value => !Number.isFinite(value) || value < 0)) { byId('cost').textContent = 'Enter valid non-negative values in every field'; return; }
  const [requests, input, output, inputPrice, outputPrice] = numbers;
  const total = requests * (input * inputPrice + output * outputPrice) / 1000000;
  byId('cost').textContent = Number.isFinite(total) ? `${new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:2}).format(total)} / month (estimated)` : 'Values are too large to calculate';
});
