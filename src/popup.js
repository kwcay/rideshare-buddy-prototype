import * as utils from './utils.js';

document.getElementById('parse-link').addEventListener('click', () => {
  utils.getTrips((result) => console.log('bookings', result));
});

browser.tabs.executeScript({ file: './content.js' });
