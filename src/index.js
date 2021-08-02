/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import weatherDataFor from './grabData';
import convertUnitTo from './helperFunctions';
import dailyWeatherModule from './forecast';
import hourly from './hourly';

const input = document.querySelector('.city');
const button = document.querySelector('.submit');
const unitButton = document.querySelector('.unit');

async function fetchData() {
    const city = input.value;
    const results = await weatherDataFor(`${city}`);
    dailyWeatherModule.data(results);
    // eslint-disable-next-line no-use-before-define
    currentWeatherModule.data(results);
    hourly.dataObtain(results);
}

button.addEventListener('click', async () => {
    fetchData();
});

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

    function currentDateTime(data) {
        const currentTime = data.dt;
        const convertTime = convertUnitTo.unix(currentTime);
        console.log('-------CURRENT-------');
        console.log(`current time: ${convertTime}`);
        today.textContent = `current time: ${convertTime}`;
    }

    function _breezeType(windSpeed) {
        switch (true) {
        case windSpeed <= 2.5:
            console.log('Light breeze');
            break;
        case windSpeed > 2.5 && windSpeed <= 3.5:
            console.log('Gentle breeze.');
            break;
        case windSpeed > 3.5 && windSpeed <= 5:
            console.log('Moderate breeze');
            break;
        case windSpeed > 5 && windSpeed <= 6:
            console.log('Strong breeze');
            break;
        case windSpeed > 6 && windSpeed <= 7:
            console.log('Near gale');
            break;
        case windSpeed > 7 && windSpeed <= 8:
            console.log('Gale force winds.');
            break;
        case windSpeed > 8:
            console.log('Storm/hurricane force winds.');
        }
    }

    // data about today's expected wind speed an degree
    function _winds(current) {
        const degree = current.wind_deg;
        const speed = current.wind_speed;
        console.log(`current wind_degree: ${degree}°`);
        console.log(`current wind_speed: ${speed}`);
        _breezeType(speed);
    }

    // grabs data about today's projected humidity
    function _fetchHumidity(current) {
        const humidity = `current humidity: ${current.humidity} %`;
        console.log(humidity);
    }

    // grabs today's expected weather patterns
    function _fetchWeather(current) {
        const weatherTitle = current.weather[0].main;
        const weatherDescription = current.weather[0].description;

        console.log(`current weather: ${weatherTitle}`);
        console.log(`current weather: ${weatherDescription}`);
    }

    // gather's and converts today's expected temps in fahrenheit
    function prepareTempFahrenheit(current) {
        // converts temps
        const currentTemp = convertUnitTo.fahrenheit(current.temp);
        const feelsLike = convertUnitTo.fahrenheit(current.feels_like);
        // uses temps
        console.log(`current temp: ${currentTemp} °F`);
        console.log(`current feels like: ${feelsLike} °F`);
    }

    // gather's and converts today's expected temps in celcius
    function prepareTempCelcius(current) {
        // converts temps
        const currentTemp = convertUnitTo.celcius(current.temp);
        const feelsLike = convertUnitTo.celcius(current.feels_like);
        // uses temps
        console.log(`current temp: ${currentTemp} °C`);
        console.log(`current feels like: ${feelsLike} °C`);
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

    // sends data off to the different functions inside 'current' weather module
    function _parseData(current) {
        currentDateTime(current);
        _fetchHumidity(current);
        prepareTempController(current);
        _fetchWeather(current);
        _winds(current);
    }

    // grabs and parses data for future use
    function obtainData(data) {
        const currentData = data.current;
        console.log(currentData);
        _parseData(currentData);
    }

    return {
        data: obtainData,
    };
})();

// module that controls the forecasted weather data
// ************ 8-day Forecast Weather ************
