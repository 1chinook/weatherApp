const glass = document.getElementById("glass");
const searchForm = document.getElementById("search-form");
const searchContainer = document.getElementById("search-container");
const searchZone = document.getElementById("search-zone");
const weather = document.getElementById("weather");
const information = document.getElementById("information");
const icon = document.getElementById("image");
const errorMessage = document.getElementById("error");
const details = document.getElementById("details");

const cityImages = new Set([
    "athens", "beijing", "budapest", "buenosaires", "cairo", "delhi",
    "dubai", "istanbul", "london", "mexicocity", "miami", "newyork",
    "paris", "prague", "rio", "rome", "seoul", "sydney", "tokyo",
    "toronto", "vienna", "vilnius", "barcelona"
]);

const weatherApiKey = "4314b06c84c18639fe0ba8163a802158";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
let showingResult = false;

searchZone.addEventListener("focus", expandSearch);
searchZone.addEventListener("click", expandSearch);
searchForm.addEventListener("submit", handleSearch);

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && showingResult) {
        event.preventDefault();
        resetSearch();
    }
});

function expandSearch() {
    if (!showingResult) {
        glass.style.height = "100%";
    }
}

async function handleSearch(event) {
    event.preventDefault();

    const city = searchZone.value.trim();
    if (!city) {
        searchZone.focus();
        return;
    }

    setLoadingState();

    try {
        const data = await callWeather(city);
        renderWeather(data);

        const imageKey = city.replace(/\s/g, "").toLowerCase();
        if (cityImages.has(imageKey)) {
            setBackground("images/cities/" + imageKey + ".png");
        } else {
            await setRegionalBackground(city);
        }
    } catch (error) {
        showError(error.message || "Weather information could not be loaded.");
    }
}

function setLoadingState() {
    showingResult = true;
    searchForm.style.display = "none";
    weather.style.display = "flex";
    glass.style.height = "100%";
    information.style.marginTop = "25px";
    information.textContent = "Press Enter for a new search";
    errorMessage.style.display = "none";
    icon.style.display = "none";
    details.style.display = "none";
    document.querySelector(".temp").textContent = "";
    document.querySelector(".city").textContent = "Loading...";
}

function resetSearch() {
    showingResult = false;
    searchForm.style.display = "flex";
    weather.style.display = "none";
    glass.style.height = "200px";
    information.style.marginTop = "65px";
    searchZone.value = "";
    searchZone.focus();
}

async function callWeather(city) {
    let response;

    try {
        response = await fetch(
            weatherUrl + encodeURIComponent(city) + "&appid=" + weatherApiKey
        );
    } catch (error) {
        throw new Error("Network error. Check your connection and try again.");
    }

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Enter a valid city.");
        }
        if (response.status === 401) {
            throw new Error("Weather service authentication failed.");
        }
        throw new Error("Weather service is unavailable. Try again later.");
    }

    const data = await response.json();
    if (!data.main || !data.wind || !data.weather || !data.weather.length) {
        throw new Error("Weather service returned incomplete data.");
    }

    return data;
}

function renderWeather(data) {
    errorMessage.style.display = "none";
    icon.style.display = "block";
    details.style.display = "flex";

    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
    document.getElementById("humiditylvl").textContent = data.main.humidity + "%";
    document.getElementById("windspeed").textContent =
        Math.round(data.wind.speed * 3.6) + " km/h";

    const condition = data.weather[0].main;
    const icons = {
        Clear: "clear.png",
        Clouds: "clouds.png",
        Drizzle: "drizzle.png",
        Rain: "rain.png",
        Snow: "snow.png",
        Mist: "mist.png",
        Fog: "mist.png",
        Haze: "mist.png",
        Smoke: "mist.png"
    };

    icon.src = "images/props/" + (icons[condition] || "clouds.png");
    icon.alt = condition + " weather";
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    document.querySelector(".city").textContent = "";
    document.querySelector(".temp").textContent = "";
    icon.style.display = "none";
    details.style.display = "none";
}

function setBackground(path) {
    searchContainer.style.backgroundImage = 'url("' + path + '")';
    searchContainer.style.backgroundPosition = "center";
    searchContainer.style.backgroundSize = "cover";
}

async function setRegionalBackground(city) {
    try {
        const geoUrl =
            "https://secure.geonames.org/searchJSON?q=" +
            encodeURIComponent(city) +
            "&maxRows=1&username=1chin0ok";
        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
            return;
        }

        const geoData = await geoResponse.json();
        if (!geoData.geonames || !geoData.geonames.length) {
            return;
        }

        const cityInfo = geoData.geonames[0];
        const continent = await getContinent(cityInfo.countryCode);
        const region = getRegionName(continent);
        if (!region) {
            return;
        }

        const size = getCitySize(region, Number(cityInfo.population) || 0);
        setBackground("images/cities/" + size + region + ".png");
    } catch (error) {
        console.warn("Regional background could not be loaded.", error);
    }
}

async function getContinent(countryCode) {
    const response = await fetch(
        "https://restcountries.com/v3.1/alpha/" +
        encodeURIComponent(countryCode) +
        "?fields=continents"
    );

    if (!response.ok) {
        throw new Error("Country information could not be loaded.");
    }

    const data = await response.json();
    return data.continents && data.continents[0] ? data.continents[0] : "";
}

function getRegionName(continent) {
    if (continent.includes("America")) return "America";
    if (continent.includes("Asia")) return "Asia";
    if (continent.includes("Africa")) return "Africa";
    if (continent.includes("Europe")) return "Europe";
    return "";
}

function getCitySize(region, population) {
    const smallLimit = region === "Asia" ? 300000 : 100000;
    if (population < smallLimit) return "small";
    if (population < 1500000) return "mid";
    return "big";
}
