/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */

import convertUnitTo from './helperFunctions';

const dailyWeatherModule = (() => {
    // eslint-disable-next-line no-unused-vars
    function _weather(day) {
        day.forEach((weather) => {
            console.log('------forecasted weather------');
            Object.entries(weather).forEach(([key, value]) => {
                console.log(key, value);
            });
        });
    }

    // accesses the conversion interface in 'helperFunctions.js'
    function fetchTempFahrenheit(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            i++;
            if (i === 1) {
                console.log('------ Today ------');
            } else {
                console.log(`------Day ${i} ------`);
            }
            Object.entries(day.temp).forEach(([key, value]) => {
                const temp = convertUnitTo.fahrenheit(value);
                console.log(`forecasted day${i}: ${key} ${temp} °F`);
            });
            if (i === 8) {
                console.log('-------------------');
                console.log('-------------------');
            }
        });
    }

    // accesses the conversion interface in 'helperFunctions.js'
    function fetchTempCelcius(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            i++;
            console.log(`------Day ${i} ------`);
            Object.entries(day.temp).forEach(([key, value]) => {
                const temp = convertUnitTo.celcius(value);
                console.log(`forecasted day${i}: ${key} ${temp} °C`);
            });
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
        console.log('--Forecasted Humidity--');
        forecast.forEach((day) => {
            const humidityLevel = day.humidity;
            console.log(`forecasted day: ${humidityLevel}`);
        });
    }

    // gives the chance and amount of rain
    function _chanceOfRain(forecast) {
        forecast.forEach((day) => {
            console.log(`Chance of Rain ${day.pop}`);
            if (day.rain !== undefined) {
                console.log(`${day.rain}mm`);
            }
        });
    }
    // breaks down forecasted weather and sends data off to their respective functions
    function _forecastParse(forecast) {
        forecast.forEach((day) => {
            _weather(day.weather);
        });
    }

    // eslint-disable-next-line no-unused-vars
    function _dataParse(data) {
        // 8 day forecasted data
        const forecast = data.daily;
        console.log(forecast);
        tempController(forecast);
        displayHumidity(forecast);
        _forecastParse(forecast);
        _chanceOfRain(forecast);
    }

    function dataContain(data) {
        _dataParse(data);
    }

    return {
        data: dataContain,
    };
})();

export default dailyWeatherModule;
