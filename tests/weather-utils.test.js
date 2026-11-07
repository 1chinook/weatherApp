const test = require("node:test");
const assert = require("node:assert/strict");
const {
    getWeatherPresentation,
    getRegionName,
    getCitySize
} = require("../weather-utils.js");

test("maps WMO weather codes to the available icons", function () {
    assert.equal(getWeatherPresentation(0).icon, "clear.png");
    assert.equal(getWeatherPresentation(3).icon, "clouds.png");
    assert.equal(getWeatherPresentation(45).icon, "mist.png");
    assert.equal(getWeatherPresentation(53).icon, "drizzle.png");
    assert.equal(getWeatherPresentation(65).icon, "rain.png");
    assert.equal(getWeatherPresentation(75).icon, "snow.png");
    assert.equal(getWeatherPresentation(999).icon, "clouds.png");
});

test("normalizes supported continents to background regions", function () {
    assert.equal(getRegionName("North America"), "America");
    assert.equal(getRegionName("South America"), "America");
    assert.equal(getRegionName("Europe"), "Europe");
    assert.equal(getRegionName("Oceania"), "");
});

test("selects city size using the existing regional thresholds", function () {
    assert.equal(getCitySize("Europe", 99999), "small");
    assert.equal(getCitySize("Europe", 100000), "mid");
    assert.equal(getCitySize("Asia", 299999), "small");
    assert.equal(getCitySize("Asia", 300000), "mid");
    assert.equal(getCitySize("America", 1500000), "big");
});
