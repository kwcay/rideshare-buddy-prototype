/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

/**
 * Parses the contents of a table cell using a regular expression.
 * 
 * @param {HTMLTableRowElement} row 
 * @param {Number} index 
 * @param {RegExp} regex 
 * @param {Function} formatter 
 */
const regexParse = (row, index, regex, formatter) => (
  regex.test(row.children[index].innerText)
    && formatter(row.children[index].innerText.match(regex))
);

/**
 * Retrieves the trip ID from a table row.
 * 
 * @param {HTMLTableRowElement} row 
 */
const parseId = row => regexParse(
  row, 0, /^[0-9]+$/,
  match => parseInt(match, 10),
);

/**
 * Retrieves a date from a table row.
 * 
 * @param {HTMLTableRowElement} row 
 * @param {Number} index 
 */
const parseTimestamp = (row, index) => regexParse(
  row, index, /([0-9]{2}).([0-9]{2}).([0-9]{4})\s+([0-9]{2}):([0-9]{2})/,
  m => new Date(m[3], parseInt(m[2], 10) - 1, m[1], m[4], m[5]),
);

/**
 * Retrieves the trip cost from a table row.
 * @param {*} row 
 */
const parseCost = row => regexParse(
  row, 6, /([0-9]+),([0-9]{2})\$$/,
  match => parseFloat(`${match[1]}.${match[2]}`),
);

/**
 * Creates a Date object with the specified number of days added.
 * 
 * @param {Date} date 
 * @param {Number} n 
 */
const addDays = (
  date,
  n = 1,
) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n, 0, 0, 0, 0);

/**
 * 
 * @param {Date} startedAt
 * @param {Date} endedAt
 * @param {Number} factor
 */
const getWeekendDuration = (startedAt, endedAt, factor = 1) => {
  let ms = 0;
  let counter = startedAt.getTime();
  const counterStop = endedAt.getTime();
  const weekdays = new Set([1, 2, 3, 4, 5]);
  let numIterations = 0;
  
  while (counter < counterStop) {
    numIterations++;

    if (numIterations > 200) {
      console.error('Infinite loop detected in getWeekendDuration()');
      break;
    }

    const dateTime = new Date(counter);
    const day = dateTime.getDay();

    if (weekdays.has(day)) {
      counter = addDays(dateTime, 6 - day).getTime();
      continue;
    }

    const nextWeekday = addDays(dateTime, day == 6 ? 2 : 1).getTime();
    ms += Math.min(nextWeekday, counterStop) - counter;
    counter = nextWeekday;
  }

  return ms / factor;
}

const handleCommunautoBillingRequest = () => {

};

const makeCommunautoPromise = trip => new Promise(async (resolve, reject) => {
  // try {
  //   const breakdown = await CoreRestAPIGet(`/api/Billing/Reservation/${trip.id}`, null);
  //   console.log(`breakdown for ${trip.id}`, breakdown);

  //   resolve(breakdown);
  // } catch (error) {
  //   reject(error);
  // }

  resolve(trip)
});

/**
 * Retrieves trip info from a table row.
 * 
 * @todo  Cache result in localStorage.
 * 
 * @param {HTMLTableRowElement} row 
 */
const parseTripRow = row => {
  if (!row || !row.children) {
    return null;
  }

  const id = parseId(row);

  if (!id) {
    return null;
  }

  const trip = {
    id,
    startedAt: parseTimestamp(row, 3),
    endedAt: parseTimestamp(row, 4),
    totalMins: null,
    weekendMins: null,
    weekdayMins: null,
    totalCost: parseCost(row),
    currency: 'CAD',
    asyncTasks: [],
  };

  if (trip.startedAt && trip.endedAt) {
    trip.totalMins = (trip.endedAt - trip.startedAt) / (1000 * 60);
    trip.weekendMins = getWeekendDuration(trip.startedAt, trip.endedAt, 1000 * 60);
    trip.weekdayMins = trip.totalMins - trip.weekendMins;
  }

  trip.asyncTasks.push(makeCommunautoPromise(trip));

  return trip;
};

const resolvePromises = async promises => {
  for (let i = 0; i < promises.length;) {
    const chunk = promises.slice(i, MAX_PARALLEL_REQUESTS);
    
    console.log('Promises: ', chunk);
    
    i += MAX_PARALLEL_REQUESTS;
  }
};

console.log('contentUtils.js loaded.');
