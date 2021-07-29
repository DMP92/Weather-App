/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import weatherDataFor from './grabData';
import convertUnitTo from './helperFunctions';

const weatherModule = (() => {
    function _weather(data) {
        const weatherType = data.weather;
        return console.log(weatherType[0].description);
    }

    function _tempFahrenheit(min, current, max) {
        const low = convertUnitTo.fahrenheit(min);
        const now = convertUnitTo.fahrenheit(current);
        const high = convertUnitTo.fahrenheit(max);
        console.log(low, now, high);
    }

    function _tempuratureControl(data, unit) {
        const tempLow = data.main.temp_min;
        const tempCurrent = data.main.feels_like;
        const tempHigh = data.main.temp_max;
        _tempFahrenheit(tempLow, tempCurrent, tempHigh);
    }

    function dataContain(data, unit) {
        console.log(data);
        _weather(data);
        _tempuratureControl(data, unit);
    }

    return {
        data: dataContain,
    };
})();

weatherDataFor('Grand Rapids')
    .then((data) => weatherModule.data(data));
