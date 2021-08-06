/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { weatherDataFor, cityOrCountryName } from './grabData';
import convertUnitTo from './helperFunctions';
import dailyWeatherModule from './forecast';
import hourly from './hourly';
import { printModule, clearDOM } from './printWeather';
import iconHandler from './iconController';

const higherInput = document.querySelector('.city');
const lowerInput = document.querySelector('.lowerCity');
const button = document.querySelector('.submit');
const unitButton = document.querySelector('.unit');
const inputArray = [];

async function autoCity() {
    const stateName = await cityOrCountryName('Honolulu');
    const results = await weatherDataFor(stateName.location.name);
    dailyWeatherModule.data(results);
    currentWeatherModule.data(results);
    currentWeatherModule.name(stateName);
    currentWeatherModule.winds(stateName);
    hourly.dataObtain(results);
}

function inputLimiter(state) {
    inputArray.pop();
    inputArray.push(state);
}
// fetches data that is then passed into the 'currentWeatherModule' and all
// other modules
async function fetchData() {
    const city = inputArray[0];
    let results = '';
    let stateName = '';

    switch (true) {
    case city === true && higherInput.value !== '':
        stateName = await cityOrCountryName(higherInput.value);
        results = await weatherDataFor(stateName.location.name);
        dailyWeatherModule.data(results);
        // eslint-disable-next-line no-use-before-define
        currentWeatherModule.data(results);
        currentWeatherModule.name(stateName);
        currentWeatherModule.winds(stateName);
        hourly.dataObtain(results);
        break;
    case city === false && lowerInput.value !== '':
        stateName = await cityOrCountryName(lowerInput.value);
        results = await weatherDataFor(stateName.location.name);
        dailyWeatherModule.data(results);
        // eslint-disable-next-line no-use-before-define
        currentWeatherModule.data(results);
        currentWeatherModule.name(stateName);
        currentWeatherModule.winds(stateName);
        hourly.dataObtain(results);
        break;
    case city === false && lowerInput.value === '':
        stateName = await cityOrCountryName(higherInput.value);
        results = await weatherDataFor(stateName.location.name);
        dailyWeatherModule.data(results);
        // eslint-disable-next-line no-use-before-define
        currentWeatherModule.data(results);
        currentWeatherModule.name(stateName);
        currentWeatherModule.winds(stateName);
        hourly.dataObtain(results);
        break;
    case city === true && higherInput.value === '':
        stateName = await cityOrCountryName(lowerInput.value);
        results = await weatherDataFor(stateName.location.name);
        dailyWeatherModule.data(results);
        // eslint-disable-next-line no-use-before-define
        currentWeatherModule.data(results);
        currentWeatherModule.name(stateName);
        currentWeatherModule.winds(stateName);
        hourly.dataObtain(results);
        break;
    }
}

// upon pressing the submit button, or pressing enter the function grabs required data
button.addEventListener('click', async () => {
    if (higherInput.value === '' && lowerInput.value === '') {
        alert('Enter the name of a city');
    } else {
        clearDOM();
        fetchData();
    }
});

higherInput.addEventListener('input', () => {
    inputLimiter(true);
});

lowerInput.addEventListener('input', () => {
    inputLimiter(false);
});

// acts as another search button to refresh contents of DOM according to unit selected
window.addEventListener('load', async () => {
    unitButton.textContent = 'F';
    lowerInput.value = '';
    higherInput.value = '';
    autoCity();
});

window.addEventListener('keydown', (e) => {
    switch (true) {
    case e.keyCode === 13:
        if (higherInput.value === '' && lowerInput.value === '') {
            alert('Enter the name of a city');
        } else {
            clearDOM();
            fetchData();
        }
    }
});
// gathers temp unit
unitButton.addEventListener('click', async (e) => {
    clearDOM();
    fetchData();

    switch (true) {
    case unitButton.textContent === 'C':
        e.target.textContent = 'F';
        break;
    default:
        e.target.textContent = 'C';
        break;
    }
});

