import * as C from 'cesium';
// Each stage frames a fixed target, rather than looking away from the site.
export function installDestinationFlybys(viewer,destinations,onState){
 let sequence=0,active=false,lastAutoId=null,userMoved=false;
 const report=(d,flying)=>onState({id:d?.id||'',name:d?.name||'',flying});
 function cancel(){sequence++;active=false;viewer.camera.cancelFlight();report(null,false);}
 function flyTo(d){if(!d||viewer.isDestroyed())return;const run=++sequence;active=true;userMoved=false;lastAutoId=d.id;
 viewer.container.scrollIntoView({behavior:'instant',block:'start'});viewer.resize();report(d,true);
 const target=C.Cartesian3.fromDegrees(d.lng,d.lat,0),sphere=new C.BoundingSphere(target,200);
 const stages=[{range:90000,heading:-25,pitch:-65,duration:1.5},{range:14000,heading:20,pitch:-48,duration:2},{range:4500,heading:80,pitch:-40,duration:2}];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function next(i){if(run!==sequence||viewer.isDestroyed())return;if(i===stages.length){active=false;const end=stages.at(-1);viewer.camera.lookAt(target,new C.HeadingPitchRange(C.Math.toRadians(end.heading),C.Math.toRadians(end.pitch),end.range));viewer.camera.lookAtTransform(C.Matrix4.IDENTITY);viewer.scene.requestRender();report(d,false);return;}const s=stages[i];viewer.camera.flyToBoundingSphere(sphere,{offset:new C.HeadingPitchRange(C.Math.toRadians(s.heading),C.Math.toRadians(s.pitch),s.range),duration:reduced?0:s.duration,complete:()=>next(i+1)});}
 if(reduced){const s=stages.at(-1);viewer.camera.lookAt(target,new C.HeadingPitchRange(C.Math.toRadians(s.heading),C.Math.toRadians(s.pitch),s.range));viewer.camera.lookAtTransform(C.Matrix4.IDENTITY);active=false;viewer.scene.requestRender();report(d,false);}else next(0);
 }
 const select=e=>{const id=e?.properties?.ryftlandsId?.getValue(C.JulianDate.now());const d=destinations.find(d=>d.id===id);if(d)flyTo(d);};
 const zoom=()=>{if(active||!userMoved||viewer.isDestroyed())return;userMoved=false;const p=viewer.camera.positionCartographic;if(p.height>110000){if(p.height>180000)lastAutoId=null;return;}if(p.height<400)return;const at=C.Cartesian3.fromRadians(p.longitude,p.latitude);const nearest=destinations.map(d=>({d,dist:C.Cartesian3.distance(at,C.Cartesian3.fromDegrees(d.lng,d.lat))})).sort((a,b)=>a.dist-b.dist)[0];if(nearest&&nearest.dist<70000&&nearest.d.id!==lastAutoId)flyTo(nearest.d);};
 const markUserMove=()=>{userMoved=true;};viewer.scene.canvas.addEventListener("wheel",markUserMove,{passive:true});viewer.scene.canvas.addEventListener("pointerdown",markUserMove);
 viewer.selectedEntityChanged.addEventListener(select);viewer.camera.moveEnd.addEventListener(zoom);
 return {flyTo,cancel,destroy(){sequence++;viewer.scene.canvas.removeEventListener("wheel",markUserMove);viewer.scene.canvas.removeEventListener("pointerdown",markUserMove);viewer.selectedEntityChanged.removeEventListener(select);viewer.camera.moveEnd.removeEventListener(zoom);if(!viewer.isDestroyed())viewer.camera.cancelFlight();}};
}
