import React,{useEffect} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ArrowLeft,MapPin,CalendarDays,ShieldCheck} from 'lucide-react';
import {immersiveDestinations} from './immersiveDestinations';
import './destination.css';

function Credit({photo}){return photo?<span>Photo: {photo.artist} · <a href={photo.source} target="_blank" rel="noopener noreferrer">Original</a> · <a href={photo.licenseUrl||photo.source} target="_blank" rel="noopener noreferrer">{photo.license}</a></span>:<a href="/photo-credits.html">Illustrative landscape photography · credits</a>;}
export default function ImmersiveDestination(){
 const {id}=useParams(),d=immersiveDestinations.find(d=>d.id===id);
 useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[id]);
 if(!d)return <main className="page"><h1>Landscape not found.</h1><Link to="/world">Explore the African globe</Link></main>;
 return <main className="immersive-destination">
  <section className="destination-hero" style={{backgroundImage:`linear-gradient(0deg,#07150ff2,transparent 80%),linear-gradient(90deg,#07150f99,transparent),url("${d.image}")`}}>
   <Link className="destination-back" to={`/world?destination=${d.id}`}><ArrowLeft size={16}/> Back to the globe</Link>
   <div className="destination-title"><span>{d.type} / {d.region}</span><h1>{d.name}</h1><p>{d.desc}</p><a className="primary" href="#destination-story">Discover this place ↓</a></div>
   <div className="destination-credit"><Credit photo={d.heroPhoto}/></div>
  </section>
  <section className="destination-editorial" id="destination-story"><div>
   <div className="destination-facts"><span><MapPin size={16}/>{d.country}</span><span><CalendarDays size={16}/>{d.season}</span><span>{d.mood}</span></div>
   <h2>A closer connection<br/>to this landscape.</h2><p className="destination-story">{d.story}</p>
   {d.source&&<a className="destination-source" href={d.source} target="_blank" rel="noopener noreferrer">Explore the UNESCO site record ↗</a>}
   <h3>Ways to experience it</h3><ul className="destination-experiences">{d.highlights.map(h=><li key={h}>{h}</li>)}</ul>
  </div><aside><ShieldCheck size={28}/><h3>Make it your journey.</h3><p>Shape your interests, pace and time into a journey concept. Confirm access, timing and local arrangements with a qualified operator before travel.</p><Link className="primary" to={`/plan?destination=${d.id}`}>Plan this journey ↗</Link><Link className="destination-source" to={`/world?destination=${d.id}`}>Keep exploring Africa</Link></aside></section>
  {d.gallery.length>0&&<section className="destination-gallery" aria-label={`${d.name} photo gallery`}><div className="destination-gallery-heading"><span>A sense of place</span><h2>See the landscape.</h2></div><div className="destination-photo-grid">{d.gallery.map((p,i)=><figure key={p.source}><img src={p.url} alt={p.title.replace(/\.[^.]+$/,'').replaceAll('_',' ')} loading="lazy"/><figcaption><Credit photo={p}/></figcaption></figure>)}</div><p className="gallery-note">Photographs document locations in this landscape or region. They do not show live conditions or guarantee a particular wildlife encounter.</p></section>}
  <section className="destination-closing"><h2>Find your own<br/>way into the wild.</h2><Link className="primary" to={`/plan?destination=${d.id}`}>Build a journey</Link><Link to={`/world?destination=${d.id}`}>Return to the globe ↗</Link></section>
 </main>;
}
