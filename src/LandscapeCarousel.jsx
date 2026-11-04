import React,{useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {destinationCatalog} from './data';
import {useInViewport,useReducedMotion} from './ScenicMotion';
import './immersive.css';

export default function LandscapeCarousel({onSelect,selectedId}) {
  const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[engaged,setEngaged]=useState(false);
  const ref=useRef(null),visible=useInViewport(ref),reduced=useReducedMotion();
  const current=selectedId?Math.max(0,destinationCatalog.findIndex(d=>d.id===selectedId)):index;
  const select=i=>{const next=(i+destinationCatalog.length)%destinationCatalog.length;setIndex(next);onSelect?.(destinationCatalog[next]);};
  useEffect(()=>{
    if(paused||engaged||reduced||!visible||onSelect)return;
    const id=setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%destinationCatalog.length);},6500);
    return()=>clearInterval(id);
  },[paused,engaged,reduced,visible,onSelect,current]);
  const d=destinationCatalog[current];
  return <section ref={ref} className="landscape-carousel" data-still={paused||engaged||reduced||!visible||Boolean(onSelect)} aria-label="Landscape inspiration" aria-roledescription="carousel"
    onMouseEnter={()=>setEngaged(true)} onMouseLeave={()=>setEngaged(false)}
    onFocusCapture={()=>setEngaged(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setEngaged(false);}}
    onKeyDown={e=>{if(e.target.tagName==='INPUT')return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(current+(e.key==='ArrowRight'?1:-1));}}}>
    <div className="landscape-stage">
      {destinationCatalog.map((item,i)=><img className={i===current?'landscape-photo is-active':'landscape-photo'} key={item.id} src={item.image} alt="" aria-hidden="true" loading={i===0?'eager':'lazy'}/>)}
      <div className="landscape-shade"/>
      <div className="landscape-copy" key={d.id} role="group" aria-roledescription="slide" aria-label={`${current+1} of ${destinationCatalog.length}: ${d.name}`}>
        <span className="landscape-kicker">{onSelect?'Choose your field landscape':'A window into the wild'} / {d.type}</span>
        <h2>{d.name}</h2><p>{d.desc}</p>
        <div className="landscape-meta"><span>{d.region}</span><span>{d.mood}</span><span>{d.season}</span></div>
        <Link className="primary" to={`/destination/${d.id}`}>Explore this landscape ↗</Link>
      </div>
      <div className="landscape-controls">
        <button aria-label="Previous landscape" onClick={()=>select(current-1)}>←</button>
        <span>{String(current+1).padStart(2,'0')} / 06</span>
        <button aria-label="Next landscape" onClick={()=>select(current+1)}>→</button>
        {!onSelect&&!reduced&&<button aria-pressed={paused} aria-label={paused?'Play slideshow':'Pause slideshow'} onClick={()=>setPaused(p=>!p)}>{paused?'▶':'Ⅱ'}</button>}
      </div>
      <a className="photo-license" href="/photo-credits.html" target="_blank" rel="noopener noreferrer">Illustrative photography · Free-use photo credits ↗</a>
    </div>
    <div className="landscape-thumbs" aria-label="Choose a landscape">
      {destinationCatalog.map((item,i)=><button key={item.id} aria-pressed={i===current} onClick={()=>select(i)}><img src={item.image.replace('w=1400','w=160')} alt="" loading="lazy"/><span>{item.name}</span></button>)}
    </div>
  </section>;
}

export function ParallaxLandscape() {
  const ref=useRef(null),reduced=useReducedMotion();
  useEffect(()=>{
    if(reduced)return;
    const element=ref.current;let frame=0;
    const update=()=>{frame=0;const rect=element.parentElement.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight)element.style.transform=`translate3d(0,${Math.max(-100,Math.min(100,-rect.top*.16))}px,0) scale(1.16)`;};
    const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',scroll,{passive:true});update();
    return()=>{window.removeEventListener('scroll',scroll);cancelAnimationFrame(frame);element.style.transform='';};
  },[reduced]);
  return <div ref={ref} className="parallax-landscape" aria-hidden="true"><img src={destinationCatalog[0].image} alt=""/><div/></div>;
}
