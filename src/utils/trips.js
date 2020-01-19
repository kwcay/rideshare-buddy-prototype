/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

const getTripsTab = () => new Promise((resolve, reject) => {
  const query = {
    currentWindow: true,
    url: 'https://www.reservauto.net/Scripts/client/ReservationList*',
  };

  const selector = tabs => tabs && tabs.length
    ? resolve(tabs[tabs.length - 1])
    : reject('Trips tab not found.');

  WebExt.tabs.query(query, selector);
});

const getTripsFromTab = async () => {
  const tripsTab = await getTripsTab();
  const trips = await WebExt.tabs.sendMessage(tripsTab.id, {
    request: TAB_REQUEST_TRIPS_DETAILS,
  });

  return trips;
};
