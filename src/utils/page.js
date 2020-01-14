/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

const getLanguage = () => navigator
  && navigator.language
  && navigator.language.match(/^([a-z]{2})-?([A-Z]{2})?$/)[1] || 'en';

const setActivePage = pageName => {
  document.querySelectorAll('article').forEach(el => el.classList.add('hidden'));
  document.querySelector(`#${pageName}-page`).classList.remove('hidden');
};

const showErrorPage = returnPage => {
  setActivePage('error');
  document.querySelector(`#error-page`).dataset.returnPage = returnPage;
};

/**
 * Selects the trip tab in the browser.
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

const getTrips = async () => {
  const tripsTab = await getTripsTab();
  const trips = await WebExt.tabs.sendMessage(tripsTab.id, {
    request: REQUEST_TRIPS_DATA,
  });

  return Promise.resolve(trips);
};
