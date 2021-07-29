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

async function fetchWeatherFor(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f778724f49d8bcbf6a7c1111529b5d72`, { mode: 'cors' });
        return response;
    } catch (err) {
        return console.error(err);
    }
}

async function weatherDataFor(city) {
    try {
        const response = await fetchWeatherFor(city);
        const data = await response.json();
        console.log(data);
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

    return {
        fahrenheit,
        celcius,
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
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */



const weatherModule = (() => {
    function _weather(data) {
        const weatherType = data.weather;
        return console.log(weatherType[0].description);
    }

    function _tempFahrenheit(min, current, max) {
        const low = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.fahrenheit(min);
        const now = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.fahrenheit(current);
        const high = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.fahrenheit(max);
        console.log(low, now, high);
    }

    function _tempuratureControl(data, unit) {
        const tempLow = data.main.temp_min;
        const tempCurrent = data.main.feels_like;
        const tempHigh = data.main.temp_max;
        _tempFahrenheit(tempLow, tempCurrent, tempHigh);
    }

    function dataContain(data, unit) {
        console.log(data);
        _weather(data);
        _tempuratureControl(data, unit);
    }

    return {
        data: dataContain,
    };
})();

(0,_grabData__WEBPACK_IMPORTED_MODULE_0__.default)('Grand Rapids')
    .then((data) => weatherModule.data(data));

})();

/******/ })()
;
//# sourceMappingURL=main.js.map