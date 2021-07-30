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
    function prepareTemp(keys, values, unit) {
        let convertedTemp = fahrenheit(values);
        let result = '';
        switch (true) {
        case typeof values === 'object' && keys === 'feels_like':
            Object.entries(values).forEach(([key, value]) => {
                convertedTemp = fahrenheit(value);
                result = `${unit} ${keys}: ${convertedTemp}`;
                console.log(result);
                return result;
            });
            break;
        case typeof values === 'object' && keys === 'temp':
            Object.entries(values).forEach(([key, value]) => {
                convertedTemp = fahrenheit(value);
                result = `${unit} ${keys}: ${convertedTemp}`;
                console.log(result);
                return result;
            });
            break;
        case typeof values !== 'object' && keys === 'temp':
            convertedTemp = fahrenheit(values);
            result = `${unit} ${keys}: ${convertedTemp}`;
            console.log(convertedTemp);
            break;
        case typeof values !== 'object' && keys === 'feels_like':
            convertedTemp = fahrenheit(values);
            result = `${unit} ${keys}: ${convertedTemp}`;
            console.log(result);
            break;
        }
        return result;
    }

    function parseTempuratures(forecast, unit) {
        forecast.forEach((x) => {
            Object.entries(x).forEach(([key, value]) => {
                // const convertedTemp = convertUnitTo.fahrenheit(value);
                // console.log(`hourly: ${key}: ${convertedTemp}`);
                prepareTemp(key, value, unit);
            });
        });
    }

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
        parse: parseTempuratures,
        prepare: prepareTemp,
    };
})();

export default convertUnitTo;
