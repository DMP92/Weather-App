/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/forecast.js":
/*!*************************!*\
  !*** ./src/forecast.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helperFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helperFunctions */ "./src/helperFunctions.js");
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */



const dailyWeatherModule = (() => {
    // eslint-disable-next-line no-unused-vars
    function _weather(day) {
        day.forEach((weather) => {
            console.log('------forecasted weather------');
            Object.entries(weather).forEach(([key, value]) => {
                console.log(key, value);
            });
        });
    }

    // accesses the conversion interface in 'helperFunctions.js'
    function fetchTempFahrenheit(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            i++;
            if (i === 1) {
                console.log('------ Today ------');
            } else {
                console.log(`------Day ${i} ------`);
            }
            Object.entries(day.temp).forEach(([key, value]) => {
                const temp = _helperFunctions__WEBPACK_IMPORTED_MODULE_0__.default.fahrenheit(value);
                console.log(`forecasted day${i}: ${key} ${temp} °F`);
            });
            if (i === 8) {
                console.log('-------------------');
                console.log('-------------------');
            }
        });
    }

    // accesses the conversion interface in 'helperFunctions.js'
    function fetchTempCelcius(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            i++;
            console.log(`------Day ${i} ------`);
            Object.entries(day.temp).forEach(([key, value]) => {
                const temp = _helperFunctions__WEBPACK_IMPORTED_MODULE_0__.default.celcius(value);
                console.log(`forecasted day${i}: ${key} ${temp} °C`);
            });
        });
    }

    // fetches textContent of the fahrenheit/celcius button. Depending on the user's setting
    // it converts the temp to that unit of measure
    function tempController(data) {
        const unit = document.querySelector('.unit');
        switch (true) {
        case unit.textContent === 'C':
            fetchTempCelcius(data);
            break;
        default:
            fetchTempFahrenheit(data);
        }
    }

    // humidity control
    function displayHumidity(forecast) {
        console.log('--Forecasted Humidity--');
        forecast.forEach((day) => {
            const humidityLevel = day.humidity;
            console.log(`forecasted day: ${humidityLevel}`);
        });
    }

    // gives the chance and amount of rain
    function _chanceOfRain(forecast) {
        forecast.forEach((day) => {
            console.log(`Chance of Rain ${day.pop}`);
            if (day.rain !== undefined) {
                console.log(`${day.rain}mm`);
            }
        });
    }
    // breaks down forecasted weather and sends data off to their respective functions
    function _forecastParse(forecast) {
        forecast.forEach((day) => {
            _weather(day.weather);
        });
    }

    // eslint-disable-next-line no-unused-vars
    function _dataParse(data) {
        // 8 day forecasted data
        const forecast = data.daily;
        console.log(forecast);
        tempController(forecast);
        displayHumidity(forecast);
        _forecastParse(forecast);
        _chanceOfRain(forecast);
    }

    function dataContain(data) {
        _dataParse(data);
    }

    return {
        data: dataContain,
    };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (dailyWeatherModule);


/***/ }),

/***/ "./src/grabData.js":
/*!*************************!*\
  !*** ./src/grabData.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ weatherDataFor)
/* harmony export */ });
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


/***/ }),

/***/ "./src/helperFunctions.js":
/*!********************************!*\
  !*** ./src/helperFunctions.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _printToScreen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./printToScreen */ "./src/printToScreen.js");
/* harmony import */ var _printToScreen__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_printToScreen__WEBPACK_IMPORTED_MODULE_0__);
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */


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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (convertUnitTo);


/***/ }),

/***/ "./src/hourly.js":
/*!***********************!*\
  !*** ./src/hourly.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helperFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helperFunctions */ "./src/helperFunctions.js");
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */


const hourly = (() => {
    // gather's and converts today's expected temps in fahrenheit
    function prepareTempFahrenheit(hours) {
        // converts temps
        const hourlyTemp = _helperFunctions__WEBPACK_IMPORTED_MODULE_0__.default.fahrenheit(hours.temp);
        // uses temps
        console.log(`hourly temp: ${hourlyTemp} °F`);
    }

    function timeOfHour(hours) {
        console.log(_helperFunctions__WEBPACK_IMPORTED_MODULE_0__.default.unix(hours.dt));
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
        const hourlyTemp = _helperFunctions__WEBPACK_IMPORTED_MODULE_0__.default.celcius(hours.temp);
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hourly);


/***/ }),

/***/ "./src/printToScreen.js":
/*!******************************!*\
  !*** ./src/printToScreen.js ***!
  \******************************/
