import assert from 'node:assert/strict';
import {installDestinationFlybys} from '../src/destinationFlyby.js';
import {wildlifeSpecies,wildlifeHabitats,habitatsForSpecies,addWildlife} from '../src/wildlife.js';
import fs from 'node:fs';
const event=()=>({addEventListener(){},removeEventListener(){}});let frames=[],scrolled=0,states=[],looks=[],cancelled=0;
globalThis.matchMedia=()=>({matches:false});
const viewer={isDestroyed:()=>false,container:{scrollIntoView(o){assert.equal(o.behavior,'instant');scrolled++;}},resize(){},scene:{canvas:{addEventListener(){},removeEventListener(){}},requestRender(){}},selectedEntityChanged:event(),camera:{moveEnd:event(),cancelFlight(){cancelled++},flyToBoundingSphere(s,o){frames.push({s,o})},lookAt(t,o){looks.push({t,o})},lookAtTransform(){}}};
const site={id:'test',name:'Test site',lng:35,lat:-2};const control=installDestinationFlybys(viewer,[site],s=>states.push(s));control.flyTo(site);assert.equal(scrolled,1);frames[0].o.complete();frames[1].o.complete();frames[2].o.complete();assert.equal(states.at(-1).flying,false);assert.equal(looks.at(-1).o.range,4500);assert.equal(frames.length,3);
control.flyTo(site);const interrupted=frames.at(-1);control.cancel();interrupted.o.complete();assert.equal(frames.length,4);assert.equal(cancelled,1);
globalThis.matchMedia=()=>({matches:true});control.flyTo(site);assert.equal(frames.length,4);assert.equal(states.at(-1).flying,false);control.destroy();
for(const species of wildlifeSpecies){const b=fs.readFileSync('public'+species.url);assert.equal(b.readUInt32LE(0),0x46546c67);assert.equal(b.readUInt32LE(8),b.length);assert.ok(species.source&&species.licenseUrl);}
assert.ok(wildlifeHabitats.every(h=>Number.isFinite(h.lat)&&Number.isFinite(h.lng)&&wildlifeSpecies.some(s=>s.id===h.species)));
console.log('PASS: immediate viewport, target framing, cancellation, reduced motion, five GLB assets and eight habitat placements.');

const fish=habitatsForSpecies('lionfish');assert.equal(fish.length,2);assert.ok(fish.every(h=>h.species==='lionfish'));assert.equal(habitatsForSpecies(null).length,8);
const C=await import('cesium');const configs=[];addWildlife({entities:{add(config){configs.push(config);return config}}},C,fish);assert.equal(configs.length,2);assert.ok(configs.every(c=>c.model.distanceDisplayCondition.far===12000&&c.label.distanceDisplayCondition.far===12000&&c.point.distanceDisplayCondition.near===12000));console.log('PASS: species-only filtering and late-zoom wildlife visibility.');
