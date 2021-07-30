/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import weatherDataFor from './grabData';
import convertUnitTo from './helperFunctions';

// module that grabs, parses and uses weather data for today
const currentWeatherModule = (() => {
    // current time and date
    function currentDateTime(data) {
        const currentTime = data.dt;
        const convertTime = convertUnitTo.unix(currentTime);
        console.log('-------CURRENT-------');
        console.log(`current time: ${convertTime}`);
    }

    // grabs today's sunrise and sunset times
    function _sunriseSunset(current) {
        const rise = current.sunrise;
        const set = current.sunset;

        const sunrise = convertUnitTo.unix(rise);
        const sunset = convertUnitTo.unix(set);

        console.log(`current sunrise: ${sunrise}`);
        console.log(`current sunset: ${sunset}`);
    }

    // data about today's expected wind speed an degree
    function _winds(current) {
        const degree = current.wind_deg;
        const speed = current.wind_speed;
        console.log(`current wind_degree: ${degree}°`);
        console.log(`current wind_speed: ${speed}`);
    }

    // grabs data about today's projected humidity
    function _fetchHumidity(current) {
        const humidity = `current humidity: ${current.humidity}%`;
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
        console.log(`current temp: ${currentTemp}°F`);
        console.log(`current feels like: ${feelsLike}°F`);
    }

    // gather's and converts today's expected temps in celcius
    function prepareTempCelcius(current) {
        // converts temps
        const currentTemp = convertUnitTo.celcius(current.temp);
        const feelsLike = convertUnitTo.celcius(current.feels_like);
        // uses temps
        console.log(`current temp: ${currentTemp}°C`);
        console.log(`current feels like: ${feelsLike}°C`);
    }

    // converts the temp based on users selection of either fahrenheit or celcius
    function prepareTempController(current) {
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
        _sunriseSunset(current);
    }

    // grabs and parses data for future us
    function obtainData(data) {
        const currentData = data.current;
        _parseData(currentData);
    }

    return {
        data: obtainData,
    };
})();

// module that controls the forecasted weather data
const dailyWeatherModule = (() => {
    // eslint-disable-next-line no-unused-vars

    function _weather(data) {
        console.log(data);
        const forecastDays = data.hourly.map((day) => day.weather);
        // eslint-disable-next-line consistent-return
        forecastDays.forEach((day) => {
            for (let i = 0; i < day.length; i++) {
                // stick data from each day onto DOM elements here
                return day[i];
            }
        });
    }

    function _tempFahrenheit(min, current, max) {
        const low = convertUnitTo.fahrenheit(min);
        const now = convertUnitTo.fahrenheit(current);
        const high = convertUnitTo.fahrenheit(max);
        console.log(low, now, high);
    }

    // eslint-disable-next-line no-unused-vars
    function _tempuratureControl(data, unit) {
        console.log(data);
        const tempLow = data.main.temp_min;
        const tempCurrent = data.main.feels_like;
        const tempHigh = data.main.temp_max;
        _tempFahrenheit(tempLow, tempCurrent, tempHigh);
    }

    function gatherTempurature(forecast) {
    }

    // eslint-disable-next-line no-unused-vars
    function _dataParse(data, unit) {
        // 8 day forecasted data
        const forecast = data.daily;
        // hourly data
        const hourlyForecast = data.hourly;
        // sends each data set onwards
        gatherTempurature(forecast);
    }

    function dataContain(data, unit) {
        _dataParse(data, unit);
    }

    return {
        data: dataContain,
    };
})();

const input = document.querySelector('.city');
const button = document.querySelector('.submit');
const unitButton = document.querySelector('.unit');

async function fetchData() {
    const city = input.value;
    const results = await weatherDataFor(`${city}`);
    dailyWeatherModule.data(results);
    currentWeatherModule.data(results);
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

// Object.entries(temps).forEach(([key, value]) => {
//     let convertedTemp = convertUnitTo.fahrenheit(value);
//     switch (true) {
//     case typeof value !== 'object' && key === 'temp':
//         convertedTemp = convertUnitTo.fahrenheit(value);
//         console.log(`hourly: ${key}: ${convertedTemp}`);
//         break;

//     case typeof value === 'object' && key === 'temp':
//         Object.entries(value).forEach(([key, value]) => {
//             convertedTemp = convertUnitTo.fahrenheit(value);
//             console.log(`daily(temp): ${key}: ${convertedTemp}`);
//         });
//         break;

//     case typeof value === 'object' && key === 'feels_like':
//         Object.entries(value).forEach(([key, value]) => {
//             convertedTemp = convertUnitTo.fahrenheit(value);
//             console.log(`daily(feels_like): ${key}: ${convertedTemp}`);
//         });
//         break;
//     default:
//         break;
//     }
