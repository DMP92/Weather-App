/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/date-fns-tz/esm/_lib/tzParseTimezone/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/date-fns-tz/esm/_lib/tzParseTimezone/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ tzParseTimezone)
/* harmony export */ });
/* harmony import */ var _tzTokenizeDate_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tzTokenizeDate/index.js */ "./node_modules/date-fns-tz/esm/_lib/tzTokenizeDate/index.js");


var MILLISECONDS_IN_HOUR = 3600000
var MILLISECONDS_IN_MINUTE = 60000

var patterns = {
  timezone: /([Z+-].*)$/,
  timezoneZ: /^(Z)$/,
  timezoneHH: /^([+-])(\d{2})$/,
  timezoneHHMM: /^([+-])(\d{2}):?(\d{2})$/
}

// Parse various time zone offset formats to an offset in milliseconds
function tzParseTimezone(timezoneString, date, isUtcDate) {
  var token
  var absoluteOffset

  // Z
  token = patterns.timezoneZ.exec(timezoneString)
  if (token) {
    return 0
  }

  var hours

  // ±hh
  token = patterns.timezoneHH.exec(timezoneString)
  if (token) {
    hours = parseInt(token[2], 10)

    if (!validateTimezone(hours)) {
      return NaN
    }

    absoluteOffset = hours * MILLISECONDS_IN_HOUR
    return token[1] === '+' ? -absoluteOffset : absoluteOffset
  }

  // ±hh:mm or ±hhmm
  token = patterns.timezoneHHMM.exec(timezoneString)
  if (token) {
    hours = parseInt(token[2], 10)
    var minutes = parseInt(token[3], 10)

    if (!validateTimezone(hours, minutes)) {
      return NaN
    }

    absoluteOffset = hours * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE
    return token[1] === '+' ? -absoluteOffset : absoluteOffset
  }

  // IANA time zone
  if (isValidTimezoneIANAString(timezoneString)) {
    date = new Date(date || Date.now())
    var utcDate = isUtcDate ? date : toUtcDate(date)

    var offset = calcOffset(utcDate, timezoneString)

    var fixedOffset = isUtcDate ? offset : fixOffset(date, offset, timezoneString)

    return -fixedOffset
  }

  return 0
}

function toUtcDate(date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  )
}

function calcOffset(date, timezoneString) {
  var tokens = (0,_tzTokenizeDate_index_js__WEBPACK_IMPORTED_MODULE_0__.default)(date, timezoneString)

  var asUTC = Date.UTC(tokens[0], tokens[1] - 1, tokens[2], tokens[3] % 24, tokens[4], tokens[5])

  var asTS = date.getTime()
  var over = asTS % 1000
  asTS -= over >= 0 ? over : 1000 + over
  return asUTC - asTS
}

function fixOffset(date, offset, timezoneString) {
  var localTS = date.getTime()

  // Our UTC time is just a guess because our offset is just a guess
  var utcGuess = localTS - offset

  // Test whether the zone matches the offset for this ts
  var o2 = calcOffset(new Date(utcGuess), timezoneString)

  // If so, offset didn't change and we're done
  if (offset === o2) {
    return offset
  }

  // If not, change the ts by the difference in the offset
  utcGuess -= o2 - offset

  // If that gives us the local time we want, we're done
  var o3 = calcOffset(new Date(utcGuess), timezoneString)
  if (o2 === o3) {
    return o2
  }

  // If it's different, we're in a hole time. The offset has changed, but the we don't adjust the time
  return Math.max(o2, o3)
}

function validateTimezone(hours, minutes) {
  if (minutes != null && (minutes < 0 || minutes > 59)) {
    return false
  }

  return true
}

function isValidTimezoneIANAString(timeZoneString) {
  try {
    Intl.DateTimeFormat(undefined, {timeZone: timeZoneString});
    return true;
  } catch (error) {
    return false;
  }
}


/***/ }),

/***/ "./node_modules/date-fns-tz/esm/_lib/tzTokenizeDate/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/date-fns-tz/esm/_lib/tzTokenizeDate/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ tzTokenizeDate)
/* harmony export */ });
/**
 * Returns the [year, month, day, hour, minute, seconds] tokens of the provided
 * `date` as it will be rendered in the `timeZone`.
 */
function tzTokenizeDate(date, timeZone) {
  var dtf = getDateTimeFormat(timeZone)
  return dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date)
}

var typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5,
}

function partsOffset(dtf, date) {
  var formatted = dtf.formatToParts(date)
  var filled = []
  for (var i = 0; i < formatted.length; i++) {
    var pos = typeToPos[formatted[i].type]

    if (pos >= 0) {
      filled[pos] = parseInt(formatted[i].value, 10)
    }
  }
  return filled
}

