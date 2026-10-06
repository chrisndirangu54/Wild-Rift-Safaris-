import os,re,json
from fastapi import FastAPI,Header,HTTPException
from pydantic import BaseModel
app=FastAPI(title="Wild Ryftlands Graph Extractor")
TOKEN=os.getenv("SERVICE_TOKEN","")
class Req(BaseModel): content:str;url:str="";schema:dict={};instructions:str=""
def guard(a):
 if TOKEN and a!=f"Bearer {TOKEN}": raise HTTPException(401,"unauthorized")
def text_only(s): return re.sub(r"<[^>]+>"," ",s)
@app.get("/health")
def health(): return {"ok":True,"service":"graph-extractor"}
@app.post("/")
def extract(r:Req,authorization:str|None=Header(default=None)):
 guard(authorization);t=re.sub(r"\s+"," ",text_only(r.content))[:500000];out=[]
 patterns=[("hotel",r"\b(hotel|lodge|resort|camp)\b"),("attraction",r"\b(museum|park|reserve|beach|monument|fort|trail)\b"),("geology",r"\b(volcan|geolog|rift|fault|rock|sediment|basalt)\w*\b"),("culture",r"\b(cultur|heritage|tradition|community)\w*\b")]
 for typ,pat in patterns:
  for m in list(re.finditer(pat,t,re.I))[:10]:
   a=max(0,m.start()-180);b=min(len(t),m.end()+300);e=t[a:b].strip();out.append({"kind":"knowledge-fragment","node":{"type":typ,"name":e[:120],"summary":e},"evidence":e,"confidence":0.35})
 return {"candidates":out[:50],"extractor":"deterministic-baseline","llmUsed":False}
