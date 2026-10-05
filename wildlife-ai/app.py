import io,os,time,uuid,requests
from collections import defaultdict
from fastapi import FastAPI,HTTPException
from pydantic import BaseModel,HttpUrl
from PIL import Image
from PytorchWildlife.models import detection as pw_detection
app=FastAPI(title="Wild Ryftlands Wildlife AI",version="1.0")
MODEL=os.getenv("MEGADETECTOR_MODEL","MDV6-apa-rtdetr-e");THRESHOLD=float(os.getenv("DETECTION_THRESHOLD","0.25"));EVENT_GAP=int(os.getenv("EVENT_GAP_SECONDS","45"))
model=pw_detection.MegaDetectorV6(version=MODEL);events=defaultdict(dict)
class Frame(BaseModel): image_url:HttpUrl;source_id:str="owned-camera";tasks:list[str]=["detection","count"]
def fetch(url):
 r=requests.get(str(url),timeout=12);r.raise_for_status()
 if len(r.content)>12000000:raise HTTPException(413,"Frame too large")
 return Image.open(io.BytesIO(r.content)).convert("RGB")
def normalize(result):
 boxes=getattr(result,"boxes",None);out=[]
 if boxes is None:return out
 names=getattr(result,"names",{0:"animal",1:"person",2:"vehicle"})
 for i,b in enumerate(getattr(boxes,"xyxy",[])):
  score=float(boxes.conf[i])
  if score<THRESHOLD:continue
  label=names.get(int(boxes.cls[i]),"animal") if isinstance(names,dict) else "animal"
  out.append({"label":label,"confidence":round(score,4),"bbox":[round(float(x),2) for x in b]})
 return out
def aggregate(source,dets):
 now=time.time();n=sum(d["label"]=="animal" for d in dets);state=events[source].get("animal")
 if n:
  if not state or now-state["last"]>EVENT_GAP:state={"eventId":str(uuid.uuid4()),"first":now,"last":now,"peakCount":n}
  else:state.update(last=now,peakCount=max(state["peakCount"],n))
  events[source]["animal"]=state;return {"eventId":state["eventId"],"status":"active","countNow":n,"peakCount":state["peakCount"],"startedAt":state["first"]}
 if state and now-state["last"]<=EVENT_GAP:return {"eventId":state["eventId"],"status":"cooldown","countNow":0,"peakCount":state["peakCount"]}
 return None
@app.get("/health")
def health():return {"ok":True,"model":MODEL,"threshold":THRESHOLD}
@app.post("/analyze")
def analyze(f:Frame):
 try: result=model.single_image_detection(fetch(f.image_url));dets=normalize(result)
 except Exception as e: raise HTTPException(502,f"Inference failed: {type(e).__name__}")
 counts={k:sum(d["label"]==k for d in dets) for k in ("animal","person","vehicle")}
 return {"model":MODEL,"detections":dets,"counts":counts,"event":aggregate(f.source_id,dets),"species":None,"speciesNote":"MegaDetector detects animals; connect a validated regional species classifier before assigning species labels."}
