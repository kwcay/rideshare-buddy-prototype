/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

/**
 * Retrieves trip details.
 * 
 * @param {Object} message 
 */
const getTripsData = async ({ request }) => {
  if (request !== REQUEST_TRIPS_DATA) {
      return;
  }

  const trips = [];
  const promises = [];
  
  document
    .querySelectorAll('.tblReservations tr')
    .forEach(row => {
      const parsedData = parseTripRow(row);

      if (parsedData) {
        trips.push(parsedData);
        promises.push(...parsedData.asyncTasks);
      }
    });
  
  await utils.resolvePromises(promises);
  
  return Promise.resolve(trips);
};

const messageListeners = [
  getTripsData,
];

console.log('contentMessages.js loaded.');
