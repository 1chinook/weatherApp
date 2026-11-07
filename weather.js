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

const requestTimeoutMs = 8000;
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
        const location = await findCity(city);
        const currentWeather = await getCurrentWeather(location);
        renderWeather(location, currentWeather);
        updateBackground(city, location);
    } catch (error) {
        if (error.name === "AbortError") {
            showError("The request timed out. Please try again.");
            return;
        }

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

async function findCity(city) {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.search = new URLSearchParams({
        name: city,
        count: "1",
        language: "en",
        format: "json"
    });

    const data = await fetchJson(url);
    if (!data.results || !data.results.length) {
        throw new Error("Enter a valid city.");
    }

    return data.results[0];
}

async function getCurrentWeather(location) {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.search = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
        wind_speed_unit: "kmh",
        timezone: "auto"
    });

    const data = await fetchJson(url);
    if (!data.current) {
        throw new Error("Weather service returned incomplete data.");
    }

    return data.current;
}

async function fetchJson(url, timeoutMs = requestTimeoutMs) {
    const controller = new AbortController();
    const timeout = setTimeout(function () {
        controller.abort();
    }, timeoutMs);

    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            throw new Error("Weather service is unavailable. Try again later.");
        }
        return await response.json();
    } finally {
        clearTimeout(timeout);
    }
}

function renderWeather(location, current) {
    const presentation = WeatherUtils.getWeatherPresentation(current.weather_code);

    errorMessage.style.display = "none";
    icon.style.display = "block";
    details.style.display = "flex";
    document.querySelector(".city").textContent = location.name;
    document.querySelector(".temp").textContent = Math.round(current.temperature_2m) + "°C";
    document.getElementById("humiditylvl").textContent =
        Math.round(current.relative_humidity_2m) + "%";
    document.getElementById("windspeed").textContent =
        Math.round(current.wind_speed_10m) + " km/h";
    icon.src = "images/props/" + presentation.icon;
    icon.alt = presentation.description;
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

function updateBackground(city, location) {
    const imageKey = city.replace(/\s/g, "").toLowerCase();
    if (cityImages.has(imageKey)) {
        setBackground("images/cities/" + imageKey + ".png");
        return;
    }

    setRegionalBackground(location);
}

async function setRegionalBackground(location) {
    if (!location.country_code) {
        return;
    }

    try {
        const url = new URL(
            "https://restcountries.com/v3.1/alpha/" + encodeURIComponent(location.country_code)
        );
        url.searchParams.set("fields", "continents");
        const country = await fetchJson(url, 5000);
        const continent = country.continents && country.continents[0];
        const region = WeatherUtils.getRegionName(continent);

        if (!region) {
            return;
        }

        const size = WeatherUtils.getCitySize(region, location.population);
        setBackground("images/cities/" + size + region + ".png");
    } catch (error) {
        console.warn("Regional background could not be loaded.", error);
    }
}
