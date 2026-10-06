import os,io,hashlib
import numpy as np
import requests
import rasterio
from fastapi import FastAPI,Header,HTTPException
from pydantic import BaseModel
app=FastAPI(title="Wild Ryftlands Geospatial Worker");TOKEN=os.getenv("SERVICE_TOKEN","")
class Req(BaseModel): asset_url:str;sensor:str;recipe:str;crs:str|None=None;resolution_m:float|None=None;footprint:dict|None=None;parameters:dict={}
def guard(a):
 if TOKEN and a!=f"Bearer {TOKEN}": raise HTTPException(401,"unauthorized")
@app.get("/health")
def health(): return {"ok":True,"service":"geospatial-worker"}
@app.post("/")
def process(r:Req,authorization:str|None=Header(default=None)):
 guard(authorization)
 if not r.asset_url.startswith("https://"): raise HTTPException(400,"https asset required")
 if r.recipe=="metadata": return {"name":f"{r.sensor} metadata","summary":"Remote-sensing asset registered for reviewed geospatial use.","model":"rasterio-metadata","metrics":{"recipe":"metadata"}}
 resp=requests.get(r.asset_url,timeout=25,stream=True);resp.raise_for_status();data=resp.raw.read(100*1024*1024+1)
 if len(data)>100*1024*1024: raise HTTPException(413,"asset too large")
 try:
  with rasterio.MemoryFile(data) as mf:
   with mf.open() as ds:
    metrics={"bands":ds.count,"width":ds.width,"height":ds.height,"crs":str(ds.crs),"resolution":[abs(ds.transform.a),abs(ds.transform.e)]}
    if r.recipe in ("ndvi","ndwi") and ds.count>=2:
     a=ds.read(1,out_shape=(1,min(ds.height,1024),min(ds.width,1024))).astype("float32");b=ds.read(2,out_shape=a.shape).astype("float32");idx=(b-a)/(b+a+1e-6);metrics.update({"indexMean":float(np.nanmean(idx)),"indexMin":float(np.nanmin(idx)),"indexMax":float(np.nanmax(idx))})
    summary=f"{r.sensor} {r.recipe} processing completed. Review required before graph publication."
    return {"name":f"{r.sensor} {r.recipe} layer","summary":summary,"model":"rasterio-baseline","metrics":metrics}
 except Exception as e: raise HTTPException(422,f"unsupported raster: {str(e)[:180]}")
