import React,{useEffect} from 'react';
import {useLocation,Link} from 'react-router-dom';
import {SITE_URL,FAQs,getPageContent} from './siteContent';
import photos from './destinationPhotos.json';

export function SeoManager(){
 const {pathname}=useLocation();
 useEffect(()=>{
  const page=getPageContent(pathname),canonical=SITE_URL+(pathname==='/'?'/':pathname),image=photos[page.imageId]?.[0]?.url;
  document.title=page.title;
  const meta=(key,value,property=false)=>{let tag=document.head.querySelector(`meta[${property?'property':'name'}="${key}"]`);if(!tag){tag=document.createElement('meta');tag.setAttribute(property?'property':'name',key);document.head.append(tag);}tag.content=value;};
  meta('description',page.description);meta('robots',page.private?'noindex,follow':'index,follow,max-image-preview:large');meta('og:title',page.title,true);meta('og:description',page.description,true);meta('og:url',canonical,true);meta('og:type','website',true);meta('og:site_name','Wild Ryftlands',true);meta('twitter:card','summary_large_image');meta('twitter:title',page.title);meta('twitter:description',page.description);if(image){meta('og:image',image,true);meta('twitter:image',image);}
  let link=document.head.querySelector('link[rel="canonical"]');if(!link){link=document.createElement('link');link.rel='canonical';document.head.append(link);}link.href=canonical;
  let script=document.getElementById('site-schema');if(!script){script=document.createElement('script');script.id='site-schema';script.type='application/ld+json';document.head.append(script);}
  const graph=[{'@type':'WebPage','@id':canonical,name:page.title,description:page.description,url:canonical,isPartOf:{'@id':SITE_URL+'/#website'}}];
  if(pathname==='/')graph.push({'@type':'WebSite','@id':SITE_URL+'/#website',name:'Wild Ryftlands',url:SITE_URL},{'@type':'Organization','@id':SITE_URL+'/#organization',name:'Wild Ryftlands',url:SITE_URL});
  if(page.destination)graph.push({'@type':'TouristDestination',name:page.destination.name,description:page.destination.desc,url:canonical,image,geo:{'@type':'GeoCoordinates',latitude:page.destination.lat,longitude:page.destination.lng}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:SITE_URL+'/'},{'@type':'ListItem',position:2,name:'African globe',item:SITE_URL+'/world'},{'@type':'ListItem',position:3,name:page.destination.name,item:canonical}]});
  if(pathname==='/'||pathname==='/answers')graph.push({'@type':'FAQPage',mainEntity:FAQs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))});
  script.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph});
 },[pathname]);return null;
}
export function AnswerSection(){return <section className="answer-section" aria-label="Journey planning answers"><div><span>Before you go</span><h2>A few useful answers.</h2><p>Understand the tools, the planning process and what still needs a local operator’s confirmation.</p><Link to="/plan" className="primary">Start planning</Link></div><div>{FAQs.map(f=><details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div></section>;}
export function AnswersPage(){return <main className="page answers-page"><h1>Clear answers.<br/>Better journeys.</h1><p>Quick, direct answers about exploring Africa with Wild Ryftlands.</p><AnswerSection/></main>;}
export function RouteScenery(){
 const {pathname}=useLocation();if(pathname==='/'||pathname.startsWith('/destination/')||pathname==='/world')return null;
 const page=getPageContent(pathname),photo=photos[page.imageId]?.[0];if(!photo)return null;
 return <figure className="route-scenery"><img src={photo.url} alt={photo.title.replace(/\.[^.]+$/,'').replaceAll('_',' ')} decoding="async"/><div><span>African landscapes, closer.</span><Link to={`/destination/${page.imageId}`}>Explore this place ↗</Link></div><figcaption>Photo: {photo.artist} · <a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.license} / original</a></figcaption></figure>;
}
