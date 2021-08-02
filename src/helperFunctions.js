/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
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
    // returns converted weekly temps - fahrenheit
    // eslint-disable-next-line consistent-return

    function unixToDateTime(unix) {
        const unixStamp = unix;
        const date = new Date(unixStamp * 1000);
        const hours = date.getHours();
        const minutes = `0${date.getMinutes()}`;
        const formattedTime = `${hours}:${minutes.substr(-2)}`;
        return formattedTime;
    }

    return {
        fahrenheit,
        celcius,
        unix: unixToDateTime,
    };
})();

export default convertUnitTo;
