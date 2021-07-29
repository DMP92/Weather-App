/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

async function fetchWeatherFor(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f778724f49d8bcbf6a7c1111529b5d72`, { mode: 'cors' });
        return response;
    } catch (err) {
        return console.error(err);
    }
}

export default async function weatherDataFor(city) {
    try {
        const response = await fetchWeatherFor(city);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (err) {
        return console.error(err);
    }
}
