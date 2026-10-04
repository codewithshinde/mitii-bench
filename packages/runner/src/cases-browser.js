import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { buildCatalog } from "./catalog.js";
import { repoRoot } from "./paths.js";

export function generateCasesBrowser(root = repoRoot()) {
  const catalog = buildCatalog(root);
  const outDir = join(root, "catalog");
  mkdirSync(outDir, { recursive: true });
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>mitii-bench cases</title>
  <style>
    :root { font-family: ui-sans-serif, system-ui, sans-serif; color: #14213d; background: #f7f4ef; }
    body { margin: 0; padding: 1.5rem; }
    h1 { margin: 0 0 0.25rem; font-size: 1.5rem; }
    .sub { color: #5c6578; margin-bottom: 1rem; }
    input, select { padding: 0.45rem 0.6rem; margin: 0 0.4rem 0.8rem 0; border: 1px solid #c9c2b8; border-radius: 6px; background: #fff; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; }
    th, td { text-align: left; padding: 0.55rem 0.7rem; border-bottom: 1px solid #ece7df; font-size: 0.92rem; }
    th { background: #ebe4d8; }
    tr:hover td { background: #faf7f2; }
    .tag { display: inline-block; background: #e7eef8; color: #243b53; padding: 0.1rem 0.4rem; border-radius: 4px; margin-right: 0.25rem; font-size: 0.75rem; }
    code { font-size: 0.85rem; }
  </style>
</head>
<body>
  <h1>mitii-bench cases</h1>
  <p class="sub">${catalog.count} tasks · generated ${catalog.generatedAt}</p>
  <div>
    <input id="q" placeholder="Search id, title, tags…" size="40" />
    <select id="category"><option value="">All categories</option></select>
    <select id="difficulty"><option value="">All difficulties</option>
      <option>easy</option><option>medium</option><option>hard</option>
    </select>
    <select id="ecosystem"><option value="">All ecosystems</option></select>
    <select id="base"><option value="">All bases</option></select>
    <select id="family"><option value="">All families</option></select>
  </div>
  <table>
    <thead><tr><th>Run ID</th><th>Title</th><th>Eco</th><th>Family</th><th>Base</th><th>Difficulty</th><th>Path</th></tr></thead>
    <tbody id="rows"></tbody>
  </table>
  <script>
    const DATA = ${JSON.stringify(catalog.tasks)};
    const cats = [...new Set(DATA.map(t => t.category))].sort();
    const ecos = [...new Set(DATA.map(t => t.ecosystem).filter(Boolean))].sort();
    const bases = [...new Set(DATA.map(t => t.base))].sort();
    const families = [...new Set(DATA.map(t => t.family).filter(Boolean))].sort();
    const catSel = document.getElementById('category');
    const ecoSel = document.getElementById('ecosystem');
    const baseSel = document.getElementById('base');
    const famSel = document.getElementById('family');
    cats.forEach(c => catSel.insertAdjacentHTML('beforeend', '<option>'+c+'</option>'));
    ecos.forEach(e => ecoSel.insertAdjacentHTML('beforeend', '<option>'+e+'</option>'));
    bases.forEach(b => baseSel.insertAdjacentHTML('beforeend', '<option>'+b+'</option>'));
    families.forEach(f => famSel.insertAdjacentHTML('beforeend', '<option>'+f+'</option>'));
    function render() {
      const q = document.getElementById('q').value.toLowerCase();
      const cat = catSel.value;
      const diff = document.getElementById('difficulty').value;
      const eco = ecoSel.value;
      const base = baseSel.value;
      const family = famSel.value;
      const rows = DATA.filter(t => {
        if (cat && t.category !== cat) return false;
        if (diff && t.difficulty !== diff) return false;
        if (eco && t.ecosystem !== eco) return false;
        if (base && t.base !== base) return false;
        if (family && t.family !== family) return false;
        if (q) {
          const hay = ((t.runId||t.id) + ' ' + t.title + ' ' + (t.tags||[]).join(' ') + ' ' + (t.base||'')).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
      document.getElementById('rows').innerHTML = rows.map(t => '<tr>' +
        '<td><code>'+(t.runId||t.id)+'</code></td>' +
        '<td>'+escapeHtml(t.title)+'</td>' +
        '<td>'+(t.ecosystem||'')+'</td>' +
        '<td>'+(t.family||'')+'</td>' +
        '<td>'+(t.base||'')+'</td>' +
        '<td>'+t.difficulty+'</td>' +
        '<td><code>'+t.path+'</code></td>' +
      '</tr>').join('');
    }
    function escapeHtml(s){return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
    ['q','category','difficulty','ecosystem','base','family'].forEach(id => document.getElementById(id).addEventListener('input', render));
    render();
  </script>
</body>
</html>`;
  const out = join(outDir, "cases.html");
  writeFileSync(out, html);
  return out;
}

export function openCasesBrowser(root = repoRoot()) {
  const path = generateCasesBrowser(root);
  const opener =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  spawn(opener, [path], { detached: true, stdio: "ignore" }).unref();
  return path;
}