function hackyOffset(dtf, date) {
  var formatted = dtf.format(date).replace(/\u200E/g, '')
  var parsed = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted)
  // var [, fMonth, fDay, fYear, fHour, fMinute, fSecond] = parsed
  // return [fYear, fMonth, fDay, fHour, fMinute, fSecond]
  return [parsed[3], parsed[1], parsed[2], parsed[4], parsed[5], parsed[6]]
}

// Get a cached Intl.DateTimeFormat instance for the IANA `timeZone`. This can be used
// to get deterministic local date/time output according to the `en-US` locale which
// can be used to extract local time parts as necessary.
var dtfCache = {}
function getDateTimeFormat(timeZone) {
  if (!dtfCache[timeZone]) {
    // New browsers use `hourCycle`, IE and Chrome <73 does not support it and uses `hour12`
    var testDateFormatted = new Intl.DateTimeFormat('en-US', {
      hour12: false,
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date('2014-06-25T04:00:00.123Z'))
    var hourCycleSupported =
      testDateFormatted === '06/25/2014, 00:00:00' ||
      testDateFormatted === '‎06‎/‎25‎/‎2014‎ ‎00‎:‎00‎:‎00'

    dtfCache[timeZone] = hourCycleSupported
      ? new Intl.DateTimeFormat('en-US', {
          hour12: false,
          timeZone: timeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : new Intl.DateTimeFormat('en-US', {
          hourCycle: 'h23',
          timeZone: timeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
  }
  return dtfCache[timeZone]
}


/***/ }),

/***/ "./node_modules/date-fns-tz/esm/toDate/index.js":
/*!******************************************************!*\
  !*** ./node_modules/date-fns-tz/esm/toDate/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var date_fns_esm_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! date-fns/esm/_lib/toInteger/index.js */ "./node_modules/date-fns/esm/_lib/toInteger/index.js");
/* harmony import */ var date_fns_esm_lib_getTimezoneOffsetInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js */ "./node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js");
/* harmony import */ var _lib_tzParseTimezone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/tzParseTimezone */ "./node_modules/date-fns-tz/esm/_lib/tzParseTimezone/index.js");




var MILLISECONDS_IN_HOUR = 3600000
var MILLISECONDS_IN_MINUTE = 60000
var DEFAULT_ADDITIONAL_DIGITS = 2

var patterns = {
  dateTimeDelimeter: /[T ]/,
  plainTime: /:/,
  timeZoneDelimeter: /[Z ]/i,

  // year tokens
  YY: /^(\d{2})$/,
  YYY: [
    /^([+-]\d{2})$/, // 0 additional digits
    /^([+-]\d{3})$/, // 1 additional digit
    /^([+-]\d{4})$/, // 2 additional digits
  ],
  YYYY: /^(\d{4})/,
  YYYYY: [
    /^([+-]\d{4})/, // 0 additional digits
    /^([+-]\d{5})/, // 1 additional digit
    /^([+-]\d{6})/, // 2 additional digits
  ],

  // date tokens
  MM: /^-(\d{2})$/,
  DDD: /^-?(\d{3})$/,
  MMDD: /^-?(\d{2})-?(\d{2})$/,
  Www: /^-?W(\d{2})$/,
  WwwD: /^-?W(\d{2})-?(\d{1})$/,

  HH: /^(\d{2}([.,]\d*)?)$/,
  HHMM: /^(\d{2}):?(\d{2}([.,]\d*)?)$/,
  HHMMSS: /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/,

  // timezone tokens (to identify the presence of a tz)
  timezone: /([Z+-].*| UTC|(?:[a-zA-Z]+\/[a-zA-Z_]+(?:\/[a-zA-Z_]+)?))$/,
}

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If an argument is a string, the function tries to parse it.
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 * If the function cannot parse the string or the values are invalid, it returns Invalid Date.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 * All *date-fns* functions will throw `RangeError` if `options.additionalDigits` is not 0, 1, 2 or undefined.
 *
 * @param {Date|String|Number} argument - the value to convert
 * @param {OptionsWithTZ} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - the additional number of digits in the extended year format
 * @param {String} [options.timeZone=''] - used to specify the IANA time zone offset of a date String.
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * var result = toDate('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert string '+02014101' to date,
 * // if the additional number of digits in the extended year format is 1:
 * var result = toDate('+02014101', {additionalDigits: 1})
 * //=> Fri Apr 11 2014 00:00:00
 */
function toDate(argument, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  if (argument === null) {
    return new Date(NaN)
  }

  var options = dirtyOptions || {}

  var additionalDigits =
    options.additionalDigits == null
      ? DEFAULT_ADDITIONAL_DIGITS
      : (0,date_fns_esm_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_0__.default)(options.additionalDigits)
  if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
    throw new RangeError('additionalDigits must be 0, 1 or 2')
  }

  // Clone the date
  if (
    argument instanceof Date ||
    (typeof argument === 'object' && Object.prototype.toString.call(argument) === '[object Date]')
  ) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime())
  } else if (
    typeof argument === 'number' ||
    Object.prototype.toString.call(argument) === '[object Number]'
  ) {
    return new Date(argument)
  } else if (
    !(
      typeof argument === 'string' || Object.prototype.toString.call(argument) === '[object String]'
    )
  ) {
    return new Date(NaN)
  }

  var dateStrings = splitDateString(argument)

  var parseYearResult = parseYear(dateStrings.date, additionalDigits)
  var year = parseYearResult.year
  var restDateString = parseYearResult.restDateString

  var date = parseDate(restDateString, year)

  if (isNaN(date)) {
    return new Date(NaN)
  }

  if (date) {
    var timestamp = date.getTime()
    var time = 0
    var offset

    if (dateStrings.time) {
      time = parseTime(dateStrings.time)

      if (isNaN(time)) {
        return new Date(NaN)
      }
    }

    if (dateStrings.timezone || options.timeZone) {
      offset = (0,_lib_tzParseTimezone__WEBPACK_IMPORTED_MODULE_1__.default)(dateStrings.timezone || options.timeZone, new Date(timestamp + time))
      if (isNaN(offset)) {
        return new Date(NaN)
      }
    } else {
      // get offset accurate to hour in timezones that change offset
      offset = (0,date_fns_esm_lib_getTimezoneOffsetInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__.default)(new Date(timestamp + time))
      offset = (0,date_fns_esm_lib_getTimezoneOffsetInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__.default)(new Date(timestamp + time + offset))
    }

    return new Date(timestamp + time + offset)
  } else {
    return new Date(NaN)
  }
}

