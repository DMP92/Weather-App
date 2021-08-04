/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
const hourlyModule = (() => {
    const hourlyDiv = document.querySelector('.hourly');

    function printTemps(object) {
        const temps = object;
        temps.forEach((temp) => {
            const tempContain = document.createElement('div');
        });
    }

    function hourCreate(object) {
        object.forEach(() => {
            // creates each hour container
            const hourDiv = document.createElement('div');
            hourDiv.classList.add('hour');
            hourlyDiv.appendChild(hourDiv);

            const hourTemp = document.createElement('div');
            hourTemp.classList.add('.hourTemp');

            const hourPic = document.createElement('div');
            hourPic.classList.add('.hourPic');

            const hoursRain = document.createElement('div');
            hoursRain.classList.add('.hourRain');

            const hourHumidity = document.createElement('div');
            hourHumidity.classList.add('hourHumidity');

            hourDiv.appendChild(hourPic);
            hourDiv.appendChild(hourTemp);
            hourDiv.appendChild(hoursRain);
            hourDiv.appendChild(hourHumidity);
        });
        console.log(hourlyDiv.childNodes);
    }

    // receives the hourly object from hourly.js
    function printHours(object) {
        console.log(object);
        hourCreate(object.temp);
        printTemps(object.temp);
    }

    return {
        print: printHours,
    };
})();

const forecastModule = (() => {
    function printForecast(object) {
        console.log(object);
    }

    return {
        print: printForecast,
    };
})();
// Module that gathers each object to be printed to the DOM
const printModule = (() => {
    const weatherPic = document.querySelector('.weatherPic');
    const today = document.querySelector('.today').children;

    function printDate(object) {
        today[0].textContent = object.time;
    }

    function printState(object) {

    }

    function printWeatherPic(images, status) {
        if (status === 'present') {
            weatherPic.removeChild(weatherPic.firstChild);
        }
        const image = document.createElement('img');
        image.classList.add('image');
        image.src = `/src/Images/${images.icon}@2x.png`;
        weatherPic.appendChild(image);
        // image.src = ;
        // image.style.cssText = 'width: 80px; height: 80px';
        // console.log(picture);
        // console.log(today[2].children);
        // today[2].appendChild(image);
        // console.log(today[2].children);
        // console.log(picture);
    }

    function checkForImage(obj) {
        if (weatherPic.children[0] === undefined) {
            printWeatherPic(obj, 'absent');
        } else {
            printWeatherPic(obj, 'present');
        }
    }

    function printTemp(object) {
        today[3].textContent = `${object.current}`;
    }

    function printSummary(object) {
        today[4].textContent = `${object.feelsLike} ${object.weatherTitle} ${object.breeze}`;
    }

    function printWind(object) {
        today[5].textContent = `${object.windDegree} ${object.windSpeed}`;
    }

    function printHumidity(object) {
        today[6].textContent = object.humidity;
    }

    function printToday(object, img) {
        printDate(object);
        printTemp(object);
        checkForImage(object);
        printSummary(object);
        printWind(object);
        printHumidity(object);
    }

    function printObjects(object, page, img) {
        switch (true) {
        case page === 'current':
            printToday(object, img);
            break;
        case page === 'hourly':
            hourlyModule.print(object);
            break;
        case page === 'forecast':
            forecastModule.print(object);
            break;
        }
    }

    return {
        print: printObjects,
        check: checkForImage,
    };
})();

export { printModule, forecastModule, hourlyModule };
