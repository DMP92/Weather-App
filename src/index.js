/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import weatherDataFor from './grabData';
import convertUnitTo from './helperFunctions';
import dailyWeatherModule from './forecast';
import hourly from './hourly';
import { printModule } from './printWeather';
import iconHandler from './iconController';

const input = document.querySelector('.city');
const button = document.querySelector('.submit');
const unitButton = document.querySelector('.unit');

// fetches data that is then passed into the 'currentWeatherModule' and all
// other modules
async function fetchData() {
    const city = input.value;
    const results = await weatherDataFor(`${city}`);
    dailyWeatherModule.data(results);
    // eslint-disable-next-line no-use-before-define
    currentWeatherModule.data(results);
    hourly.dataObtain(results);
}

// upon pressing the submit button, or pressing enter the function grabs required data
button.addEventListener('click', async () => {
    fetchData();
});

// acts as another search button to refresh contents of DOM according to unit selected
window.addEventListener('load', () => {
    unitButton.textContent = 'F';
});

// gathers temp unit
unitButton.addEventListener('click', async (e) => {
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

    function shareToday() {
        const page = 'current';
        printModule.print(wToday, page);
    }

    function currentDateTime(data, tz) {
        const currentTime = data.dt;
        const convertTime = convertUnitTo.unix(currentTime, tz);
        wToday.time = `${convertTime}`;
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
    function _winds(current) {
        const degree = current.wind_deg;
        const speed = current.wind_speed;
        _breezeType(speed);
        wToday.windDegree = `Wind: ${degree}°`;
        wToday.windSpeed = `${speed}mph`;
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
    function _parseData(current, tz) {
        currentDateTime(current, tz);
        weatherIcon(current);
        _fetchHumidity(current);
        prepareTempController(current);
        _fetchWeather(current);
        _winds(current);
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
    };
})();