function splitDateString(dateString) {
  var dateStrings = {}
  var array = dateString.split(patterns.dateTimeDelimeter)
  var timeString

  if (patterns.plainTime.test(array[0])) {
    dateStrings.date = null
    timeString = array[0]
  } else {
    dateStrings.date = array[0]
    timeString = array[1]
    dateStrings.timezone = array[2]
    if (patterns.timeZoneDelimeter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimeter)[0]
      timeString = dateString.substr(dateStrings.date.length, dateString.length)
    }
  }

  if (timeString) {
    var token = patterns.timezone.exec(timeString)
    if (token) {
      dateStrings.time = timeString.replace(token[1], '')
      dateStrings.timezone = token[1]
    } else {
      dateStrings.time = timeString
    }
  }

  return dateStrings
}

function parseYear(dateString, additionalDigits) {
  var patternYYY = patterns.YYY[additionalDigits]
  var patternYYYYY = patterns.YYYYY[additionalDigits]

  var token

  // YYYY or ±YYYYY
  token = patterns.YYYY.exec(dateString) || patternYYYYY.exec(dateString)
  if (token) {
    var yearString = token[1]
    return {
      year: parseInt(yearString, 10),
      restDateString: dateString.slice(yearString.length),
    }
  }

  // YY or ±YYY
  token = patterns.YY.exec(dateString) || patternYYY.exec(dateString)
  if (token) {
    var centuryString = token[1]
    return {
      year: parseInt(centuryString, 10) * 100,
      restDateString: dateString.slice(centuryString.length),
    }
  }

  // Invalid ISO-formatted year
  return {
    year: null,
  }
}

function parseDate(dateString, year) {
  // Invalid ISO-formatted year
  if (year === null) {
    return null
  }

  var token
  var date
  var month
  var week

  // YYYY
  if (dateString.length === 0) {
    date = new Date(0)
    date.setUTCFullYear(year)
    return date
  }

  // YYYY-MM
  token = patterns.MM.exec(dateString)
  if (token) {
    date = new Date(0)
    month = parseInt(token[1], 10) - 1

    if (!validateDate(year, month)) {
      return new Date(NaN)
    }

    date.setUTCFullYear(year, month)
    return date
  }

  // YYYY-DDD or YYYYDDD
  token = patterns.DDD.exec(dateString)
  if (token) {
    date = new Date(0)
    var dayOfYear = parseInt(token[1], 10)

    if (!validateDayOfYearDate(year, dayOfYear)) {
      return new Date(NaN)
    }

    date.setUTCFullYear(year, 0, dayOfYear)
    return date
  }

  // yyyy-MM-dd or YYYYMMDD
  token = patterns.MMDD.exec(dateString)
  if (token) {
    date = new Date(0)
    month = parseInt(token[1], 10) - 1
    var day = parseInt(token[2], 10)

    if (!validateDate(year, month, day)) {
      return new Date(NaN)
    }

    date.setUTCFullYear(year, month, day)
    return date
  }

  // YYYY-Www or YYYYWww
  token = patterns.Www.exec(dateString)
  if (token) {
    week = parseInt(token[1], 10) - 1

    if (!validateWeekDate(year, week)) {
      return new Date(NaN)
    }

    return dayOfISOWeekYear(year, week)
  }

  // YYYY-Www-D or YYYYWwwD
  token = patterns.WwwD.exec(dateString)
  if (token) {
    week = parseInt(token[1], 10) - 1
    var dayOfWeek = parseInt(token[2], 10) - 1

    if (!validateWeekDate(year, week, dayOfWeek)) {
      return new Date(NaN)
    }

    return dayOfISOWeekYear(year, week, dayOfWeek)
  }

  // Invalid ISO-formatted date
  return null
}

