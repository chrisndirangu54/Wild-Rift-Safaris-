import React,{useMemo,useState} from 'react';
import {destinationCatalog} from './data';

const fieldNotes={
  mara:{environment:'Seasonal rainfall supports grasslands and a dynamic grazing ecosystem. Migration timing changes each year; animated corridors are generalized, not live animal positions.',culture:'The wider Mara landscape includes Maasai communities and locally operated conservancies. Seek consent and work with community-led guides for cultural experiences.',care:'Stay on permitted routes; do not approach wildlife or share sensitive sightings.'},
  rift:{environment:'Escarpments, volcanic landforms and lakes reveal processes driven by tectonic extension. Water levels and habitat conditions vary by locality.',culture:'The Rift Valley contains many distinct communities and heritage sites. Interpret individual sites with local custodians rather than treating the region as one culture.',care:'Use established trails, check terrain conditions and avoid unsupported geological access.'},
  coast:{environment:'Coastal mangroves, estuaries, reefs and inland catchments form connected ecosystems vulnerable to sedimentation and pollution.',culture:'Swahili maritime heritage reflects long-standing East African and Indian Ocean connections. Respect living religious and architectural sites.',care:'Use responsible marine operators; avoid disturbing reef and mangrove habitats.'},
  forest:{environment:'Forest canopies provide habitat, influence water cycles and support diverse bird and plant communities. Biodiversity depends on the specific forest.',culture:'Forest use and protection involve local communities and varied knowledge systems. Ask permission before recording people, ceremonies or traditional knowledge.',care:'Follow protected-area access rules and low-impact walking practices.'},
  desert:{environment:'Arid landscapes preserve geological and archaeological evidence while supporting species adapted to scarce and variable rainfall.',culture:'Northern Kenya is home to distinct pastoral and other communities, each with their own practices. Arrange interpretation with locally authorized guides.',care:'Plan for heat, water availability and protected archaeological areas.'},
  river:{environment:'Watersheds connect upstream rainfall, wetlands, floodplains and downstream fisheries. Rivers may change dramatically with the season.',culture:'River routes connect communities with different histories and livelihoods; community-specific narratives require verification.',care:'Confirm boating and flood safety with local operators.'}
};
const tabs=['Environment','Culture','Journey'];
export default function GlobeJourneyStudio({selectedId,onChoose,onRouteChange}){
 const [tab,setTab]=useState('Environment');
 const [stops,setStops]=useState([]);
 const [startDate,setStartDate]=useState('');
 const [days,setDays]=useState(5);
 const [travellers,setTravellers]=useState(2);
 const [budget,setBudget]=useState('');
 const selected=useMemo(()=>destinationCatalog.find(d=>d.id===selectedId)||destinationCatalog[0],[selectedId]);
 const picked=stops.map(id=>destinationCatalog.find(d=>d.id===id)).filter(Boolean);
 const notes=fieldNotes[selected?.id]||{};
 function updateStops(ids){setStops(ids);onRouteChange(ids);}
 function add(){if(selected&&!stops.includes(selected.id))updateStops([...stops,selected.id]);setTab('Journey');}
 function remove(id){updateStops(stops.filter(x=>x!==id));}
 function shift(index,delta){const next=[...stops];const j=index+delta;if(j<0||j>=next.length)return;[next[index],next[j]]=[next[j],next[index]];updateStops(next);}
 function exportJourney(){const payload={schema:'wild-ryftlands-journey-draft-v1',startDate:startDate||null,days:Number(days),travellers:Number(travellers),budgetContext:budget,stops:picked.map(d=>({id:d.id,name:d.name,lat:d.lat,lng:d.lng})),notice:'Concept only: routes, availability, prices and transfers are unverified.'};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ryftlands-journey.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <aside className="globeStudio" aria-label="Destination knowledge and journey studio">
   <div className="globeStudioHeading"><span className="eyebrow">EXPLORE + PLAN IN 3D</span><h2>{selected?.name}</h2><p>{selected?.region} · {selected?.season}</p></div>
   <label className="globeStudioPick">Destination<select value={selected?.id||''} onChange={e=>onChoose(e.target.value)}>{destinationCatalog.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
   <div className="globeStudioTabs" role="tablist" aria-label="Explorer information">{tabs.map(x=><button type="button" key={x} role="tab" aria-selected={tab===x} onClick={()=>setTab(x)}>{x}</button>)}</div>
   {tab==='Environment'&&<section role="tabpanel"><h3>Living landscape</h3><p>{notes.environment}</p><h3>Responsible exploration</h3><p>{notes.care}</p><p className="globeStudioNote">Editorial interpretation, not live monitoring or a site-specific environmental assessment.</p><button type="button" onClick={add}>Add to my journey</button></section>}
   {tab==='Culture'&&<section role="tabpanel"><h3>People and heritage</h3><p>{notes.culture}</p><h3>Experience ideas</h3><ul>{selected?.highlights?.map(h=><li key={h}>{h}</li>)}</ul><p className="globeStudioNote">General context only. Cultural interpretation and access must be verified with community representatives and guides.</p><button type="button" onClick={add}>Add to my journey</button></section>}
   {tab==='Journey'&&<section role="tabpanel"><h3>Design your route</h3><button type="button" onClick={add} disabled={stops.includes(selected?.id)}>Add selected destination</button>{picked.length?<ol className="globeStops">{picked.map((d,i)=><li key={d.id}><span><strong>{d.name}</strong><small>Stop {i+1}</small></span><div><button type="button" aria-label={'Move '+d.name+' earlier'} disabled={!i} onClick={()=>shift(i,-1)}>↑</button><button type="button" aria-label={'Move '+d.name+' later'} disabled={i===picked.length-1} onClick={()=>shift(i,1)}>↓</button><button type="button" aria-label={'Remove '+d.name} onClick={()=>remove(d.id)}>×</button></div></li>)}</ol>:<p>Select destinations on the globe and add them to your journey.</p>}
     <div className="globeStudioFields"><label>Preferred start<input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/></label><label>Days<input type="number" min="1" max="30" value={days} onChange={e=>setDays(e.target.value)}/></label><label>Travellers<input type="number" min="1" max="30" value={travellers} onChange={e=>setTravellers(e.target.value)}/></label><label>Budget context<input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="e.g. KES 80,000"/></label></div>
     <button type="button" disabled={!picked.length} onClick={exportJourney}>Export journey draft</button><p className="globeStudioNote">Your route is a planning concept, not a verified driving itinerary or confirmed reservation. Exporting does not send a booking request.</p>
   </section>}
 </aside>;
}
