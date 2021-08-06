/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

// Module that fetches data from Open Weather API

// function C
// fetches initial data from 'Open Weather' API
async function fetchInitialWeatherDataForMy(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f778724f49d8bcbf6a7c1111529b5d72`, { mode: 'cors' });
        const data = await response.json();
        return data;
    } catch (err) {
        return console.error(err);
    }
}

// function B
// uses the function above to grab the rest of the data required for the 'One Call' API
async function fetchTheRestOfMyWeatherData(city) {
    try {
        // calls function that fetches weather data and grabs lat / lon / dt from the user's city
        const initialData = await fetchInitialWeatherDataForMy(city);

        // takes lat / lon / dt from initialData variable above, and processes it for API below
        const lat = initialData.coord.lat.toFixed(2);
        const lon = initialData.coord.lon.toFixed(2);
        // final API call that is then processed and used by the app
        const response = await fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=f778724f49d8bcbf6a7c1111529b5d72`, { mode: 'cors' });
        return response;
    } catch (err) {
        return console.error(err);
    }
}

async function cityOrCountryName(city) {
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=8b74a6e5cbf14690bc2100254210608&q=${city}`);
        const data = await response.json();
        return data;
    } catch (err) {
        return console.error(err);
    }
}
// function A
// calls the 'fetchWeatherFor()' function with the city
async function weatherDataFor(city) {
    try {
        const response = await fetchTheRestOfMyWeatherData(city);
        const data = await response.json();
        return data;
    } catch (err) {
        return console.error(err);
    }
}

export { cityOrCountryName, weatherDataFor };