function parseTime(timeString) {
  var token
  var hours
  var minutes

  // hh
  token = patterns.HH.exec(timeString)
  if (token) {
    hours = parseFloat(token[1].replace(',', '.'))

    if (!validateTime(hours)) {
      return NaN
    }

    return (hours % 24) * MILLISECONDS_IN_HOUR
  }

  // hh:mm or hhmm
  token = patterns.HHMM.exec(timeString)
  if (token) {
    hours = parseInt(token[1], 10)
    minutes = parseFloat(token[2].replace(',', '.'))

    if (!validateTime(hours, minutes)) {
      return NaN
    }

    return (hours % 24) * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE
  }

  // hh:mm:ss or hhmmss
  token = patterns.HHMMSS.exec(timeString)
  if (token) {
    hours = parseInt(token[1], 10)
    minutes = parseInt(token[2], 10)
    var seconds = parseFloat(token[3].replace(',', '.'))

    if (!validateTime(hours, minutes, seconds)) {
      return NaN
    }

    return (hours % 24) * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE + seconds * 1000
  }

  // Invalid ISO-formatted time
  return null
}

function dayOfISOWeekYear(isoWeekYear, week, day) {
  week = week || 0
  day = day || 0
  var date = new Date(0)
  date.setUTCFullYear(isoWeekYear, 0, 4)
  var fourthOfJanuaryDay = date.getUTCDay() || 7
  var diff = week * 7 + day + 1 - fourthOfJanuaryDay
  date.setUTCDate(date.getUTCDate() + diff)
  return date
}

// Validation functions

var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
var DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function isLeapYearIndex(year) {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
}

function validateDate(year, month, date) {
  if (month < 0 || month > 11) {
    return false
  }

  if (date != null) {
    if (date < 1) {
      return false
    }

    var isLeapYear = isLeapYearIndex(year)
    if (isLeapYear && date > DAYS_IN_MONTH_LEAP_YEAR[month]) {
      return false
    }
    if (!isLeapYear && date > DAYS_IN_MONTH[month]) {
      return false
    }
  }

  return true
}

function validateDayOfYearDate(year, dayOfYear) {
  if (dayOfYear < 1) {
    return false
  }

  var isLeapYear = isLeapYearIndex(year)
  if (isLeapYear && dayOfYear > 366) {
    return false
  }
  if (!isLeapYear && dayOfYear > 365) {
    return false
  }

  return true
}

function validateWeekDate(year, week, day) {
  if (week < 0 || week > 52) {
    return false
  }

  if (day != null && (day < 0 || day > 6)) {
    return false
  }

  return true
}

function validateTime(hours, minutes, seconds) {
  if (hours != null && (hours < 0 || hours >= 25)) {
    return false
  }

  if (minutes != null && (minutes < 0 || minutes >= 60)) {
    return false
  }

  if (seconds != null && (seconds < 0 || seconds >= 60)) {
    return false
  }

  return true
}


/***/ }),

/***/ "./node_modules/date-fns-tz/esm/utcToZonedTime/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/date-fns-tz/esm/utcToZonedTime/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ utcToZonedTime)
/* harmony export */ });
/* harmony import */ var _lib_tzParseTimezone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/tzParseTimezone */ "./node_modules/date-fns-tz/esm/_lib/tzParseTimezone/index.js");
/* harmony import */ var _toDate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../toDate */ "./node_modules/date-fns-tz/esm/toDate/index.js");



/**
 * @name utcToZonedTime
 * @category Time Zone Helpers
 * @summary Get a date/time representing local time in a given time zone from the UTC date
 *
 * @description
 * Returns a date instance with values representing the local time in the time zone
 * specified of the UTC time from the date provided. In other words, when the new date
 * is formatted it will show the equivalent hours in the target time zone regardless
 * of the current system time zone.
 *
 * @param {Date|String|Number} date - the date with the relevant UTC time
 * @param {String} timeZone - the time zone to get local time for, can be an offset or IANA time zone
 * @param {OptionsWithTZ} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Date} the new date with the equivalent time in the time zone
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // In June 10am UTC is 6am in New York (-04:00)
 * const result = utcToZonedTime('2014-06-25T10:00:00.000Z', 'America/New_York')
 * //=> Jun 25 2014 06:00:00
 */
