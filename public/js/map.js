// const { number } = require("joi");
mapboxgl.accessToken = mapToken;



const n = coordinates.length;
let lan;
let lat;
const mid = (n/2);
if(n%2!==0){
    lan = coordinates.slice(0,mid)
    lat = coordinates.slice(mid+1,n)
}

let left = coordinates.slice(0,mid);
if(n%2===0){
    if(left%2!==0){
      lan = coordinates.slice(0,mid-1);
      lat = coordinates.slice(mid,n);
    }else{
        lan = coordinates.slice(0,mid);
        lat = coordinates.slice(mid+1,n);
    }
    
}

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v11", //Style url
    center: [lan, lat], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});


// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({color:'red'})
  .setLngLat([lan,lat]) // listing.geometry.coordinates
  .setPopup(new mapboxgl.Popup({offset: 25})
  .setHTML(`<h1>${Place}</h1><p>Exact location is provided after booking!</p>`))
  .addTo(map);
 
// console.log(coordinates);
// console.log(lan);
// console.log(lat);
// 85.137764,25.609907