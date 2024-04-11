// The following line of code defines a constant variable called currentDetails which stores the URL of the OpenWeatherMap API with specific latitude, longitude, and API key.
const currentDetails="https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid={API key}";

// The following lines of code define and assign values to variables using document.querySelector or document.getElementById to retrieve elements from the HTML file based on their IDs. These variables represent various elements on the webpage.
const currTime = document.querySelector('#time');
const ampm  = document.getElementById('#ampm');
const searchBar=document.querySelector('#searchbar');
const humid = document.getElementById('humidity');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const pressure = document.getElementById('pressure');
const speed = document.getElementById('speed');
const temperature = document.getElementById('temperature');
const feelsLike=document.getElementById('feels-like');
const loc=document.querySelector('#location span');
const icon=document.getElementById('icon');
const weather=document.getElementById('weather');
const dtInfo = document.getElementById('dtInfo');
const stat = document.getElementById('stat');
const darkBtn = document.querySelector(".dark-btn");
const body = document.getElementById("main-body");
const forcast = document.getElementById("table");
const aqi=document.getElementById("aqi");
const quality=document.getElementById("quality");

// The following block of code adds an event listener to the "darkBtn" element which is a checkbox. When the checkbox is checked, it removes the "light" class from the body element and adds the "dark" class. It also adds the "dark-theme" class to the "loc" element. When the checkbox is unchecked, it performs the opposite actions.
darkBtn.addEventListener("click" , ()=>{
   if(darkBtn.checked){
      body.classList.remove("light");
      body.classList.add("dark");
      loc.classList.add("dark-theme");
   }
   else{
      body.classList.remove("dark");
      body.classList.add("light");
      loc.classList.remove("dark-theme");
   }
})

// The following lines of code define variables "limit" and "APIkey" with their corresponding values.
var limit=5;
var APIkey='bf8d15a80c89aa4f4c82ad6cbb3f5ac5';

// The following block of code uses the geolocation API to get the user's current position (latitude and longitude), and then calls the "updateDetails" function with these coordinates as arguments.
navigator.geolocation.getCurrentPosition((position)=>{
    var lat=position.coords.latitude;
    var lon=position.coords.longitude;
    updateDetails(lat,lon);
});

// The following function asynchronously fetches the coordinates (latitude and longitude) for a given city name by making an HTTP GET request to the OpenWeatherMap API. It returns a promise that resolves to an object containing the latitude and longitude.
async function getCoords(cityName){
  const limit=5;  
  const pos = {latitude:0, longitude:0};
  const api_url=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIkey}`
  await fetch(api_url).then(res=>res.json()).then(data=>{
   pos.latitude=data[0].lat;
   pos.longitude=data[0].lon;
   return pos;
    });
return pos;
}

// The following block of code adds an event listener to the document object, listening for the 'keyup' event. If the key pressed is the 'Enter' key, it fetches the coordinates for the city name entered in the input_text element and then calls the "updateDetails" function with these coordinates as arguments.
document.addEventListener('keyup',(event)=>{
   if(event.key === 'Enter' ){
      var coords=getCoords(input_text.value);
      getCoords(input_text.value).then((data)=>{
        lat=data.latitude;
        lon=data.longitude;
        updateDetails(lat,lon);
    });
   }
});

// The following block of code adds an event listener to the element with the ID 'button-addon2'. When this button is clicked, it fetches the coordinates for the city name entered in the input_text element and then calls the "updateDetails" function with these coordinates as arguments.
document.getElementById('button-addon2').addEventListener('click',()=>{
    var coords=getCoords(input_text.value);
    getCoords(input_text.value).then((data)=>{
        lat=data.latitude;
        lon=data.longitude;
        updateDetails(lat,lon);
    });
});

// The following asynchronous function updates the weather details on the webpage based on the given latitude and longitude coordinates. It makes API requests to fetch the weather information and updates the corresponding HTML elements with the fetched data.
async function updateDetails(lat,lon){
   const weatherAPI=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`;
   const geoAPI=`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${APIkey}`;
   const aqiAPI = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIkey}`;
   await fetch(geoAPI).then(res=>res.json()).then(data =>{
      console.log(data[0].name,data[0].country);  
      loc.innerHTML=`${data[0].name}, ${data[0].country}`;
   });
   await fetch(weatherAPI).then(res=>res.json()).then(data=>{
      try
      {
         alert(data.alerts[0].description);
      }
      catch(err){
         console.log("NO WEATHER ALERTS IN THIS AREA");
      }
      icon.src=`http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
      dt.innerText=new Date(new Date(1000*data.current.dt + data.timezone_offset*1000).getTime()).toUTCString().slice(0,22);
      stat.innerText=data.current.weather[0].main;
      humid.innerText=data.current.humidity+" %";
      temperature.innerText=Number(data.current.temp - 273.15).toFixed(0)+" \u00B0"+"c";
      feelsLike.innerText=Number(data.current.feels_like - 273.15).toFixed(1);
      pressure.innerText=data.current.pressure + " mbar";
      speed.innerText=data.current.wind_speed + " km/h";
      sunset.innerText=new Date(new Date(1000*data.current.sunset + data.timezone_offset*1000).getTime()).toUTCString().slice(16,22);
      sunrise.innerText=new Date(new Date(1000*data.current.sunrise + data.timezone_offset*1000).getTime()).toUTCString().slice(16,22);
      for (let index = 0; index < 7; index++) {
         let head=document.getElementById(`${index}`).getElementsByTagName("h2")[0];
         let weatherIcon=document.getElementById(`${index}`).getElementsByTagName("img")[0];
         let max=document.getElementById(`${index}`).getElementsByTagName("td")[0];
         let min=document.getElementById(`${index}`).getElementsByTagName("td")[1];
         weatherIcon.src=`http://openweathermap.org/img/wn/${data.daily[`${index}`].weather[0].icon}@2x.png`;
         head.innerHTML=new Date(new Date(1000*data.daily[index].dt + data.timezone_offset*1000).getTime()).toUTCString().slice(0,11);
         max.innerHTML=(data.daily[index].temp.max -273.15).toFixed(1);
         min.innerHTML=(data.daily[index].temp.min -273.15).toFixed(1);
      }
   });
   await fetch(aqiAPI).then(res=>res.json()).then(data=>{
      try{
         aqi.innerText=data.list[0].main.aqi;
         switch(data.list[0].main.aqi){
            case 1:
               quality.innerText = "Good";
               break;
            case 2:
               quality.innerText = "Fair";
               break;
            case 3:
               quality.innerText = "Moderate";
               break;
            case 4:
               quality.innerText = "Poor";
               break;
            case 5:
               quality.innerText = "Very Poor";
               break;
         }
      }
      catch(err){
         console.log(err);
      }
   });
}