function utcToZonedTime(dirtyDate, timeZone, options) {
  var date = (0,_toDate__WEBPACK_IMPORTED_MODULE_0__.default)(dirtyDate, options)

  var offsetMilliseconds = (0,_lib_tzParseTimezone__WEBPACK_IMPORTED_MODULE_1__.default)(timeZone, date, true) || 0

  var d = new Date(date.getTime() - offsetMilliseconds)

  var zonedTime = new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds(),
    d.getUTCMilliseconds()
  )

  return zonedTime
}


/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getTimezoneOffsetInMilliseconds)
/* harmony export */ });
/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/requiredArgs/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ requiredArgs)
/* harmony export */ });
function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
  }
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/toInteger/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/toInteger/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toInteger)
/* harmony export */ });
function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }

  var number = Number(dirtyNumber);

  if (isNaN(number)) {
    return number;
  }

  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

/***/ }),

/***/ "./node_modules/date-fns/esm/fromUnixTime/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/date-fns/esm/fromUnixTime/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ fromUnixTime)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../toDate/index.js */ "./node_modules/date-fns/esm/toDate/index.js");
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ "./node_modules/date-fns/esm/_lib/toInteger/index.js");
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");



/**
 * @name fromUnixTime
 * @category Timestamp Helpers
 * @summary Create a date from a Unix timestamp.
 *
 * @description
 * Create a date from a Unix timestamp.
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * @param {Number} unixTime - the given Unix timestamp
 * @returns {Date} the date
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Create the date 29 February 2012 11:45:05:
 * var result = fromUnixTime(1330515905)
 * //=> Wed Feb 29 2012 11:45:05
 */

function fromUnixTime(dirtyUnixTime) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__.default)(1, arguments);
  var unixTime = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__.default)(dirtyUnixTime);
  return (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_2__.default)(unixTime * 1000);
}

/***/ }),

/***/ "./node_modules/date-fns/esm/toDate/index.js":
/*!***************************************************!*\
  !*** ./node_modules/date-fns/esm/toDate/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @param {Date|Number} argument - the value to convert
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */

function toDate(argument) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__.default)(1, arguments);
  var argStr = Object.prototype.toString.call(argument); // Clone the date

  if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument);
  } else {
    if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"); // eslint-disable-next-line no-console

      console.warn(new Error().stack);
    }

    return new Date(NaN);
  }
}

/***/ }),

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
/* harmony import */ var _printWeather__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./printWeather */ "./src/printWeather.js");
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */




