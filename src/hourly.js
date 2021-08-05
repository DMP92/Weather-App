/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { utcToZonedTime } from 'date-fns-tz';
import convertUnitTo from './helperFunctions';
import { hourlyModule } from './printWeather';

const hourly = (() => {
    // object that will be used to print data to the screen
    const hour = {};
    const hourTempF = [];
    const hourTempC = [];
    const hourRain = [];
    const hourDay = [];
    const hourTime = [];
    const hourWeather = [];
    const hourHumidity = [];

    // gather's and converts today's expected temps in fahrenheit
    function prepareTempFahrenheit(hours, i) {
        // converts temps
        const hourlyTemp = convertUnitTo.fahrenheit(hours.temp);
        // uses temps
        hourTempF[i] = `${hourlyTemp}° F`;
        hour.temp = hourTempF;
    }

    function timeOfHour(hours, i) {
        const time = convertUnitTo.unix(hours.dt);
        // splits the unix string up into usable chunks for this application
        const day = time.slice(0, 11);
        // eslint-disable-next-line no-shadow
        const timeOfHour = time.slice(18, 23);
        // uses the manipulated strings
        hourDay[i] = day;
        hourTime[i] = timeOfHour;
        // gives the array to the object to be printed
        hour.day = hourDay;
        hour.time = hourTime;
    }

    // gives the hourly chance of rain
    function hoursRainChance(hours, i) {
        const rainChance = Math.round(hours.pop * 100);
        hourRain[i] = `${rainChance}%`;
        hour.rain = hourRain;
    }

    function hourlyHumidity(hours, i) {
        const humidityLevel = `${hours.humidity}% Humidity`;
        hourHumidity[i] = humidityLevel;
        hour.humidity = hourHumidity;
    }
    // gather's and converts today's expected temps in celcius
    function prepareTempCelcius(hours, i) {
        // converts temps
        const hourlyTemp = convertUnitTo.celcius(hours.temp);
        // uses temps
        hourTempC[i] = `${hourlyTemp}° C`;
        hour.temp = hourTempC;
    }

    // converts the temp based on users selection of either fahrenheit or celcius
    function prepareTempController(hours, i) {
        // eslint-disable-next-line no-shadow
        const unitButton = document.querySelector('.unit');

        switch (true) {
        case unitButton.textContent === 'C':
            prepareTempCelcius(hours, i);
            break;
        default:
            prepareTempFahrenheit(hours, i);
            break;
        }
    }

    // prints hourly weather descriptions
    function hourlyWeather(hours, i) {
        const hoursWeatherInfo = {};
        hoursWeatherInfo.description = `${hours.description}`;
        hoursWeatherInfo.main = `${hours.main}`;
        hoursWeatherInfo.id = `${hours.id}`;
        hoursWeatherInfo.icon = `${hours.icon}`;

        hourWeather[i] = hoursWeatherInfo;
        hour.weather = hourWeather;
    }
    // function that gets each hour's weather
    function parseHourlyWeather(hours) {
        let i = 0;
        hours.forEach((hr) => {
            Object.entries(hr.weather).forEach(([key, value]) => {
                hourlyWeather(value, i);
            });
            i += 1;
        });
    }

    // ships data to different functions
    function parseData(hours) {
        parseHourlyWeather(hours);

        // these had to be handled separately
        let i = 0;

        // for each hour, a different function is called that prints each item to screen
        hours.forEach((hr) => {
            prepareTempController(hr, i);
            hoursRainChance(hr, i);
            timeOfHour(hr, i);
            hourlyHumidity(hr, i);
            i += 1;
        });

        // prints each hour's container to screen
        hourlyModule.print(hour);
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
