/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
const hourlyModule = (() => {
    const hourlyDiv = document.querySelector('.hourly');

    function printPic(object) {
        const picture = object;
        const image = document.querySelectorAll('.hourPic');
        const imageData = Array.from(image);
        let i = 0;
        picture.forEach((pic) => {
            const weatherPic = document.createElement('img');
            weatherPic.src = `/src/Images/${pic.icon}@2x.png`;
            weatherPic.style.cssText = 'width: 50px; height: 50px';
            imageData[i].appendChild(weatherPic);
            i += 1;
        });
    }

    function printTemps(object) {
        const temps = object;
        const tempContainer = document.querySelectorAll('.hourTemp');
        const tempData = Array.from(tempContainer);
        let i = 0;
        temps.forEach((temp) => {
            tempData[i].textContent = temp;
            i += 1;
        });
    }

    function printRain(object) {
        const rainContainers = document.querySelectorAll('.hourRain');
        const rainPic = document.querySelectorAll('.rainPic');

        const rainPics = Array.from(rainPic);
        const rain = Array.from(rainContainers);
        let i = 0;
        rain.forEach((hour) => {
            if (object[i] !== '0%') {
                const rainImg = document.createElement('img');
                rainImg.src = '/src/Images/09d@2x.png';
                rainImg.style.cssText = 'width: 50px; height: 50px';
                rainPics[i].appendChild(rainImg);
                rain[i].textContent = object[i];
            }
            i += 1;
        });
    }

    function printDay(object) {
        const days = document.querySelectorAll('.hourDay');
        const dayArray = Array.from(days);

        let i = 0;

        dayArray.forEach((day) => {
            dayArray[i].textContent = object[i];
            i += 1;
        });
    }
    function printTime(object) {
        const hourContainer = document.querySelectorAll('.hourTime');
        const hourArray = Array.from(hourContainer);
        let i = 0;
        hourArray.forEach((leHour) => {
            // eslint-disable-next-line no-param-reassign
            leHour.textContent = object[i];
            i += 1;
        });
    }

    function hourCreate(object) {
        object.forEach(() => {
            // creates each hour container
            const hourDiv = document.createElement('div');
            hourDiv.classList.add('hour');
            hourlyDiv.appendChild(hourDiv);

            const hourTemp = document.createElement('div');
            hourTemp.classList.add('hourTemp');

            const hourPic = document.createElement('div');
            hourPic.classList.add('hourPic');

            const rainPic = document.createElement('div');
            rainPic.classList.add('rainPic');

            const hoursRain = document.createElement('div');
            hoursRain.classList.add('hourRain');

            const hourDay = document.createElement('div');
            hourDay.classList.add('hourDay');

            const hourTime = document.createElement('div');
            hourTime.classList.add('hourTime');

            hourDiv.appendChild(hourPic);
            hourDiv.appendChild(hourTemp);
            hourDiv.appendChild(rainPic);
            hourDiv.appendChild(hoursRain);
            hourDiv.appendChild(hourDay);
            hourDiv.appendChild(hourTime);
            const divArray = [hourTemp, hourPic, hoursRain];
            return divArray;
        });
    }

    // receives the hourly object from hourly.js
    function printHours(object) {
        hourCreate(object.temp);
        printPic(object.weather);
        printTemps(object.temp);
        printRain(object.rain);
        printTime(object.time);
        printDay(object.day);
    }

    function deleteHours() {
        const hourDiv = document.querySelector('.hourly');

        while (hourDiv.firstChild) {
            hourDiv.removeChild(hourDiv.firstChild);
        }
    }
    return {
        print: printHours,
        delete: deleteHours,
    };
})();

const forecastModule = (() => {
    function dayDates(object) {
        const dateContainer = document.querySelectorAll('.dayDate');
        const days = Array.from(dateContainer);
        let i = 0;
        days.forEach(() => {
            days[i].textContent = object.date[i];
            i += 1;
        });
    }

    function dayTemps(object) {
        const tempContainers = document.querySelectorAll('.dayTemp');
        const temps = Array.from(tempContainers);
        let i = 0;

        temps.forEach(() => {
            temps[i].textContent = object[i];
            i += 1;
        });
    }

    function dayWeathers(object) {
        const weatherContainer = document.querySelectorAll('.dayWeather');
        const daysWeather = Array.from(weatherContainer);
        let i = 0;

        daysWeather.forEach(() => {
            const img = document.createElement('img');
            img.src = `/src/Images/${object[i].icon}@2x.png`;
            img.style.cssText = 'width: 50px; height: 50px';
            daysWeather[i].appendChild(img);
            i += 1;
        });
    }

    function dayRainIcons(object) {
        const rainContainer = document.querySelectorAll('.dayRain');
        const dayRainImgContainers = document.querySelectorAll('.dayRainIcon');
        const rainData = Array.from(rainContainer);
        const dayRainImgs = Array.from(dayRainImgContainers);
        let i = 0;
        rainData.forEach(() => {
            const img = document.createElement('img');
            img.src = '/src/Images/09d@2x.png';
            img.style.cssText = 'width: 50px; height: 50px;';
            dayRainImgs[i].appendChild(img);
            rainData[i].textContent = object[i];
            i += 1;
        });
    }

    function dayGridCreate() {
        const dayContainers = document.querySelectorAll('.day');
        const days = Array.from(dayContainers);
        let i = 0;

        days.forEach((day) => {
            const dayDate = document.createElement('div');
            dayDate.classList.add('dayDate');

            const dayTemp = document.createElement('div');
            dayTemp.classList.add('dayTemp');

            const dayWeather = document.createElement('div');
            dayWeather.classList.add('dayWeather');

            const dayRainIcon = document.createElement('div');
            dayRainIcon.classList.add('dayRainIcon');

            const dayRain = document.createElement('div');
            dayRain.classList.add('dayRain');

            days[i].appendChild(dayDate);
            days[i].appendChild(dayWeather);
            days[i].appendChild(dayTemp);
            days[i].appendChild(dayRainIcon);
            days[i].appendChild(dayRain);

            i += 1;
        });
    }

    function dayCreate(object) {
        object.forEach(() => {
            const dayContainer = document.querySelector('.forecast');
            const day = document.createElement('div');
            day.classList.add('day');
            dayContainer.appendChild(day);
        });
    }

    function printForecast(object) {
        dayCreate(object.humidity);
        dayGridCreate();
        dayDates(object);
        dayWeathers(object.weather);
        dayRainIcons(object.rain);
        let i = 0;

        object.temp.forEach((obj) => {
            dayTemps(object.temp);
            i += 1;
        });
    }

    function deleteForecast() {
        const forecastDiv = document.querySelector('.forecast');

        while (forecastDiv.firstChild) {
            forecastDiv.removeChild(forecastDiv.firstChild);
        }
    }

    return {
        print: printForecast,
        delete: deleteForecast,
    };
})();

// Module that gathers all data for the day's weather and prints it to the DOM
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

    function deleteData() {
        const todayDiv = document.querySelector('.today');
        switch (true) {
        case todayDiv.firstChild:
            while (todayDiv.firstChild) {
                todayDiv.removeChild(todayDiv.firstChild);
            }
            break;
        }
    }

    return {
        print: printObjects,
        check: checkForImage,
        delete: deleteData,
    };
})();

function clearDOM() {
    printModule.delete();
    hourlyModule.delete();
    forecastModule.delete();
}

export {
    printModule, forecastModule, hourlyModule, clearDOM,
};