const dailyWeatherModule = (() => {
    const forecastCollection = {};
    const forecastedTemp = [];
    const forecastedHumidity = [];
    const forecastedRain = [];
    const forecastedWeather = [];
    const forecastedDay = [];
    // eslint-disable-next-line no-unused-vars
    function _weather(day, i) {
        let j = 0;
        Object.entries(day).forEach(([key, value]) => {
            // id main description icon
            const weatherObject = [];
            weatherObject[j] = value;
            forecastedWeather[i] = weatherObject[j];
            forecastCollection.weather = forecastedWeather;
        });
        j += 1;
    }

    function displayDate(date) {
        let i = 0;
        date.forEach((day) => {
            const forecastDate = _helperFunctions__WEBPACK_IMPORTED_MODULE_0__.default.unix(day.dt);
            const recordedDate = forecastDate.slice(0, 10);
            forecastedDay[i] = recordedDate;
            forecastCollection.date = forecastedDay;
            i += 1;
        });
    }

    // accesses the conversion interface in 'helperFunctions.js'
    function fetchTempFahrenheit(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            Object.entries(day.temp).forEach(([key, value]) => {
                const temp = _helperFunctions__WEBPACK_IMPORTED_MODULE_0__.default.fahrenheit(value);
                forecastedTemp[i] = `${temp}° F`;
                forecastCollection.temp = forecastedTemp;
            });
            i++;
        });
    }

    // accesses the conversion interface in 'helperFunctions.js'
    function fetchTempCelcius(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            Object.entries(day.temp).forEach(([key, value]) => {
                const temp = _helperFunctions__WEBPACK_IMPORTED_MODULE_0__.default.celcius(value);
                forecastedTemp[i] = `${temp}° C`;
                forecastCollection.temp = forecastedTemp;
            });
            i++;
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
        let i = 0;
        forecast.forEach((day) => {
            const humidityLevel = day.humidity;
            forecastedHumidity[i] = `humidity: ${humidityLevel}%`;
            forecastCollection.humidity = forecastedHumidity;
            i += 1;
        });
    }

    // gives the chance and amount of rain
    function _chanceOfRain(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            if (day.rain !== undefined) {
                forecastedRain[i] = `${Math.round(day.pop * 100)}%`;
            } else {
                forecastedRain[i] = `${Math.round(day.pop * 100)}%`;
            }
            forecastCollection.rain = forecastedRain;
            i += 1;
        });
    }
    // breaks down forecasted weather and sends data off to their respective functions
    function _forecastParse(forecast) {
        let i = 0;
        forecast.forEach((day) => {
            _weather(day.weather, i);
            i += 1;
        });
    }

    // eslint-disable-next-line no-unused-vars
    function _dataParse(data) {
        // 8 day forecasted data
        const forecast = data.daily;
        displayDate(forecast);
        tempController(forecast);
        displayHumidity(forecast);
        _forecastParse(forecast);
        _chanceOfRain(forecast);
        _printWeather__WEBPACK_IMPORTED_MODULE_1__.forecastModule.print(forecastCollection);
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
/* harmony export */   "cityOrCountryName": () => (/* binding */ cityOrCountryName),
/* harmony export */   "weatherDataFor": () => (/* binding */ weatherDataFor)
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
/* harmony import */ var date_fns_tz__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! date-fns-tz */ "./node_modules/date-fns-tz/esm/utcToZonedTime/index.js");
/* harmony import */ var date_fns_fromUnixTime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! date-fns/fromUnixTime */ "./node_modules/date-fns/esm/fromUnixTime/index.js");
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */





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
        const targetTime = (0,date_fns_fromUnixTime__WEBPACK_IMPORTED_MODULE_1__.default)(unix);
        const properTime = (0,date_fns_tz__WEBPACK_IMPORTED_MODULE_2__.default)(targetTime, tz);
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
/* harmony import */ var _printWeather__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./printWeather */ "./src/printWeather.js");
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */




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
        const hourlyTemp = _helperFunctions__WEBPACK_IMPORTED_MODULE_0__.default.fahrenheit(hours.temp);
        // uses temps
        hourTempF[i] = `${hourlyTemp}° F`;
        hour.temp = hourTempF;
    }

    function timeOfHour(hours, i) {
        const time = _helperFunctions__WEBPACK_IMPORTED_MODULE_0__.default.unix(hours.dt);
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
        const hourlyTemp = _helperFunctions__WEBPACK_IMPORTED_MODULE_0__.default.celcius(hours.temp);
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
        _printWeather__WEBPACK_IMPORTED_MODULE_1__.hourlyModule.print(hour);
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

/***/ "./src/iconController.js":
/*!*******************************!*\
  !*** ./src/iconController.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _printWeather__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./printWeather */ "./src/printWeather.js");
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */


const iconHandler = (() => {
    function printToday(type, img, obj) {
        const icon = `${img}@2x.png`;
        _printWeather__WEBPACK_IMPORTED_MODULE_0__.printModule.check(img);
    }

    function operator(type, img) {
        switch (true) {
        case type === 'current':
            printToday(type, img);
            break;
        }
    }
    return {
        operator,
    };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (iconHandler);


/***/ }),

/***/ "./src/printToScreen.js":
/*!******************************!*\
  !*** ./src/printToScreen.js ***!
  \******************************/
/***/ (() => {



/***/ }),

/***/ "./src/printWeather.js":
/*!*****************************!*\
  !*** ./src/printWeather.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "printModule": () => (/* binding */ printModule),
/* harmony export */   "forecastModule": () => (/* binding */ forecastModule),
/* harmony export */   "hourlyModule": () => (/* binding */ hourlyModule),
/* harmony export */   "clearDOM": () => (/* binding */ clearDOM)
/* harmony export */ });
/* harmony import */ var _helperFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helperFunctions */ "./src/helperFunctions.js");
/* eslint-disable no-use-before-define */
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
        printModule.rain(object.rain[0]);
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

    function printRainChance(object) {
        const rainContainer = document.querySelector('.rainChance');
        rainContainer.textContent = `${object} Chance of rain`;
    }

    function printSunTimes(object) {
        const sunriseContainer = document.querySelector('.sunrise');
        const sunsetContainer = document.querySelector('.sunset');
        sunriseContainer.textContent = `Sunrise: ${object.sunrise}`;
        sunsetContainer.textContent = `Sunset: ${object.sunset}`;
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

    function printWind(degree, speed) {
        today[6].textContent = `${degree} ${speed}`;
    }

    function printHumidity(object) {
        today[7].textContent = object.humidity;
    }

    function printToday(object, img) {
        printDate(object);
        printTemp(object);
        checkForImage(object);
        printSummary(object);
        printWind(object);
        printHumidity(object);
        printSunTimes(object);
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
        printWind,
        delete: deleteData,
        rain: printRainChance,
    };
})();

