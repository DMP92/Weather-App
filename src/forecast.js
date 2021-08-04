/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */

import convertUnitTo from './helperFunctions';
import { forecastModule } from './printWeather';

const dailyWeatherModule = (() => {
    const forecastCollection = {};
    const forecastedTemp = [];
    const forecastedHumidity = [];
    const forecastedRain = [];
    const forecastedWeather = [];
    // eslint-disable-next-line no-unused-vars
    function _weather(day, i) {
        let j = 0;
        Object.entries(day).forEach(([key, value]) => {
            // id main description icon
            const weatherObject = [];
            weatherObject[j] = value;
            forecastedWeather[i] = weatherObject[j];
            forecastCollection.weather = forecastedWeather;
        });
        j += 1;
    }

    // accesses the conversion interface in 'helperFunctions.js'
    function fetchTempFahrenheit(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            Object.entries(day.temp).forEach(([key, value]) => {
                const temp = convertUnitTo.fahrenheit(value);
                forecastedTemp[i] = `${temp}° F`;
                forecastCollection.temp = forecastedTemp;
            });
            i++;
        });
    }

    // accesses the conversion interface in 'helperFunctions.js'
    function fetchTempCelcius(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            Object.entries(day.temp).forEach(([key, value]) => {
                const temp = convertUnitTo.celcius(value);
                forecastedTemp[i] = `${temp}° C`;
                forecastCollection.temp = forecastedTemp;
            });
            i++;
        });
    }

    // fetches textContent of the fahrenheit/celcius button. Depending on the user's setting
    // it converts the temp to that unit of measure
    function tempController(data) {
        const unit = document.querySelector('.unit');
        switch (true) {
        case unit.textContent === 'C':
            fetchTempCelcius(data);
            break;
        default:
            fetchTempFahrenheit(data);
        }
    }

    // humidity control
    function displayHumidity(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            const humidityLevel = day.humidity;
            forecastedHumidity[i] = `humidity: ${humidityLevel}%`;
            forecastCollection.humidity = forecastedHumidity;
            i += 1;
        });
    }

    // gives the chance and amount of rain
    function _chanceOfRain(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            if (day.rain !== undefined) {
                forecastedRain[i] = `Rain: ${day.pop * 100}% - ${day.rain}mm`;
            } else {
                forecastedRain[i] = `Rain: ${day.pop * 100}%`;
            }
            forecastCollection.rain = forecastedRain;
            i += 1;
        });
    }
    // breaks down forecasted weather and sends data off to their respective functions
    function _forecastParse(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            _weather(day.weather, i);
            i += 1;
        });
    }

    // eslint-disable-next-line no-unused-vars
    function _dataParse(data) {
        // 8 day forecasted data
        const forecast = data.daily;
        tempController(forecast);
        displayHumidity(forecast);
        _forecastParse(forecast);
        _chanceOfRain(forecast);
        forecastModule.print(forecastCollection);
    }

    function dataContain(data) {
        _dataParse(data);
    }

    return {
        data: dataContain,
    };
})();

export default dailyWeatherModule;
