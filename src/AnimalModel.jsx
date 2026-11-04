import React,{Suspense,useEffect,useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls,Bounds,useGLTF,Center} from '@react-three/drei';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
function Animal({url}){const {scene}=useGLTF(url);const [model]=useState(()=>clone(scene));return <Center><primitive object={model}/></Center>;}
class ModelError extends React.Component{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<p role="status">The model could not load. You can still explore its habitat on the globe.</p>:this.props.children}}
export default function AnimalModel({species}){return <div className="atlas-model" aria-label={`Interactive 3D ${species.name} model`}><ModelError key={species.id}><Canvas camera={{position:[2,1.2,2],fov:40}} frameloop="demand"><color attach="background" args={['#e3efdf']}/><ambientLight intensity={1.8}/><directionalLight position={[3,5,4]} intensity={3}/><Suspense fallback={null}><Bounds fit clip observe margin={1.4}><Animal key={species.id} url={species.url}/></Bounds></Suspense><OrbitControls makeDefault minDistance={.5} maxDistance={6} enablePan={false}/></Canvas></ModelError><span>Drag to rotate · Scroll to zoom · Stylized educational model</span></div>}
