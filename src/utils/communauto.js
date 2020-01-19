/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

/**
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
 * @param {HTMLTableRowElement} row 
 */
const parseId = row => regexParse(
  row, 0, /^[0-9]+$/,
  match => parseInt(match, 10),
);

/**
 * @param {HTMLTableRowElement} row 
 * @param {Number} index 
 */
const parseTimestamp = (row, index) => regexParse(
  row, index, /([0-9]{2}).([0-9]{2}).([0-9]{4})\s+([0-9]{2}):([0-9]{2})/,
  m => new Date(m[3], parseInt(m[2], 10) - 1, m[1], m[4], m[5]),
);

/**
 * @param {HTMLTableRowElement} row 
 */
const parseCost = row => regexParse(
  row, 6, /([0-9]+),([0-9]{2})\$$/,
  match => parseFloat(`${match[1]}.${match[2]}`),
);

/**
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
      logger.error('Infinite loop detected in getWeekendDuration()');
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

const resolvePromises = async promises => {
  console.log('promises...', promises)
  for (let i = 0; i < promises.length;) {
    Promise.all(promises.slice(i, i + MAX_PARALLEL_REQUESTS));
    
    i += MAX_PARALLEL_REQUESTS;
  }
};

const getTripStorageKey = trip => trip && trip.id && `communauto-trip-${trip.id}`;

const mergeTripData = (trip, updatedData) => {
  trip.durationCost = updatedData.durationPrice;
  trip.billedMins = trip.totalMins;

  trip.totalDistance = updatedData.tripTotalDistanceInKm;
  trip.distanceUnit = 'km';
  trip.distanceCost = updatedData.distancePrice;

  trip.currency = updatedData.currencyType;
  trip.subscriptionPlan = updatedData.packageId;
  trip.totalTaxes = updatedData.taxes;

  updatedData.durationInfo && updatedData.durationInfo.forEach(info => {
    if (info.durationType === 'BilledDuration') {
      trip.billedMins = info.durationInMinutes;
    }
  });

  return true;
};

const fetchTripData = async trip => {
  const time = (new Date()).getTime();
  const url = new URL('https://www.reservauto.net/WCF/Core/CoreService.svc/Get');
  url.searchParams.set('callback', `jQuery1124003962798285503111_${time}`);
  url.searchParams.set('apiUrl', encodeURI(`/api/Billing/Reservation/${trip.id}`));
  url.searchParams.set('content', 'null');
  url.searchParams.set('_', time);
  
  const response = await fetch(url.toString());

  if (response.status !== 200) {
    if (response.status === 403) {
      logger.error('fetchCommunautoTripData(): User needs to sign in again.');
    }

    throw new Error(`${response.statusText}`)
  }

  const jsonpResponse = await response.text();
  const jsonData = jsonpResponse.match(/^jQuery[0-9]+_[0-9]+\((.*)\);$/);
  const { d: updatedTripData } = JSON.parse(jsonData[1]);

  return updatedTripData;
};

const enrichTripData = async trip => {
  const storageKey = getTripStorageKey(trip);
  const storedTrips = await store.get({ [storageKey]: null });

  if (storedTrips && storedTrips[storageKey]) {
    logger.debug('Reusing stored trip data', storedTrips[storageKey]);
    return storedTrips[storageKey];
  }

  try {
    logger.debug(`Fetching trip data for #${trip.id}...`);

    const updatedTripData = await fetchTripData(trip);

    if (mergeTripData(trip, updatedTripData)) {
      await store.set({ [storageKey]: trip });
    }

    return trip;
  } catch (error) {
    logger.error('enrichTripData()', error);
    return trip;
  }
};

const makeTripDataPromise = trip => new Promise(async (resolve, reject) => {
  logger.debug('Resolving trip data promise...');
  if (trip.id != '1') {
    return resolve(trip);
  }

  await enrichTripData(trip);

  resolve(trip);
});

/**
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

  if (trip.id === 1) {
    trip.asyncTasks.push(async () => enrichTripData(trip));
  }

  if (trip.startedAt && trip.endedAt) {
    trip.totalMins = (trip.endedAt - trip.startedAt) / (1000 * 60);
    trip.weekendMins = getWeekendDuration(trip.startedAt, trip.endedAt, 1000 * 60);
    trip.weekdayMins = trip.totalMins - trip.weekendMins;
  }

  return trip;
};
