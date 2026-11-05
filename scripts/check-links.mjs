import fs from 'node:fs'
import path from 'node:path'
// Checks local links and sidebar entries. External URLs are not fetched.
const docs = path.resolve('docs')
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.name.startsWith('.') ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.md') ? [path.join(d, e.name)] : [])
const bad = []
for (const f of walk(docs)) {
  const prose = fs.readFileSync(f, 'utf8').replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '')
  for (const m of prose.matchAll(/!?\[[^\]\n]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\)/g)) {
    const href = m[1] || m[2]
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) continue
    const clean = decodeURIComponent(href.split(/[?#]/)[0])
    if (!clean) continue
    const t = clean.startsWith('/') ? path.join(docs, clean) : path.resolve(path.dirname(f), clean)
    const opts = [t, t + '.md', t.replace(/\.html$/, '.md'), path.join(t, 'readme.md'), path.join(docs, '.vuepress/public', clean)]
    if (!opts.some(p => fs.existsSync(p))) bad.push(path.relative(docs, f) + ' -> ' + href)
  }
}
for (const s of JSON.parse(fs.readFileSync('docs/.vuepress/sidebar.json', 'utf8')))
  if (!fs.existsSync(path.join(docs, s))) bad.push('sidebar -> ' + s)
if (bad.length) { console.error(bad.join('\n')); process.exit(1) }
console.log('links ok')
