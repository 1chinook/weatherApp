
let glass = document.getElementById("glass");
let search = document.getElementById("search");
let searchContainer = document.getElementById("search-container");
let searchZone = document.getElementById("search-zone");
let weather = document.getElementById("weather");
let information = document.getElementById("information");
let isOpen = false;
let icon = document.querySelector(".weather-icon");
let cities = ["athens","beijing","budapest","buenosaires","cairo","delhi","dubai", "istanbul", "london", "mexicocity", "miami", "newyork", "paris", 
     "prague", "rio", "rome", "seoul", "sydney", "tokyo", "toronto" , "vienna", "vilnius","barcelona"]


searchZone.addEventListener("click", () => {
    if(!isOpen){
        glass.style.height = "800px";
        isOpen = true;
            }})

search.addEventListener("click", () =>{
    let value = searchZone.value.replace(/\s/g, "").toLowerCase()
    let city = searchZone.value.toLowerCase()
    isOpen = false;
    glass.style.height = "400px";
    searchZone.style.display = "none";
    search.style.display = "none";
    searchZone.value = "";
    weather.style.display = "flex";
    information.style.display = "flex"
    information.style.marginTop = "25px"
    callWeather(city)
    if(cities.includes(value)){
        searchContainer.style.background = "url(images/cities/"+value+".png)";
        searchContainer.style.backgroundSize = "cover"}
    else{
        callCity(value)}})        

document.addEventListener("keydown", e =>{
    let button = e.code;
    if(button === "Enter" && !isOpen){
    searchZone.style.display = "block";
    search.style.display = "flex";
    glass.style.height = "200px";
    weather.style.display = "none";
    information.style.marginTop = "65px"}})

const weather_API = "4314b06c84c18639fe0ba8163a802158"
const weather_URL = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q="

async function callWeather(city) {

    const response = await fetch(weather_URL + encodeURIComponent(city) + `&appid=${weather_API}`)
    const data = await response.json();

    let error = document.getElementById("error")
    let img = document.getElementById("image")
    let details = document.getElementById("details")
    if(response.status === 404){
        error.style.display = "block";
        img.style.display = "none"
        details.style.display = "none"
        return;}



    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = Math.round(data.main.temp)+ "°C" ;
    document.querySelector("#humiditylvl").textContent = data.main.humidity + "%";
    document.querySelector("#windspeed").textContent = Math.round(data.wind.speed) + " km/h";
    
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
        icon.src = "images/props/rain.png"
    }
    else if(data.weather[0].main === "Snow"){
        icon.src = "images/props/snow.png"}}

async function callCity(city) {

    const geoUrl = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(city)}&maxRows=1&username=1chin0ok`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    const cityInfo = geoData.geonames[0];
    const countryCode = cityInfo.countryCode;
    const restUrl = `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,continents,population`;
    const restRes = await fetch(restUrl);
    const restData = await restRes.json();
    let continent = restData.continents[0]
    let population = geoData.geonames[0].population;
    
    if(!cities.includes(city)){
    if (continent.includes("America")){
        if (population < 100000) {
            searchContainer.style.background = "url(images/cities/smallAmerica.png)";
            searchContainer.style.backgroundSize = "cover";
        } else if (population >= 100000 && population < 1500000) {
            searchContainer.style.background = "url(images/cities/midAmerica.png)";
            searchContainer.style.backgroundSize = "cover";
        } else if (population >= 1500000) {
            searchContainer.style.background = "url(images/cities/bigAmerica.png)";
            searchContainer.style.backgroundSize = "cover";}}

    else if (continent.includes("Asia")){
        if (population < 300000) {
            searchContainer.style.background = "url(images/cities/smallAsia.png)";
            searchContainer.style.backgroundSize = "cover";
        } else if (population >= 300000 && population < 1500000) {
            searchContainer.style.background = "url(images/cities/midAsia.png)";
            searchContainer.style.backgroundSize = "cover";
        } else if (population >= 1500000) {
            searchContainer.style.background = "url(images/cities/bigAsia.png)";
            searchContainer.style.backgroundSize = "cover";}}
        
    else if (continent.includes("Africa")){
        if (population < 100000) {
            searchContainer.style.background = "url(images/cities/smallAfrica.png)";
            searchContainer.style.backgroundSize = "cover";
        } else if (population >= 100000 && population < 1500000) {
            searchContainer.style.background = "url(images/cities/midAfrica.png)";
            searchContainer.style.backgroundSize = "cover";
        } else if (population >= 1500000) {
            searchContainer.style.background = "url(images/cities/bigAfrica.png)";
            searchContainer.style.backgroundSize = "cover";
        }}

    else if (continent.includes("Europe")){
        if (population < 100000) {
            searchContainer.style.background = "url(images/cities/smallEurope.png)";
            searchContainer.style.backgroundSize = "cover";
        } else if (population >= 100000 && population < 1500000) {
            searchContainer.style.background = "url(images/cities/midEurope.png)";
            searchContainer.style.backgroundSize = "cover";
        } else if (population >= 1500000) {
            searchContainer.style.background = "url(images/cities/bigEurope.png)";
            searchContainer.style.backgroundSize = "cover";}}}}