// module that grabs, parses and uses weather data for today
// ********** Current Weather *********
const currentWeatherModule = (() => {
    // current time and date
    const today = document.querySelector('.today');

    const wToday = {};

    function printStateOrCountry(regionData) {
        const cityStateContainer = document.querySelector('.cityState');

        switch (true) {
        case regionData.location.country === 'United States of America':
            cityStateContainer.textContent = `${regionData.location.name}, ${regionData.location.region}`;
            break;
        case regionData.location.country !== 'United States of America':
            cityStateContainer.textContent = `${regionData.location.name}, ${regionData.location.country}`;
            break;
        }
    }

    function shareToday() {
        const page = 'current';
        printModule.print(wToday, page);
    }

    function currentDateTime(data, tz) {
        const currentTime = data.dt;
        const convertTime = convertUnitTo.unix(currentTime, tz);
        wToday.time = `${convertTime}`;
    }

    function sunriseSunset(object) {
        const rawSunrise = convertUnitTo.unix(object.sunrise);
        const rawSunset = convertUnitTo.unix(object.sunset);
        const sunrise = rawSunrise.slice(17, 26);
        const sunset = rawSunset.slice(17, 26);
        wToday.sunrise = sunrise;
        wToday.sunset = sunset;
    }

    function _breezeType(windSpeed) {
        let breezeMessage = '';
        switch (true) {
        case windSpeed <= 2.5:
            breezeMessage = 'Light breeze.';
            break;
        case windSpeed > 2.5 && windSpeed <= 3.5:
            breezeMessage = 'Gentle breeze.';
            break;
        case windSpeed > 3.5 && windSpeed <= 5:
            breezeMessage = 'Moderate breeze.';
            break;
        case windSpeed > 5 && windSpeed <= 6:
            breezeMessage = 'Strong breeze.';
            break;
        case windSpeed > 6 && windSpeed <= 7:
            breezeMessage = 'Near gale.';
            break;
        case windSpeed > 7 && windSpeed <= 8:
            breezeMessage = 'Gale force winds.';
            break;
        case windSpeed > 8:
            breezeMessage = 'Storm/hurricane force winds.';
        }
        wToday.breeze = breezeMessage;
    }

    // data about today's expected wind speed an degree
    function winds(weather) {
        const windDegree = weather.current.wind_dir;
        const windSpeed = weather.current.wind_mph;
        const degree = `Wind: ${windDegree}`;
        const speed = `${windSpeed}mph`;
        printModule.printWind(degree, speed);
    }

    // grabs data about today's projected humidity
    function _fetchHumidity(current) {
        const humidity = `Humidity: ${current.humidity} %`;
        wToday.humidity = humidity;
    }

    // grabs today's expected weather patterns
    function _fetchWeather(current) {
        const weatherTitle = current.weather[0].main;
        const weatherDescription = current.weather[0].description;

        wToday.weatherTitle = `${weatherTitle}. `;
        wToday.weatherDesc = `current weather: ${weatherDescription}`;
    }

    // gather's and converts today's expected temps in fahrenheit
    function prepareTempFahrenheit(current) {
        // converts temps
        const currentTemp = convertUnitTo.fahrenheit(current.temp);
        const feelsLike = convertUnitTo.fahrenheit(current.feels_like);
        // uses temps

        wToday.current = `${currentTemp}° F`;
        wToday.feelsLike = `Feels like ${feelsLike}° F. `;
    }

    // gather's and converts today's expected temps in celcius
    function prepareTempCelcius(current) {
        // converts temps
        const currentTemp = convertUnitTo.celcius(current.temp);
        const feelsLike = convertUnitTo.celcius(current.feels_like);
        // uses temps

        wToday.current = `${currentTemp}° C`;
        wToday.feelsLike = `Feels like ${feelsLike}° C. `;
    }

    // converts the temp based on users selection of either fahrenheit or celcius
    function prepareTempController(current) {
        // eslint-disable-next-line no-shadow
        const unitButton = document.querySelector('.unit');

        switch (true) {
        case unitButton.textContent === 'C':
            prepareTempCelcius(current);
            break;
        default:
            prepareTempFahrenheit(current);
            break;
        }
    }

    function weatherIcon(data) {
        const icons = data.weather[0].icon;
        const type = 'current';
        wToday.icon = icons;
    }
    // sends data off to the different functions inside 'current' weather module
    async function _parseData(current, tz) {
        currentDateTime(current, tz);
        weatherIcon(current);
        _fetchHumidity(current);
        prepareTempController(current);
        _fetchWeather(current);
        sunriseSunset(current);
        _breezeType(current.windSpeed);
        shareToday(wToday);
    }

    // grabs and parses data for future use
    function obtainData(data, timezone) {
        const currentData = data.current;
        const tz = data.timezone;
        _parseData(currentData, tz);
    }

    return {
        data: obtainData,
        current: shareToday,
        winds,
        name: printStateOrCountry,
    };
})();
