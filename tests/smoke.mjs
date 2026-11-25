// Smoke test: run the skill's scripts on the demo shop (a made-up codebase in 11 languages) and check the result.
//   node tests/smoke.mjs            precise readers when available (TypeScript, Python)
//   node tests/smoke.mjs --generic  plain-text reader only
import fs from 'fs';
import os from 'os';
import path from 'path';
import assert from 'assert/strict';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL = path.join(HERE, '../plugins/code-atlas/skills/code-atlas');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'code-atlas-'));
fs.cpSync(path.join(HERE, '../demo/shop'), tmp, { recursive: true });
fs.writeFileSync(path.join(tmp, '.env'), 'API_KEY=not-a-real-secret\n'); // must never appear in the map
execFileSync('git', ['init', '-q'], { cwd: tmp });
const run = (script, ...args) => execFileSync(process.execPath, [path.join(SKILL, 'scripts', script), ...args], { cwd: tmp, encoding: 'utf8' });

const init = JSON.parse(run('init.mjs'));
assert.equal(init.brand.accent, '#E11D48', 'brand colour read from web/src/styles.css');
fs.copyFileSync(path.join(SKILL, 'examples/explain-example.json'), path.join(tmp, 'code-atlas/explain/10-api.json'));
const out = run('scan.mjs', '--stamp', ...process.argv.slice(2));
console.log(out.trim());

global.window = {};
const src = fs.readFileSync(path.join(tmp, 'code-atlas/data.js'), 'utf8');
new Function('window', src)(global.window);
const M = global.window.MAP;
const fns = f => M.nodes.filter(n => n.kind === 'fn' && n.parent === f).map(n => n.short);
const wire = (a, b) => M.edges.some(e => e.from.startsWith(a) && e.to.startsWith(b));

assert.equal(M.counts.files, 14, '14 code files');
assert.ok(!M.nodes.some(n => n.id.includes('.env')), 'secrets are excluded');
assert.ok(M.notCovered.length === 0, 'every code file is on the map');
for (const [file, want] of Object.entries({
  'api/handlers/orders.go': ['ListOrders', 'loadOrders', 'formatOrder'],
  'billing/src/main/java/com/shop/Invoice.java': ['total', 'withTax', 'main'],
  'worker/mailer.rb': ['send_receipt', 'deliver'],
  'lib/cart.php': ['add', 'count', 'makeCart'],
  'engine/src/lib.rs': ['discounted', 'apply'],
  'scripts/report.py': ['load', 'summarize', 'show'],
  'web/src/format.js': ['formatCount'],
})) for (const w of want) assert.ok(fns(file).includes(w), `${file} has ${w}`);
assert.ok(wire('api/handlers/orders.go#ListOrders', 'api/handlers/orders.go#loadOrders'), 'Go call inside a file');
assert.ok(wire('api/handlers/orders.go#ListOrders', 'api/handlers/orders.go#formatOrder'), 'a call nested inside another call');
assert.ok(wire('web/src/components/CartBadge.vue', 'web/src/format.js#formatCount'), 'Vue to JS call across files');
assert.ok(wire('worker/mailer.rb', 'worker/templates.rb'), 'Ruby require_relative');
assert.ok(wire('Makefile#make report', 'scripts/report.py'), 'Makefile runs a script');
assert.equal(M.counts.stale, 0, 'nothing stale right after stamping');
assert.ok(M.nodes.find(n => n.id === 'api/handlers/orders.go#formatOrder').ex.what, 'explanations are attached');
const g = JSON.parse(fs.readFileSync(path.join(tmp, 'code-atlas/graph.json'), 'utf8'));
assert.ok(g.nodes.length > 40 && g.edges.some(e => e.kind === 'contains'), 'knowledge graph written');
assert.ok(fs.readFileSync(path.join(tmp, 'code-atlas/graph.graphml'), 'utf8').startsWith('<?xml'), 'GraphML written');
assert.ok(fs.existsSync(path.join(tmp, 'code-atlas/index.html')) && fs.existsSync(path.join(tmp, 'code-atlas/assets/theme.css')), 'viewer and theme in place');
assert.ok(fs.readFileSync(path.join(tmp, '.git/info/exclude'), 'utf8').includes('/code-atlas/'), 'output folder is kept out of git');
fs.rmSync(tmp, { recursive: true, force: true });
console.log('smoke test passed');
