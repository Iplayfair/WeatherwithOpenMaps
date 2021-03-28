
  let button = document.getElementById('submit');
  
  //Map inizalisierung
  let mymap = L.map('mapid').setView([0, 0], 12);
  let firstTime = true;
  

/* window.addEventListener('load',getAPI);
window.addEventListener('load',map);
window.addEventListener('load',backgroundChange); */
window.addEventListener('load',getPosition);
button.addEventListener('click',getAPI,backgroundChange,map);

 

function getPosition() {
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition,errorHandling);
  }
  else{
    console.log("No Location found")
  }
}
//Get Lat Long of the Location that we tracked and show it on the Map
async function showPosition(position) {
  let lat = position.coords.latitude
  let lng = position.coords.longitude

  console.log(lat,lng);

  let api_main = 'http://api.openweathermap.org/data/2.5/weather?';
  let api_key = '&APPID=55a6e7d291b29415e1bbe29d9bf3b7ae&units=metric';
  let api_input = "lat=" + lat + "&lon=" + lng
  let api = api_main + api_input +api_key;

  console.log(api);
  
  const response = await fetch(api);
  const data = await response.json();

  document.getElementById('stadt').innerText = document.getElementById('input').value = data.name;
  document.getElementById('temp').innerText =Math.round(data.main.temp *10)/10;

  
  await backgroundChange();
  await map();


  
  console.log(data);

  return data;
}
//Erro handling when we dont get a Geolocation
async function errorHandling(error) {
  switch(error.code) {
      case error.PERMISSION_DENIED:
          console.log("PERMISSION_DENIED");
          await getAPI();
          await backgroundChange();
          await map();

          break;
      case error.POSITION_UNAVAILABLE:
          console.log("POSITION_UNAVAIABLE");
          await getAPI();
          await backgroundChange();
          await map();
          break;
      case error.TIMEOUT:
          console.log("TIMEOUT")
          await getAPI();
          await backgroundChange();
          await map();
          break;
      case error.UNKNOWN_ERROR:
            console.log("UNKNOWN_ERROR")
          await getAPI();
          await backgroundChange();
          await map();
          break;
  }
}


async function getAPI() {

  
//API generieren
 let api_main = 'http://api.openweathermap.org/data/2.5/weather?';
 let api_key = '&APPID=55a6e7d291b29415e1bbe29d9bf3b7ae&units=metric';
 let api_input = "q=" + document.getElementById('input').value;


 let api = api_main + api_input + api_key;
//API fetch()
      const response = await fetch(api)
      const data = await response.json();
      
      document.getElementById('stadt').innerText = document.getElementById('input').value = data.name;
      document.getElementById('temp').innerText =Math.round(data.main.temp *10)/10;
      
return data;
      
}

    
    //Backround Change
async function backgroundChange(){
    
    let data;
    if(navigator.geolocation == true){
      data = await showPosition();
    }
    else{
      data = await getAPI();
    }
    
  
    

    if(Math.round(data.main.temp *10)/10<= 5){

      document.body.style.background = "url('Frühling.jpg') ";
      document.body.style.color = "white";
      document.getElementById('mapid').style.opacity = "1";
      document.getElementById('mapid').style.boxSizing = "border-box";
      document.getElementById('mapid').style.borderRadius = "15px 15px 15px 15px";

    }
      else if(Math.round(data.main.temp *10)/10 >= 20){
        document.body.style.background = "url('Sommer.jpg') ";
        document.body.style.color = "white";
        document.getElementById('mapid').style.opacity = "1";
        document.getElementById('mapid').style.boxSizing = "border-box";
        document.getElementById('mapid').style.borderRadius = "15px 15px 15px 15px"
    }
      
  }

  async function map(){
 
    let data;
    
    if(navigator.geolocation == true){
      data = await showPosition();
    }
    else{
      data = await getAPI();
    }
  
  
//Map löschen
    mymap.off();
    mymap.remove(); 

//Map mit denn bestimmten Längen und Breitengrade wieder anzeigen

    mymap = L.map('mapid').setView([data.coord.lat, data.coord.lon], 12);
    const attribution = '&copy; <a href = https://www.openstreetmap.org/copyright">OpenStrettMap</a> contributors';
    const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileURL,{ attribution })
    tiles.addTo(mymap); 
    L.marker([data.coord.lat, data.coord.lon]).addTo(mymap).bindPopup("Hier sind es " +Math.round(data.main.temp *10)/10+ "°C").openPopup();
    mymap.on('click', mapClick);
    
}
  

//Funktion zum auslösen einer Funktion mit der Enter Taste
function checkTaste(e) {
  if (! e) {
    e = window.event
  }
  if (e.keyCode == 13) {
    getAPI();
    backgroundChange();
    map();
  }
}

//Click on Map and get The City and the Temp
 async function mapClick(e) {

  let coordinates = L.popup().setLatLng(e.latlng).getLatLng();
  
   
  let api_main = 'http://api.openweathermap.org/data/2.5/weather?';
  let api_key = '&APPID=55a6e7d291b29415e1bbe29d9bf3b7ae&units=metric';
  let api_input = "lat=" + coordinates.lat + "&lon=" + coordinates.lng
  let api = api_main + api_input +api_key;

  const response = await fetch(api)
  const data = await response.json();

  L.popup().setLatLng(e.latlng).setContent("In " + data.name + " sind es " + Math.round(data.main.temp *10)/10+ "°C ").openOn(mymap);

 }