/***/ (() => {



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _grabData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grabData */ "./src/grabData.js");
/* harmony import */ var _helperFunctions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helperFunctions */ "./src/helperFunctions.js");
/* harmony import */ var _forecast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./forecast */ "./src/forecast.js");
/* harmony import */ var _hourly__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hourly */ "./src/hourly.js");
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */





const input = document.querySelector('.city');
const button = document.querySelector('.submit');
const unitButton = document.querySelector('.unit');

async function fetchData() {
    const city = input.value;
    const results = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.default)(`${city}`);
    _forecast__WEBPACK_IMPORTED_MODULE_2__.default.data(results);
    // eslint-disable-next-line no-use-before-define
    currentWeatherModule.data(results);
    _hourly__WEBPACK_IMPORTED_MODULE_3__.default.dataObtain(results);
}

button.addEventListener('click', async () => {
    fetchData();
});

window.addEventListener('load', () => {
    unitButton.textContent = 'F';
});

// gathers temp unit
unitButton.addEventListener('click', async (e) => {
    fetchData();

    switch (true) {
    case unitButton.textContent === 'C':
        e.target.textContent = 'F';
        break;
    default:
        e.target.textContent = 'C';
        break;
    }
});

// module that grabs, parses and uses weather data for today
// ********** Current Weather *********
const currentWeatherModule = (() => {
    // current time and date
    const today = document.querySelector('.today');

    function currentDateTime(data) {
        const currentTime = data.dt;
        const convertTime = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.unix(currentTime);
        console.log('-------CURRENT-------');
        console.log(`current time: ${convertTime}`);
        today.textContent = `current time: ${convertTime}`;
    }

    function _breezeType(windSpeed) {
        switch (true) {
        case windSpeed <= 2.5:
            console.log('Light breeze');
            break;
        case windSpeed > 2.5 && windSpeed <= 3.5:
            console.log('Gentle breeze.');
            break;
        case windSpeed > 3.5 && windSpeed <= 5:
            console.log('Moderate breeze');
            break;
        case windSpeed > 5 && windSpeed <= 6:
            console.log('Strong breeze');
            break;
        case windSpeed > 6 && windSpeed <= 7:
            console.log('Near gale');
            break;
        case windSpeed > 7 && windSpeed <= 8:
            console.log('Gale force winds.');
            break;
        case windSpeed > 8:
            console.log('Storm/hurricane force winds.');
        }
    }

    // data about today's expected wind speed an degree
    function _winds(current) {
        const degree = current.wind_deg;
        const speed = current.wind_speed;
        console.log(`current wind_degree: ${degree}°`);
        console.log(`current wind_speed: ${speed}`);
        _breezeType(speed);
    }

    // grabs data about today's projected humidity
    function _fetchHumidity(current) {
        const humidity = `current humidity: ${current.humidity} %`;
        console.log(humidity);
    }

    // grabs today's expected weather patterns
    function _fetchWeather(current) {
        const weatherTitle = current.weather[0].main;
        const weatherDescription = current.weather[0].description;

        console.log(`current weather: ${weatherTitle}`);
        console.log(`current weather: ${weatherDescription}`);
    }

    // gather's and converts today's expected temps in fahrenheit
    function prepareTempFahrenheit(current) {
        // converts temps
        const currentTemp = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.fahrenheit(current.temp);
        const feelsLike = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.fahrenheit(current.feels_like);
        // uses temps
        console.log(`current temp: ${currentTemp} °F`);
        console.log(`current feels like: ${feelsLike} °F`);
    }

    // gather's and converts today's expected temps in celcius
    function prepareTempCelcius(current) {
        // converts temps
        const currentTemp = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.celcius(current.temp);
        const feelsLike = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.celcius(current.feels_like);
        // uses temps
        console.log(`current temp: ${currentTemp} °C`);
        console.log(`current feels like: ${feelsLike} °C`);
    }

    // converts the temp based on users selection of either fahrenheit or celcius
    function prepareTempController(current) {
        // eslint-disable-next-line no-shadow
        const unitButton = document.querySelector('.unit');

        switch (true) {
        case unitButton.textContent === 'C':
            prepareTempCelcius(current);
            break;
        default:
            prepareTempFahrenheit(current);
            break;
        }
    }

    // sends data off to the different functions inside 'current' weather module
    function _parseData(current) {
        currentDateTime(current);
        _fetchHumidity(current);
        prepareTempController(current);
        _fetchWeather(current);
        _winds(current);
    }

    // grabs and parses data for future use
    function obtainData(data) {
        const currentData = data.current;
        console.log(currentData);
        _parseData(currentData);
    }

    return {
        data: obtainData,
    };
})();

// module that controls the forecasted weather data
// ************ 8-day Forecast Weather ************

})();

/******/ })()
;
//# sourceMappingURL=main.js.map