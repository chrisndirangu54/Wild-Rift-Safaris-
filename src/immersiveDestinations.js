import {africanSites} from './africanSites';
import {destinationCatalog} from './data';
import photos from './destinationPhotos.json';

const profiles={
  serengeti:{story:'Across the Serengeti, grasslands connect seasonal water, migrating grazers and the predators that follow them. This is a landscape to understand through its relationships: rainfall, movement and the changing rhythm of the plains.',highlights:['Savannah ecology','Migration interpretation','Landscape photography']},
  kilimanjaro:{story:'Kilimanjaro rises above the surrounding plains to 5,895 metres. Its volcanic form and mountain forests create a striking change of landscape, from the savannah below toward Africa’s highest summit.',highlights:['Volcanic landscapes','Mountain forest ecology','Guided mountain interpretation']},
  'victoria-falls':{story:'At Mosi-oa-Tunya, the Zambezi River plunges into basalt gorges. Water, spray and rock shape the experience: a river landscape that rewards both the broad view and attention to its geological details.',highlights:['Waterfall viewpoints','Zambezi River interpretation','Basalt gorge landscapes']},
  cape:{story:'South Africa’s Cape Floral Region brings mountains, catchments and extraordinary plant diversity into close conversation. Its fynbos vegetation tells a story of adaptation to seasonal climate and fire.',highlights:['Fynbos discovery','Mountain landscapes','Botanical interpretation']},
  giza:{story:'The pyramid fields around ancient Memphis preserve monumental evidence of Egypt’s Old Kingdom. At Giza, stone, geometry and the wider Nile Valley setting invite a closer look at architecture and human history.',highlights:['Pyramid architecture','Old Kingdom heritage','Guided cultural interpretation']},
  okavango:{story:'The Okavango is an inland delta where water spreads through permanent marshes and seasonally flooded plains. Its flood cycle supports a rich wetland ecosystem and changes the character of the landscape through the year.',highlights:['Wetland ecology','Seasonal flood interpretation','Bird and landscape observation']},
  tsingy:{story:'Western Madagascar’s limestone landscapes rise into sharp tsingy formations. Around them, dry forests and river systems support distinctive habitats. Bemaraha is part of the wider Andrefana Dry Forests World Heritage property.',highlights:['Limestone geology','Dry forest habitats','Landscape interpretation']},
  sahara:{story:'At Tassili n’Ajjer, eroded sandstone and prehistoric rock art connect desert geology with a long record of human life. The landscape offers a way to think about environmental change across deep time.',highlights:['Sandstone formations','Rock-art interpretation','Desert landscape photography']},
  ngorongoro:{story:'Ngorongoro combines volcanic highlands, a great crater, woodlands and open plains. Wildlife, pastoral livelihoods and evidence of human evolution form a layered landscape whose story extends well beyond a single viewpoint.',highlights:['Caldera geology','Highland ecosystems','Human-origins interpretation']},
};
export const immersiveDestinations=africanSites.map(site=>{
 const original=destinationCatalog.find(d=>d.id===site.id),profile=profiles[site.id]||{};
 const gallery=photos[site.id]||[];
 const fallback=original||destinationCatalog.find(d=>d.type===site.type)||destinationCatalog[0];
 return {...fallback,...site,...profile,country:original?.country||site.region,season:original?.season||'Confirm for your route',mood:original?.mood||'Discovery',icon:original?.icon||'◎',gallery,image:gallery[0]?.url||fallback.image,heroPhoto:gallery[0],highlights:profile.highlights||original?.highlights||[]};
});
