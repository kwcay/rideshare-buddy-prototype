/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

(async () => {
  document.querySelector('#parse-bookings-page a').addEventListener('click', async () => {
    try {
      const trips = await getTripsFromTab();
      console.log('Trip details: ', trips);
    } catch (error) {
      console.error(error);
      showErrorPage('parse-bookings', 'Could not retrieve trip data.');
    }
  });
  
  const bookingsUrl = 'https://www.reservauto.net/Scripts/client/ReservationList.asp';
  document
    .querySelector('#view-bookings-page a')
    .setAttribute('href', `${bookingsUrl}?ShowPopup=false&OrderBy=1&ReservationStatus=2`);
  
  // Setup error page.
  document
    .querySelectorAll('#error-page button')
    .forEach(button => button.addEventListener('click', () => setActivePage(
      document.getElementById('error-page').dataset.returnPage,
    )));
  
  // Determine which page to show.
  try {
    await getTripsTab();
    setActivePage('parse-bookings');
  } catch (error) {
    logger.debug('[popup.js] trips tab not found... redirecting to view-bookings');
    setActivePage('view-bookings');
  }
})();
