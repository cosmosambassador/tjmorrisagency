'use strict';
const $ = id => document.getElementById(id);
let cards = [], selected = new Set(), ledger = [], sources = [], packet = null;
const status = message => { $('status').textContent = message; };
const safe = fn => async (...args) => { try { await fn(...args); } catch (e) { status(e.message); } };
async function fingerprint(bytes) {
  if (!globalThis.crypto?.subtle) return null;
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('');
}
function render() {
  if (globalThis.setWorldCards) globalThis.setWorldCards(cards);
  $('stats').textContent = `${cards.length} cards loaded · ${selected.size} selected · target snapshot: 530 · ${ledger.length} contributions`;
  if (cards.length && cards.length !== 530) $('stats').textContent += ' · count differs from target; preserve and reconcile';
  const term = $('search').value.toLowerCase();
  $('catalog').replaceChildren(); $('agent').replaceChildren();
  for (const card of cards) {
    const option = document.createElement('option'); option.value = card.record_key;
    option.textContent = card.fields.card + ' · ' + card.fields.name; $('agent').append(option);
    if (!Object.values(card.fields).join(' ').toLowerCase().includes(term)) continue;
    const node = document.createElement('div'); node.className = 'card';
    const label = document.createElement('label'), box = document.createElement('input'), name = document.createElement('span');
    box.type = 'checkbox'; box.checked = selected.has(card.record_key); box.setAttribute('aria-label', 'Select ' + card.fields.card);
    box.onchange = () => { box.checked ? selected.add(card.record_key) : selected.delete(card.record_key); render(); };
    name.textContent = card.fields.card + ' · ' + card.fields.name; label.append(box, name);
    const mission = document.createElement('p'); mission.textContent = card.fields.mission || 'No mission provided in source.';
    const inspect = document.createElement('button'); inspect.textContent = 'Inspect card'; inspect.className = 'secondary';
    inspect.onclick = () => { $('detail').textContent = JSON.stringify(card, null, 2); };
    node.append(label, mission, inspect); $('catalog').append(node);
  }
  $('ledger').replaceChildren();
  for (const entry of ledger) {
    const node = document.createElement('div'); node.className = 'entry';
    const heading = document.createElement('strong'); heading.textContent = `${entry.platform} · ${entry.model} · ${entry.record_key}`;
    const response = document.createElement('p'); response.textContent = entry.response;
    const evidence = document.createElement('small'); evidence.textContent = `${entry.verification} · ${entry.source_reference} · ${entry.uncertainty}`;
    node.append(heading, response, evidence); $('ledger').append(node);
  }
}
for (const seat of RoundRobin.SEATS) { const option = document.createElement('option'); option.textContent = seat; $('platform').append(option); }
$('search').oninput = render;
$('samples').onclick = safe(() => {
  if (cards.length) throw Error('A roster is already loaded. Export and refresh to start a separate session.');
  cards = RoundRobin.parseCSV('card,id,name,mission,lane\nDEMO A,demo-a,Sample Researcher,Compare evidence,Demo only\nDEMO B,demo-b,Sample Reviewer,Challenge assumptions,Demo only\n');
  sources = [{name: 'synthetic-demo', evidence_kind: 'simulation'}]; render(); status('Two synthetic sample cards loaded. These are not canonical agents.');
});
$('roster').onchange = safe(async event => {
  if (cards.length) throw Error('A roster is already loaded. Export and refresh before loading another snapshot.');
  const file = event.target.files[0]; if (!file) return;
  if (file.size > 5_000_000) throw Error('CSV exceeds the 5 MB demo limit.');
  const bytes = await file.arrayBuffer(), text = new TextDecoder('utf-8', {fatal: true}).decode(bytes);
  const imported = RoundRobin.parseCSV(text), hash = await fingerprint(bytes);
  cards = imported; sources.push({name: file.name, sha256: hash, original_text: text});
  render(); status(`Preserved ${cards.length} distinct source rows. No cards merged, renumbered, or launched.`);
});
$('document').onchange = safe(async event => {
  if (sources.some(s => s.kind === 'full_document')) throw Error('A full document is already loaded; export and refresh to change snapshot.');
  const file = event.target.files[0]; if (!file) return;
  if (file.size > 5_000_000) throw Error('Document exceeds the 5 MB demo limit.');
  const bytes = await file.arrayBuffer(), text = new TextDecoder('utf-8', {fatal: true}).decode(bytes);
  sources.push({name: file.name, kind: 'full_document', sha256: await fingerprint(bytes), original_text: text});
  $('fulltext').textContent = text; status('Full original document preserved without rewriting it.');
});
$('pack').onclick = safe(() => {
  packet = RoundRobin.questionPack(cards.filter(c => selected.has(c.record_key)), $('question').value);
  $('packet').textContent = JSON.stringify(packet, null, 2); status(`${packet.tasks.length} manual tasks prepared. No model calls made.`);
});
$('record').onclick = safe(() => {
  const entry = RoundRobin.contribution(cards, {record_key: $('agent').value, platform: $('platform').value,
    question: $('question').value, model: $('model').value, response: $('response').value,
    source_reference: $('reference').value, uncertainty: $('uncertainty').value});
  ledger.push({...entry, entry_id: 'contribution-' + (ledger.length + 1)}); render(); status('Contribution appended for independent testing and human review.');
});
$('gate').onclick = safe(() => { $('gateout').textContent = JSON.stringify(RoundRobin.gate($('domain').value, $('level').value, $('approval').checked), null, 2); });
$('export').onclick = safe(() => {
  if (!cards.length) throw Error('Load cards before exporting.');
  const workspace = {schema_version: 1, exported_at: new Date().toISOString(), target_count: 530,
    loaded_count: cards.length, authority: 'TJTM_HUMAN_APPROVAL', executes_agents: false,
    cards, sources, question_packet: packet, contributions: ledger,
    simulation_state: {time: $('time').value, rotation: $('yaw').value, zoom: $('zoom').value,
      synthetic_experiment_output: $('experimentout').textContent,
      optional_budget_output: $('costout').textContent}};
  const url = URL.createObjectURL(new Blob([JSON.stringify(workspace, null, 2)], {type: 'application/json'}));
  const link = document.createElement('a'); link.href = url; link.download = 'ACO-Round-Robin-' + Date.now() + '.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000); status('Workspace exported. Imported source text and each card remain separate.');
});
render();
