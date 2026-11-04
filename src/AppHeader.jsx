import React,{useEffect,useRef} from 'react';
import {Link,NavLink,useLocation} from 'react-router-dom';
import {Compass,Menu,LogIn,LogOut,ArrowUpRight} from 'lucide-react';
const groups={
 'Discover':[['3D African globe','/world'],['Live Wild','/live'],['Africa right now','/right-now'],['Field notes','/blog'],['Our ethos','/about'],['Planning answers','/answers'],['Animal atlas','/animals']],
 'Your journey':[['Journey planner','/plan'],['Airport pickup','/transfers'],['Flights','/flights'],['Car rental','/cars'],['Wellness','/wellness'],['Field guide','/guide']],
 'In the field':[['Trip quests','/quests'],['Trip companion','/companion'],['Safety','/safety'],['AR explorer','/ar'],['Wildlife data','/telemetry'],['Biodiversity passport','/passport']],
 'Your Ryftlands':[['My journeys','/me'],['My story','/gallery'],['Story studio','/story-studio'],['Film director','/director'],['Explorer OS','/explorer-os'],['Conservation impact','/impact'],['Expedition room','/expedition'],['Explore the platform','/platform'],['Digital twin','/twin'],['Intelligence','/intelligence'],['Explorer','/explorer']],
};
export default function AppHeader({user,onLogin,onLogout}){
 const menu=useRef(null),location=useLocation();
 useEffect(()=>{if(menu.current)menu.current.open=false;},[location]);
 useEffect(()=>{const close=e=>{if(menu.current&&!menu.current.contains(e.target))menu.current.open=false;};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close);},[]);
 return <header className="app-header"><Link to="/" className="brand"><span className="brandmark"><Compass size={25}/></span><span>Wild <strong>Ryftlands</strong><small>Explore a little further</small></span></Link>
  <nav aria-label="Main navigation"><NavLink to="/world">Discover Africa</NavLink><NavLink to="/plan">Plan a journey</NavLink><NavLink to="/live">Live Wild</NavLink></nav>
  <div className="header-actions"><details ref={menu} className="app-menu" onKeyDown={e=>{if(e.key==='Escape'){menu.current.open=false;menu.current.querySelector('summary').focus();}}}><summary aria-label="Explore menu"><Menu size={18}/><span>Explore</span></summary><div className="app-menu-panel"><div className="menu-intro"><span>The whole world of Ryftlands</span><Link to="/world">Start with the globe <ArrowUpRight size={16}/></Link></div><div className="app-menu-groups">{Object.entries(groups).map(([title,links])=><section key={title}><h2>{title}</h2>{links.map(([label,to])=><NavLink to={to} key={to}>{label}</NavLink>)}</section>)}</div></div></details><button className="login" aria-label={user?'Sign out':'Sign in'} onClick={user?onLogout:onLogin}>{user?<LogOut size={16}/>:<LogIn size={16}/>}<span>{user?'Sign out':'Sign in'}</span></button></div>
 </header>;
}
