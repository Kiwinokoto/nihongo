import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const read=(name)=>readFileSync(join(root,name),'utf8');
test('static assets and original illustrations exist',()=>{
  for(const file of ['index.html','assets/app.js','assets/styles.css','assets/landscape.svg','assets/village.svg','deploy/site.conf']){
    assert.ok(existsSync(join(root,file)),file);
  }
  assert.match(read('assets/landscape.svg'),/^<svg /);
  assert.match(read('assets/village.svg'),/^<svg /);
});
test('starter activities and journey landmarks are present',()=>{
  const html=read('index.html'),js=read('assets/app.js');
  for(const id of ['lesson-dialog','journal-dialog','trace-canvas','kana-picker','lesson-panel']){
    if(id==='trace-canvas')assert.match(js, /id="trace-canvas"/);
    else assert.ok(html.includes('id="'+id+'"'),id);
  }
  assert.match(read("assets/progression.js"),/あいうえお/);
  for(const place of ['garden','tea','shrine','train'])assert.ok(html.includes('data-place="'+place+'"'));
});
test('all 46 animated stroke SVG files are included with redistribution licence', async()=>{
  const {KANA} = await import('../assets/progression.js');
  const counts=JSON.parse(read('assets/kana-guide-counts.json'));
  assert.equal(Object.keys(counts).length,46);
  for(const {glyph} of KANA){
    const pathname='assets/strokes/'+glyph.codePointAt(0)+'.svg';
    assert.ok(existsSync(join(root,pathname)),pathname);
    assert.match(read(pathname), /Lesser General Public License/);
    assert.ok(Number.isInteger(counts[glyph]) && counts[glyph]>0);
  }
  assert.ok(existsSync(join(root,'licenses/LGPL-3.0.txt')));
  assert.ok(existsSync(join(root,'licenses/ANIMCJK-COPYING.txt')));
});

test('public project does not embed credentials or third-party tracking',()=>{
  const files=['index.html','assets/app.js','deploy/compose.yml','deploy/Dockerfile'];
  for(const file of files){
    const source=read(file);
    assert.doesNotMatch(source,/AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30}|sk-[A-Za-z0-9]{30}/);
    assert.doesNotMatch(source,/google-analytics|googletagmanager|plausible\.io/);
  }
});
