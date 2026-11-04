import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {SITE_URL,publicPaths} from '../src/siteContent.js';
for(const path of [...publicPaths,'/story-studio','/admin']){
 const html=await fs.readFile(`dist${path==='/'?'':path}/index.html`,'utf8');
 assert.equal((html.match(/<title>/g)||[]).length,1,`${path}: one title`);
 assert.equal((html.match(/name="description"/g)||[]).length,1,`${path}: one description`);
 assert(html.includes(`rel="canonical" href="${SITE_URL}${path==='/'?'/':path}"`),`${path}: canonical`);
 assert(html.includes('<h1>'),`${path}: crawlable heading`);
 const schema=html.match(/id="site-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
 assert(JSON.parse(schema)['@graph'].length>0,`${path}: valid JSON-LD`);
 if(path==='/story-studio'||path==='/admin')assert(html.includes('noindex,follow'));
}
const sitemap=await fs.readFile('dist/sitemap.xml','utf8');assert.equal((sitemap.match(/<url>/g)||[]).length,publicPaths.length);assert(!sitemap.includes('/admin'));
const bundled=await build({entryPoints:['src/itineraryEngine.js'],bundle:true,write:false,format:'esm',platform:'node',external:['firebase/*','./firebase']});
const {buildLocalItinerary,validateAiItinerary}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const draft=buildLocalItinerary({destinationId:'coast',interest:'All',days:7,pace:'slow'});assert.equal(draft.days.length,7);assert.equal(draft.days[0].destinationId,'coast');assert.equal(draft.mode,'local');
assert.throws(()=>validateAiItinerary({title:'Invalid',days:[{destinationId:'invented'}]},1,[{id:'mara'}]));
assert.throws(()=>validateAiItinerary({title:'Wrong duration',days:[]},5,[{id:'mara'}]));
console.log(`PASS: ${publicPaths.length} public SEO pages, private noindex pages, structured data, sitemap, local itinerary duration/anchor, and AI catalogue validation.`);
