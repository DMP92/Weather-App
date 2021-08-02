/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import convertUnitTo from './helperFunctions';

const hourly = (() => {
    // gather's and converts today's expected temps in fahrenheit
    function prepareTempFahrenheit(hours) {
        // converts temps
        const hourlyTemp = convertUnitTo.fahrenheit(hours.temp);
        // uses temps
        console.log(`hourly temp: ${hourlyTemp} °F`);
    }

    function timeOfHour(hours) {
        console.log(convertUnitTo.unix(hours.dt));
    }

    // gives the hourly chance of rain
    function hoursRainChance(hours) {
        if (hours.pop !== 0) {
            console.log(hours.pop);
        }
    }

    // gather's and converts today's expected temps in celcius
    function prepareTempCelcius(hours) {
        // converts temps
        const hourlyTemp = convertUnitTo.celcius(hours.temp);
        // uses temps
        console.log(`hourly temp: ${hourlyTemp} °C`);
    }

    // converts the temp based on users selection of either fahrenheit or celcius
    function prepareTempController(hours) {
        // eslint-disable-next-line no-shadow
        const unitButton = document.querySelector('.unit');

        switch (true) {
        case unitButton.textContent === 'C':
            prepareTempCelcius(hours);
            break;
        default:
            prepareTempFahrenheit(hours);
            break;
        }
    }

    // prints hourly weather descriptions
    function hourlyWeather(hours) {
        console.log(hours.description);
        console.log(hours.main);
        console.log(hours.id);
        console.log(hours.icon);
    }
    // function that gets each hour's weather
    function parseHourlyWeather(hours) {
        hours.forEach((hour) => {
            Object.entries(hour.weather).forEach(([key, value]) => {
                hourlyWeather(value);
            });
        });
    }

    // ships data to different functions
    function parseData(hours) {
        parseHourlyWeather(hours);

        hours.forEach((hour) => {
            prepareTempController(hour);
            hoursRainChance(hour);
            timeOfHour(hour);
        });
    }
    // obtains and parses out weather data
    function dataObtain(data) {
        const hours = data.hourly;
        parseData(hours);
    }

    return {
        dataObtain,
    };
})();

export default hourly;