function clearDOM() {
    printModule.delete();
    hourlyModule.delete();
    forecastModule.delete();
}




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
/* harmony import */ var _printWeather__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./printWeather */ "./src/printWeather.js");
/* harmony import */ var _iconController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./iconController */ "./src/iconController.js");
/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */







const higherInput = document.querySelector('.city');
const lowerInput = document.querySelector('.lowerCity');
const button = document.querySelector('.submit');
const unitButton = document.querySelector('.unit');
const inputArray = [];

async function autoCity() {
    const stateName = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.cityOrCountryName)('Honolulu');
    const results = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.weatherDataFor)(stateName.location.name);
    _forecast__WEBPACK_IMPORTED_MODULE_2__.default.data(results);
    currentWeatherModule.data(results);
    currentWeatherModule.name(stateName);
    currentWeatherModule.winds(stateName);
    _hourly__WEBPACK_IMPORTED_MODULE_3__.default.dataObtain(results);
}

function inputLimiter(state) {
    inputArray.pop();
    inputArray.push(state);
}
// fetches data that is then passed into the 'currentWeatherModule' and all
// other modules
async function fetchData() {
    const city = inputArray[0];
    let results = '';
    let stateName = '';

    switch (true) {
    case city === true && higherInput.value !== '':
        stateName = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.cityOrCountryName)(higherInput.value);
        results = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.weatherDataFor)(stateName.location.name);
        _forecast__WEBPACK_IMPORTED_MODULE_2__.default.data(results);
        // eslint-disable-next-line no-use-before-define
        currentWeatherModule.data(results);
        currentWeatherModule.name(stateName);
        currentWeatherModule.winds(stateName);
        _hourly__WEBPACK_IMPORTED_MODULE_3__.default.dataObtain(results);
        break;
    case city === false && lowerInput.value !== '':
        stateName = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.cityOrCountryName)(lowerInput.value);
        results = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.weatherDataFor)(stateName.location.name);
        _forecast__WEBPACK_IMPORTED_MODULE_2__.default.data(results);
        // eslint-disable-next-line no-use-before-define
        currentWeatherModule.data(results);
        currentWeatherModule.name(stateName);
        currentWeatherModule.winds(stateName);
        _hourly__WEBPACK_IMPORTED_MODULE_3__.default.dataObtain(results);
        break;
    case city === false && lowerInput.value === '':
        stateName = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.cityOrCountryName)(higherInput.value);
        results = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.weatherDataFor)(stateName.location.name);
        _forecast__WEBPACK_IMPORTED_MODULE_2__.default.data(results);
        // eslint-disable-next-line no-use-before-define
        currentWeatherModule.data(results);
        currentWeatherModule.name(stateName);
        currentWeatherModule.winds(stateName);
        _hourly__WEBPACK_IMPORTED_MODULE_3__.default.dataObtain(results);
        break;
    case city === true && higherInput.value === '':
        stateName = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.cityOrCountryName)(lowerInput.value);
        results = await (0,_grabData__WEBPACK_IMPORTED_MODULE_0__.weatherDataFor)(stateName.location.name);
        _forecast__WEBPACK_IMPORTED_MODULE_2__.default.data(results);
        // eslint-disable-next-line no-use-before-define
        currentWeatherModule.data(results);
        currentWeatherModule.name(stateName);
        currentWeatherModule.winds(stateName);
        _hourly__WEBPACK_IMPORTED_MODULE_3__.default.dataObtain(results);
        break;
    }
}

// upon pressing the submit button, or pressing enter the function grabs required data
button.addEventListener('click', async () => {
    if (higherInput.value === '' && lowerInput.value === '') {
        alert('Enter the name of a city');
    } else {
        (0,_printWeather__WEBPACK_IMPORTED_MODULE_4__.clearDOM)();
        fetchData();
    }
});

higherInput.addEventListener('input', () => {
    inputLimiter(true);
});

lowerInput.addEventListener('input', () => {
    inputLimiter(false);
});

// acts as another search button to refresh contents of DOM according to unit selected
window.addEventListener('load', async () => {
    unitButton.textContent = 'F';
    lowerInput.value = '';
    higherInput.value = '';
    autoCity();
});

