/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

const tripsDetailsListener = async ({ request }) => {
  if (request !== TAB_REQUEST_TRIPS_DETAILS) {
      return;
  }

  const trips = [];
  
  try {
    document
      .querySelectorAll('.tblReservations tr')
      .forEach(row => {
        const parsedData = parseTripRow(row);
        parsedData && trips.push(parsedData);
      });
  
    return trips
  } catch (error) {
    logger.error(error);

    return [];
  }
};

const messageListeners = [
  tripsDetailsListener,
];
