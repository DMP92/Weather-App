/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import weatherDataFor from './grabData';
import convertUnitTo from './helperFunctions';

// Module that will eventually print the data to the screen

const weatherModule = (() => {
    // eslint-disable-next-line no-unused-vars
    const weatherObject = {};

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

    // eslint-disable-next-line no-unused-vars
    function _dataParse(data, unit) {
        const currentWeather = data.current;
        const forecast = data.daily;
        const hourlyForecast = data.hourly;
        console.log('current', currentWeather);
        console.log('forecast', forecast);
        console.log('hourly', hourlyForecast);
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

button.addEventListener('click', async () => {
    const city = input.value;
    const results = await weatherDataFor(`${city}`);
    weatherModule.data(results);
});