window.addEventListener('keydown', (e) => {
    switch (true) {
    case e.keyCode === 13:
        if (higherInput.value === '' && lowerInput.value === '') {
            alert('Enter the name of a city');
        } else {
            (0,_printWeather__WEBPACK_IMPORTED_MODULE_4__.clearDOM)();
            fetchData();
        }
    }
});
// gathers temp unit
unitButton.addEventListener('click', async (e) => {
    (0,_printWeather__WEBPACK_IMPORTED_MODULE_4__.clearDOM)();
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

    const wToday = {};

    function printStateOrCountry(regionData) {
        const cityStateContainer = document.querySelector('.cityState');

        switch (true) {
        case regionData.location.country === 'United States of America':
            cityStateContainer.textContent = `${regionData.location.name}, ${regionData.location.region}`;
            break;
        case regionData.location.country !== 'United States of America':
            cityStateContainer.textContent = `${regionData.location.name}, ${regionData.location.country}`;
            break;
        }
    }

    function shareToday() {
        const page = 'current';
        _printWeather__WEBPACK_IMPORTED_MODULE_4__.printModule.print(wToday, page);
    }

    function currentDateTime(data, tz) {
        const currentTime = data.dt;
        const convertTime = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.unix(currentTime, tz);
        wToday.time = `${convertTime}`;
    }

    function sunriseSunset(object) {
        const rawSunrise = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.unix(object.sunrise);
        const rawSunset = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.unix(object.sunset);
        const sunrise = rawSunrise.slice(17, 26);
        const sunset = rawSunset.slice(17, 26);
        wToday.sunrise = sunrise;
        wToday.sunset = sunset;
    }

    function _breezeType(windSpeed) {
        let breezeMessage = '';
        switch (true) {
        case windSpeed <= 2.5:
            breezeMessage = 'Light breeze.';
            break;
        case windSpeed > 2.5 && windSpeed <= 3.5:
            breezeMessage = 'Gentle breeze.';
            break;
        case windSpeed > 3.5 && windSpeed <= 5:
            breezeMessage = 'Moderate breeze.';
            break;
        case windSpeed > 5 && windSpeed <= 6:
            breezeMessage = 'Strong breeze.';
            break;
        case windSpeed > 6 && windSpeed <= 7:
            breezeMessage = 'Near gale.';
            break;
        case windSpeed > 7 && windSpeed <= 8:
            breezeMessage = 'Gale force winds.';
            break;
        case windSpeed > 8:
            breezeMessage = 'Storm/hurricane force winds.';
        }
        wToday.breeze = breezeMessage;
    }

    // data about today's expected wind speed an degree
    function winds(weather) {
        const windDegree = weather.current.wind_dir;
        const windSpeed = weather.current.wind_mph;
        const degree = `Wind: ${windDegree}`;
        const speed = `${windSpeed}mph`;
        _printWeather__WEBPACK_IMPORTED_MODULE_4__.printModule.printWind(degree, speed);
    }

    // grabs data about today's projected humidity
    function _fetchHumidity(current) {
        const humidity = `Humidity: ${current.humidity} %`;
        wToday.humidity = humidity;
    }

    // grabs today's expected weather patterns
    function _fetchWeather(current) {
        const weatherTitle = current.weather[0].main;
        const weatherDescription = current.weather[0].description;

        wToday.weatherTitle = `${weatherTitle}. `;
        wToday.weatherDesc = `current weather: ${weatherDescription}`;
    }

    // gather's and converts today's expected temps in fahrenheit
    function prepareTempFahrenheit(current) {
        // converts temps
        const currentTemp = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.fahrenheit(current.temp);
        const feelsLike = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.fahrenheit(current.feels_like);
        // uses temps

        wToday.current = `${currentTemp}° F`;
        wToday.feelsLike = `Feels like ${feelsLike}° F. `;
    }

    // gather's and converts today's expected temps in celcius
    function prepareTempCelcius(current) {
        // converts temps
        const currentTemp = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.celcius(current.temp);
        const feelsLike = _helperFunctions__WEBPACK_IMPORTED_MODULE_1__.default.celcius(current.feels_like);
        // uses temps

        wToday.current = `${currentTemp}° C`;
        wToday.feelsLike = `Feels like ${feelsLike}° C. `;
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

    function weatherIcon(data) {
        const icons = data.weather[0].icon;
        const type = 'current';
        wToday.icon = icons;
    }
    // sends data off to the different functions inside 'current' weather module
    async function _parseData(current, tz) {
        currentDateTime(current, tz);
        weatherIcon(current);
        _fetchHumidity(current);
        prepareTempController(current);
        _fetchWeather(current);
        sunriseSunset(current);
        _breezeType(current.windSpeed);
        shareToday(wToday);
    }

    // grabs and parses data for future use
    function obtainData(data, timezone) {
        const currentData = data.current;
        const tz = data.timezone;
        _parseData(currentData, tz);
    }

    return {
        data: obtainData,
        current: shareToday,
        winds,
        name: printStateOrCountry,
    };
})();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map