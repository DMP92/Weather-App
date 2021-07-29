/* eslint-disable no-console */
import './printToScreen';

const convertUnitTo = (() => {
    function fahrenheit(data) {
        const kelvinToFahrenheit = (data - 273.15) * (9 / 5) + 32;
        return Math.round(kelvinToFahrenheit);
    }

    function celcius(data) {
        const kelvinToCelcius = data - 273.15;
        return Math.round(kelvinToCelcius);
    }

    return {
        fahrenheit,
        celcius,
    };
})();

export default convertUnitTo;
