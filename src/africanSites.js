import {destinationCatalog} from './data.js';
export const africanSites = [
  ...destinationCatalog.map(d=>({...d, destinationId:d.id, overview:false})),
  {id:'serengeti',name:'Serengeti National Park',region:'Tanzania',type:'Wildlife',lat:-2.333,lng:34.567,desc:'Explore the grassland ecosystem of the Serengeti.',source:'https://whc.unesco.org/en/list/156/',overview:true},
  {id:'kilimanjaro',name:'Mount Kilimanjaro',region:'Tanzania',type:'Origins',lat:-3.067,lng:37.367,desc:'Africa’s highest mountain and its surrounding national park.',source:'https://whc.unesco.org/en/list/403/',overview:false},
  {id:'victoria-falls',name:'Victoria Falls',region:'Zambia / Zimbabwe',type:'Water',lat:-17.9245,lng:25.8554,desc:'Mosi-oa-Tunya and the Zambezi River landscape.',source:'https://whc.unesco.org/en/list/509/',overview:true},
  {id:'cape',name:'Cape Floral Region',region:'South Africa',type:'Wellness',lat:-33.96,lng:18.41,desc:'Discover the Cape’s mountain scenery and distinctive flora.',source:'https://whc.unesco.org/en/list/1007/',overview:true},
  {id:'giza',name:'Pyramids of Giza',region:'Egypt',type:'Origins',lat:29.979,lng:31.134,desc:'An ancient landscape on the western edge of the Nile Valley.',source:'https://whc.unesco.org/en/list/86/',overview:true},
  {id:'okavango',name:'Okavango Delta',region:'Botswana',type:'Water',lat:-19.28,lng:22.9,desc:'An inland delta shaped by seasonal water and wetland habitats.',source:'https://whc.unesco.org/en/list/1432/',overview:false},
  {id:'tsingy',name:'Tsingy de Bemaraha',region:'Madagascar',type:'Origins',lat:-18.667,lng:44.75,desc:'A landscape of limestone formations and protected habitats.',source:'https://whc.unesco.org/en/list/494/',overview:true},
  {id:'sahara',name:'Tassili n’Ajjer',region:'Algeria',type:'Origins',lat:25.5,lng:9,desc:'Saharan sandstone landscapes and rock-art heritage.',source:'https://whc.unesco.org/en/list/179/',overview:true},
  {id:'ngorongoro',name:'Ngorongoro',region:'Tanzania',type:'Wildlife',lat:-3.19,lng:35.54,desc:'A volcanic highland landscape within the wider Serengeti region.',source:'https://whc.unesco.org/en/list/39/',overview:false},
];
