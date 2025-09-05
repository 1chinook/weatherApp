require('dotenv').config();

let glass = document.getElementById("glass");
let search = document.getElementById("search");
let searchContainer = document.getElementById("search-container");
let searchZone = document.getElementById("search-zone");
let weather = document.getElementById("weather");
let information = document.getElementById("information");
let isOpen = false;
let icon = document.querySelector(".weather-icon");
let cities = ["athens","beijing","budapest","buenos aires","cairo","delhi","dubai", "istanbul", "london", "mexicocity", "miami", "newyork", "paris", 
     "prague", "rio", "rome", "seoul", "sydney", "tokyo", "toronto" , "vienna"]

const API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=istanbul"
const API_KEY = process.env.API_KEY;


searchZone.addEventListener("click", () => {
    if(!isOpen){
        glass.style.height = 800 + "px";
        isOpen = true;
        search.addEventListener("click", () =>{
            let value = searchZone.value.replace(/\s/g, "").toLowerCase()
            if(value && cities.includes(value)){
                isOpen = false;
                glass.style.height = 400 + "px";
                searchContainer.style.background = "url(images/cities/"+value+".png)";
                searchZone.style.display = "none";
                search.style.display = "none";
                searchContainer.style.backgroundSize = "cover";
                searchZone.value = "";
                weather.style.display = "flex";
                information.style.display = "flex"
                information.style.marginTop = 25 + "px"
                callWeather(value);
                document.addEventListener("keypress", e =>{
                    let button = e.code;
                    if(button === "Enter" && !isOpen){
                        searchZone.style.display = "block";
                        search.style.display = "flex";
                        glass.style.height = 200 + "px";
                        weather.style.display = "none";
                        information.style.marginTop = 65 + "px"
                    }})}})}});


async function callWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${API_KEY}`);
    const data = await response.json();

    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = Math.round(data.main.temp)+ "°C" ;
    document.querySelector("#humiditylvl").textContent = data.main.humidity + "%";
    document.querySelector("#windspeed").textContent = Math.round(data.wind.speed) + " km/h";
    console.log(data)
    
    if(data.weather[0].main === "Clouds"){
        icon.src = "images/props/clouds.png"
    }
    else if(data.weather[0].main === "Clear"){
        icon.src = "images/props/clear.png"
    }
    else if(data.weather[0].main === "Mist"){
        icon.src = "images/props/mist.png"
    }
    else if(data.weather[0].main === "Rain"){
        icon.src = "images/props/snow.png"
    }
    else if(data.weather[0].main === "Snow"){
        icon.src = "images/props/rain.png"
    }
}
callWeather("istanbul")