/**
 * 
 */

export const WebExtensionsApi = (browser || chrome || {});

export const getLanguage = () => navigator
  && navigator.language
  && navigator.language.match(/^([a-z]{2})-?([A-Z]{2})?$/)[1] || 'en';

const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

const getTripsTab = () => new Promise((resolve, reject) => {
  const query = {
    url: 'https://www.reservauto.net/Scripts/client/ReservationList*',
  };

  const selector = (tabs) => resolve(tabs[tabs.length - 1]);

  WebExtensionsApi.tabs.query(query, selector);
});

export const getTrips = async (cb) => {
  const trips = [];
  const tripsTab = await getTripsTab();

  if (!tripsTab) {
    return [];
  }

  console.log('Sending message to... ', tripsTab)

  const response = await WebExtensionsApi.tabs.sendMessage(tripsTab.id, {
    request: 'get-bookings',
  });

  console.log('response from content.js', response)

  return trips;
};
