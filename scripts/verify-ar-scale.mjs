import assert from 'node:assert/strict';
import {PerspectiveCamera,Vector3} from 'three';
import {validateSceneReference,calculateReferencePlacement} from '../src/arSceneScale.js';
const analysis=validateSceneReference({status:'reference',name:'Door',box:[.3,.1,.8,.3],target:[.75,.8],estimatedHeightM:2,confidence:'medium',reason:'Confirm actual height.'});
const config={analysis,referenceHeightM:2,frameWidth:1000,frameHeight:1000,stageWidth:1000,stageHeight:1000,animalHeightM:1};
const p=calculateReferencePlacement(config);assert.ok(Math.abs(p.animalPixels-250)<1e-8);
const camera=new PerspectiveCamera(50,1,.01,1000);camera.position.set(0,1.6,p.distance);camera.lookAt(0,1.6,0);camera.updateMatrixWorld(true);const base=new Vector3(p.x,p.y,0).project(camera),top=new Vector3(p.x,p.y+1,0).project(camera);assert.ok(Math.abs((base.x+1)*500-750)<1e-6);assert.ok(Math.abs((1-base.y)*500-800)<1e-6);assert.ok(Math.abs((top.y-base.y)*500-250)<1e-6);
const portrait=calculateReferencePlacement({...config,frameHeight:500,stageWidth:800,stageHeight:1000});assert.equal(portrait.referenceBox.height,200);assert.equal(portrait.animalPixels,100);
assert.throws(()=>calculateReferencePlacement({...config,referenceHeightM:0}));assert.throws(()=>validateSceneReference({status:'reference',box:[.8,.1,.3,.3],target:[.5,.5]}));assert.throws(()=>validateSceneReference({status:'reference',box:[.1,.1,.8,.3],target:[2001,.8]}));assert.equal(validateSceneReference({status:'insufficient',reason:'No upright object visible.'}).status,'insufficient');
assert.equal(validateSceneReference({...analysis,estimatedHeightM:999}).estimatedHeightM,null);
console.log('PASS: AI response validation, unsupported views, confirmed-height projection, anchor alignment and portrait letterboxing.');

assert.deepEqual(validateSceneReference({...analysis,box:[300,100,800,300],target:[750,800]}).box,[.3,.1,.8,.3]);
