import React,{useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import {ArrowUpRight,MapPin} from 'lucide-react';
import {immersiveDestinations} from './immersiveDestinations';
export default function JourneyFinder(){
 const [place,setPlace]=useState(''),navigate=useNavigate();
 return <section className="journey-finder" aria-label="Find your next landscape"><div><MapPin size={22}/><span>Find your next landscape<small>15 places. A continent of possibilities.</small></span></div><form onSubmit={e=>{e.preventDefault();navigate(place?`/destination/${place}`:'/world');}}><label className="visually-hidden" htmlFor="find-landscape">Choose a destination</label><select id="find-landscape" value={place} onChange={e=>setPlace(e.target.value)}><option value="">Where would you like to go?</option>{immersiveDestinations.map(d=><option value={d.id} key={d.id}>{d.name} — {d.region}</option>)}</select><button className="primary">Explore destination <ArrowUpRight size={17}/></button></form><Link to="/world">Or explore the globe ↗</Link></section>;
}
