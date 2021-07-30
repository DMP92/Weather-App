/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (convertUnitTo);


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
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */



// module that grabs, parses and uses weather data for today
const currentWeatherModule = (() => {
    // current time and date
    function currentDateTime(data) {
        const currentTime = data.dt;
        const convertTime = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.unix(currentTime);
        console.log('-------CURRENT-------');
        console.log(`current time: ${convertTime}`);
    }

    // grabs today's sunrise and sunset times
    function _sunriseSunset(current) {
        const rise = current.sunrise;
        const set = current.sunset;

        const sunrise = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.unix(rise);
        const sunset = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.unix(set);

        console.log(`current sunrise: ${sunrise}`);
        console.log(`current sunset: ${sunset}`);
    }

    // data about today's expected wind speed an degree
    function _winds(current) {
        const degree = current.wind_deg;
        const speed = current.wind_speed;
        console.log(`current wind_degree: ${degree}°`);
        console.log(`current wind_speed: ${speed}`);
    }

    // grabs data about today's projected humidity
    function _fetchHumidity(current) {
        const humidity = `current humidity: ${current.humidity}%`;
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
        console.log(`current temp: ${currentTemp}°F`);
        console.log(`current feels like: ${feelsLike}°F`);
    }

    // gather's and converts today's expected temps in celcius
    function prepareTempCelcius(current) {
        // converts temps
        const currentTemp = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.celcius(current.temp);
        const feelsLike = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.celcius(current.feels_like);
        // uses temps
        console.log(`current temp: ${currentTemp}°C`);
        console.log(`current feels like: ${feelsLike}°C`);
    }

    // converts the temp based on users selection of either fahrenheit or celcius
    function prepareTempController(current) {
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
        _sunriseSunset(current);
    }

    // grabs and parses data for future us
    function obtainData(data) {
        const currentData = data.current;
        _parseData(currentData);
    }

    return {
        data: obtainData,
    };
})();

// module that controls the forecasted weather data
const dailyWeatherModule = (() => {
    // eslint-disable-next-line no-unused-vars

    function _weather(data) {
        console.log(data);
        const forecastDays = data.hourly.map((day) => day.weather);
        // eslint-disable-next-line consistent-return
        forecastDays.forEach((day) => {
            for (let i = 0; i < day.length; i++) {
                // stick data from each day onto DOM elements here
                return day[i];
            }
        });
    }

    function _tempFahrenheit(min, current, max) {
        const low = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.fahrenheit(min);
        const now = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.fahrenheit(current);
        const high = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.fahrenheit(max);
        console.log(low, now, high);
    }

    // eslint-disable-next-line no-unused-vars
    function _tempuratureControl(data, unit) {
        console.log(data);
        const tempLow = data.main.temp_min;
        const tempCurrent = data.main.feels_like;
        const tempHigh = data.main.temp_max;
        _tempFahrenheit(tempLow, tempCurrent, tempHigh);
    }

    function gatherTempurature(forecast) {
    }

    // eslint-disable-next-line no-unused-vars
    function _dataParse(data, unit) {
        // 8 day forecasted data
        const forecast = data.daily;
        // hourly data
        const hourlyForecast = data.hourly;
        // sends each data set onwards
        gatherTempurature(forecast);
    }

    function dataContain(data, unit) {
        _dataParse(data, unit);
    }

    return {
        data: dataContain,
    };
})();

const input = document.querySelector('.city');
const button = document.querySelector('.submit');
const unitButton = document.querySelector('.unit');

async function fetchData() {
    const city = input.value;
    const results = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.default)(`${city}`);
    dailyWeatherModule.data(results);
    currentWeatherModule.data(results);
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

// Object.entries(temps).forEach(([key, value]) => {
//     let convertedTemp = convertUnitTo.fahrenheit(value);
//     switch (true) {
//     case typeof value !== 'object' && key === 'temp':
//         convertedTemp = convertUnitTo.fahrenheit(value);
//         console.log(`hourly: ${key}: ${convertedTemp}`);
//         break;

//     case typeof value === 'object' && key === 'temp':
//         Object.entries(value).forEach(([key, value]) => {
//             convertedTemp = convertUnitTo.fahrenheit(value);
//             console.log(`daily(temp): ${key}: ${convertedTemp}`);
//         });
//         break;

//     case typeof value === 'object' && key === 'feels_like':
//         Object.entries(value).forEach(([key, value]) => {
//             convertedTemp = convertUnitTo.fahrenheit(value);
//             console.log(`daily(feels_like): ${key}: ${convertedTemp}`);
//         });
//         break;
//     default:
//         break;
//     }

})();

/******/ })()
;
//# sourceMappingURL=main.js.map