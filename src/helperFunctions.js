/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import './printToScreen';
import { toDate, format } from 'date-fns';
import { utcToZonedTime, getTimezoneOffset } from 'date-fns-tz';
import fromUnixTime from 'date-fns/fromUnixTime';

const convertUnitTo = (() => {
    function addStr(str, index, stringToAdd) {
        return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
    }

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

    function formatTime(string) {
        const time = string.toString();
        const newTime = time.substr(0, 25);
        const comma = ', ';
        const news = addStr(newTime, 10, comma);
        return news;
    }

    // converts target city's .dt and timezone into current time
    function unixToDateTime(unix, tz) {
        const targetTime = fromUnixTime(unix);
        const properTime = utcToZonedTime(targetTime, tz);
        const time = formatTime(properTime);
        return time;
    }

    function timeZoneOffset(date) {

    }

    return {
        fahrenheit,
        celcius,
        unix: unixToDateTime,
    };
})();

export default convertUnitTo;
