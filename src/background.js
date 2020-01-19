/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

const lookForTripsData = async () => {
  logger.debug('[background.js] Looking for trips data...');

  try {
    let trips = await getTripsFromTab();

    logger.debug(`[background.js] Found ${trips.length} trips.`, trips);
  } catch (error) {
    logger.debug('[background.js] failed...', error);
  }
};

(async () => {
  lookForTripsData();
})();
