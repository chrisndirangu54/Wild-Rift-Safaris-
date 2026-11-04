import React,{useEffect,useRef,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import * as C from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import {africanSites} from './africanSites';
import {useReducedMotion} from './ScenicMotion';
import './globe.css';
import {addWildlife,wildlifeHabitats,wildlifeSpecies,habitatsForSpecies} from './wildlife';
import GlobeJourneyStudio from './GlobeJourneyStudio';
import {installDestinationFlybys} from './destinationFlyby';

export default function AfricanGlobe({compact=false,wildlifeOnly=false,filterSpecies=null}) {
  const navigate=useNavigate();
  const habitats=habitatsForSpecies(filterSpecies),sites=wildlifeOnly?[]:africanSites;
  const flybys=useRef(null),routeEntity=useRef(null);
  const [tour,setTour]=useState({name:"",flying:false});
  const mount=useRef(null),viewer=useRef(null),reduced=useReducedMotion(),reduceRef=useRef(reduced);
  reduceRef.current=reduced;
  const [selected,setSelected]=useState(null),[query,setQuery]=useState(''),[error,setError]=useState(''),[imagery,setImagery]=useState('NASA Blue Marble + Natural Earth');
  function fly(site){
    if(!site)flybys.current?.cancel();
    setSelected(site);const v=viewer.current;if(!v||v.isDestroyed())return;
    v.selectedEntity=site?v.entities.getById(site.id):undefined;
    if(site&&!compact){flybys.current?.flyTo(site);return;}
    v.camera.flyTo({destination:C.Cartesian3.fromDegrees(site?.lng??20,site?.lat??2,site?1100000:16500000),orientation:{heading:0,pitch:-Math.PI/2,roll:0},duration:reduceRef.current?0:1.5});
  }
  useEffect(()=>{
    setSelected(null);
    let v,handler,remove,detailActive=false;
    try{
      const base=new C.UrlTemplateImageryProvider({url:'/cesium/Assets/Textures/NaturalEarthII/{z}/{x}/{reverseY}.jpg',tilingScheme:new C.GeographicTilingScheme(),maximumLevel:2,credit:'Natural Earth II — public domain'});
      v=new C.Viewer(mount.current,{baseLayer:new C.ImageryLayer(base),baseLayerPicker:false,geocoder:false,terrainProvider:new C.EllipsoidTerrainProvider(),animation:false,timeline:false,homeButton:false,sceneModePicker:false,navigationHelpButton:false,fullscreenButton:false,infoBox:false,selectionIndicator:true,shouldAnimate:false,requestRenderMode:true,maximumRenderTimeChange:Infinity,skyBox:false,scene3DOnly:true});
      viewer.current=v;v.scene.backgroundColor=C.Color.fromCssColorString('#07130e');v.scene.globe.enableLighting=false;
      v.scene.screenSpaceCameraController.minimumZoomDistance=500;v.scene.screenSpaceCameraController.maximumZoomDistance=30000000;
      v.cesiumWidget.screenSpaceEventHandler.removeInputAction(C.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      const provider=new C.WebMapServiceImageryProvider({url:'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi',layers:'BlueMarble_ShadedRelief_Bathymetry',parameters:{format:'image/jpeg',transparent:false},maximumLevel:8,enablePickFeatures:false,credit:'NASA GIBS / Blue Marble'});
      const nasa=v.imageryLayers.addImageryProvider(provider);
      provider.errorEvent.addEventListener(e=>{e.retry=false;if(!v.isDestroyed()){nasa.show=false;if(!detailActive)setImagery('Natural Earth II · local fallback');v.scene.requestRender();}});
      if(!compact)C.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',{enablePickFeatures:false}).then(detail=>{if(v.isDestroyed())return;const layer=v.imageryLayers.addImageryProvider(detail);detail.errorEvent.addEventListener(e=>{e.retry=false;if(!v.isDestroyed()){layer.show=false;detailActive=false;setImagery(nasa.show?'NASA Blue Marble + Natural Earth':'Natural Earth II · local fallback');v.scene.requestRender();}});detailActive=true;setImagery('Esri World Imagery (provider attribution below)');v.scene.requestRender();}).catch(()=>{});
      sites.forEach((s,i)=>v.entities.add({id:s.id,name:s.name,position:C.Cartesian3.fromDegrees(s.lng,s.lat),point:{pixelSize:10,color:C.Color.fromCssColorString('#edcd85'),outlineColor:C.Color.fromCssColorString('#10241a'),outlineWidth:2},label:{text:s.name,show:!compact||['giza','serengeti','cape'].includes(s.id),font:compact?'bold 11px sans-serif':'bold 13px sans-serif',fillColor:C.Color.WHITE,outlineColor:C.Color.BLACK,outlineWidth:3,style:C.LabelStyle.FILL_AND_OUTLINE,showBackground:true,backgroundColor:C.Color.fromCssColorString('#10241ae8'),backgroundPadding:new C.Cartesian2(8,5),pixelOffset:new C.Cartesian2(s.overview?14:(i%2?14:-14),s.overview?-16:(i%2?-25:25)),horizontalOrigin:s.overview||i%2?C.HorizontalOrigin.LEFT:C.HorizontalOrigin.RIGHT,distanceDisplayCondition:new C.DistanceDisplayCondition(0,s.overview?30000000:2500000)}}));
      addWildlife(v,C,habitats);
      remove=v.selectedEntityChanged.addEventListener(e=>{if(e){const s=africanSites.find(s=>s.id===e.id);if(s)setSelected(s);}});
      handler=new C.ScreenSpaceEventHandler(v.scene.canvas);
      handler.setInputAction(click=>{const picked=v.scene.pick(click.position);const site=africanSites.find(s=>s.id===picked?.id?.id);if(site)navigate(`/destination/${site.id}`);else {const habitat=habitats.find(h=>h.id===picked?.id?.id);if(habitat){setSelected(habitat);if(compact)navigate(`/animals?species=${habitat.species}`);else flybys.current?.flyTo(habitat);}}},C.ScreenSpaceEventType.LEFT_CLICK);
      if(!compact)flybys.current=installDestinationFlybys(v,[...sites,...habitats],state=>{setTour(state);const d=[...africanSites,...wildlifeHabitats].find(d=>d.id===state.id);if(d)setSelected(d);});
      v.camera.setView({destination:C.Cartesian3.fromDegrees(20,2,16500000),orientation:{heading:0,pitch:-Math.PI/2,roll:0}});
      const requested=new URLSearchParams(window.location.search).get('destination');const resume=africanSites.find(s=>s.id===requested);if(resume&&!compact){setSelected(resume);flybys.current?.flyTo(resume);}
    }catch(e){setError('The globe could not start. You can still explore sites using the list.');}
    return()=>{flybys.current?.destroy();flybys.current=null;handler?.destroy();remove?.();if(v&&!v.isDestroyed())v.destroy();viewer.current=null;};
  },[compact,wildlifeOnly,filterSpecies]);
  function updateRoute(ids){const v=viewer.current;if(!v||v.isDestroyed())return;if(routeEntity.current)v.entities.remove(routeEntity.current);const points=ids.map(id=>africanSites.find(s=>s.id===id)).filter(Boolean);routeEntity.current=points.length>1?v.entities.add({name:"Journey concept — straight-line connections",polyline:{positions:C.Cartesian3.fromDegreesArray(points.flatMap(s=>[s.lng,s.lat])),width:3,material:C.Color.fromCssColorString("#edcd85")}}):null;v.scene.requestRender();}
  const list=sites.filter(s=>(s.name+' '+s.region+' '+s.type).toLowerCase().includes(query.toLowerCase()));
  const globe=<section className={`africa-globe ${compact?'africa-globe--compact':''}`} aria-label="African destination globe">
    <div className="globe-toolbar"><button onClick={()=>fly(null)}>Africa overview</button>{[1,-1].map(n=><button key={n} aria-label={n===1?'Zoom in':'Zoom out'} onClick={()=>{const v=viewer.current;if(v&&!v.isDestroyed()){n===1?v.camera.zoomIn(v.camera.positionCartographic.height*.4):v.camera.zoomOut(v.camera.positionCartographic.height*.5);v.scene.requestRender();}}}>{n===1?'+':'−'}</button>)}{compact&&<Link to="/world">Full explorer ↗</Link>}</div>
    <div ref={mount} className="africa-canvas" aria-label="Realistic 3D Earth with labelled African sites"/>
    {!compact&&<div className="globe-wildlife-picker"><label>Wildlife habitat<select value={selected?.species?selected.id:""} onChange={e=>fly(habitats.find(h=>h.id===e.target.value))}><option value="">Choose an animal habitat…</option>{habitats.map(h=><option key={h.id} value={h.id}>{h.name} · {h.region}</option>)}</select></label><small>Illustrative habitat placements, enlarged for visibility. Not live sightings. Fish shown at the surface as reef symbols.</small></div>}
    {!compact&&<div className="globe-flyby-controls"><button onClick={()=>fly(selected||(wildlifeOnly?habitats[0]:africanSites[0]))}>Start drone flyby</button><button onClick={()=>flybys.current?.cancel()} disabled={!tour.flying}>Stop</button><span role="status">{tour.flying?`Flying over ${tour.name}`:tour.name}</span></div>}
    {error&&<p className="globe-status" role="status">{error}</p>}
    <div className="globe-site-panel"><label>{compact?'Explore an African site':'Find an African site'}{compact?<select value="" onChange={e=>{if(e.target.value)navigate(`/destination/${e.target.value}`);}}><option value="">Choose a site…</option>{africanSites.map(s=><option key={s.id} value={s.id}>{s.name} · {s.region}</option>)}</select>:<input type="search" placeholder="Search place, country or landscape" value={query} onChange={e=>setQuery(e.target.value)}/>}</label>
      {wildlifeOnly&&<div className="globe-site-list" aria-label="Matching animal habitats">{habitats.map(h=><button className="habitat-place" key={h.id} onClick={()=>fly(h)}>{h.name} · {h.region}</button>)}</div>}
      {!compact&&!wildlifeOnly&&<div className="globe-site-list">{list.map(s=><div className="globe-site-row" key={s.id}><Link to={`/destination/${s.id}`}><strong>{s.name}</strong><span>{s.region} · {s.type}</span></Link><button aria-label={`Locate ${s.name} on globe`} aria-pressed={selected?.id===s.id} onClick={()=>fly(s)}>⌖</button></div>)}{!list.length&&<p>No matching sites.</p>}</div>}
      {selected&&<article className="globe-site-detail" aria-live="polite"><h2>{selected.name}</h2><p>{selected.desc}</p><Link className="primary" to={selected.species?`/animals?species=${selected.species}`:`/destination/${selected.id}`}>{selected.species?"Explore this animal ↗":"Explore this destination ↗"}</Link></article>}
    </div><p className="globe-help">Drag to rotate · Scroll or pinch to zoom · Click a gold marker to open its destination</p><p className="globe-source">Open-source CesiumJS · {imagery}. Regional discovery points, not precise wildlife locations. Shaded surface imagery, not a 3D terrain survey. Wildlife: Poly by Google (CC BY 3.0) and Quaternius (CC0). <a href="/models/credits.html">Model credits and licences</a></p>
  </section>;
  if(wildlifeOnly)return <section className="atlas-habitat-globe" aria-label="African wildlife habitat globe">{globe}<div className="wildlife-credits">{wildlifeSpecies.map(s=><span key={s.id}><a href={s.source} target="_blank" rel="noreferrer">{s.name}: {s.creator}</a> · <a href={s.licenseUrl}>{s.license}</a> · normalized and enlarged</span>)}</div></section>;
  return compact?globe:<main className="worldPage"><div className="worldTop"><div><div className="eyebrow">AFRICA IN 3D</div><h1>A continent of <em>possibilities.</em></h1><p>Search for an African site, select its marker, and fly closer to explore.</p></div><Link className="primary" to="/plan">Build your journey</Link></div><div className="africa-workspace">{globe}<GlobeJourneyStudio destinations={africanSites} selectedId={selected?.id||africanSites[0].id} onChoose={id=>fly(africanSites.find(s=>s.id===id))} onRouteChange={updateRoute}/></div></main>;
}
