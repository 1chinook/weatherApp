(function (root, factory) {
    const utils = factory();

    if (typeof module === "object" && module.exports) {
        module.exports = utils;
    }

    root.WeatherUtils = utils;
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    function getWeatherPresentation(code) {
        const numericCode = Number(code);

        if (numericCode === 0) {
            return { icon: "clear.png", description: "Clear sky" };
        }
        if ([1, 2, 3].includes(numericCode)) {
            return { icon: "clouds.png", description: "Cloudy" };
        }
        if ([45, 48].includes(numericCode)) {
            return { icon: "mist.png", description: "Foggy" };
        }
        if ([51, 53, 55, 56, 57].includes(numericCode)) {
            return { icon: "drizzle.png", description: "Drizzle" };
        }
        if ([71, 73, 75, 77, 85, 86].includes(numericCode)) {
            return { icon: "snow.png", description: "Snowy" };
        }
        if ([61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 97, 99].includes(numericCode)) {
            return { icon: "rain.png", description: "Rainy" };
        }

        return { icon: "clouds.png", description: "Weather conditions" };
    }

    function getRegionName(continent) {
        const value = String(continent || "");
        if (value.includes("America")) return "America";
        if (value.includes("Asia")) return "Asia";
        if (value.includes("Africa")) return "Africa";
        if (value.includes("Europe")) return "Europe";
        return "";
    }

    function getCitySize(region, population) {
        const numericPopulation = Number(population) || 0;
        const smallLimit = region === "Asia" ? 300000 : 100000;

        if (numericPopulation < smallLimit) return "small";
        if (numericPopulation < 1500000) return "mid";
        return "big";
    }

    return { getWeatherPresentation, getRegionName, getCitySize };
}));
