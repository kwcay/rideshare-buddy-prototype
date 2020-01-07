/**
 * 
 */

export const WebExtensionsApi = (browser || chrome || {});

export const getLanguage = () => navigator
  && navigator.language
  && navigator.language.match(/^([a-z]{2})-?([A-Z]{2})?$/)[1] || 'en';

const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

const getBookingsTab = () => new Promise((resolve, reject) => {
  const query = {
    url: 'https://www.reservauto.net/Scripts/client/ReservationList*',
  };

  const selector = (tabs) => resolve(tabs[tabs.length - 1]);

  WebExtensionsApi.tabs.query(query, selector);
});

export const getBookings = async (cb) => {
  const bookings = [];
  const bookingsTab = await getBookingsTab();

  if (!bookingsTab) {
    return [];
  }

  console.log('Sending message to... ', bookingsTab)

  const response = await WebExtensionsApi.tabs.sendMessage(bookingsTab.id, {
    request: 'get-bookings',
  });

  console.log('response from content.js', response)

  // console.log('doc', doc, doc.querySelectorAll('.tblReservations tr')

  return bookings;
};
