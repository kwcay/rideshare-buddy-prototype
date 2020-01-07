/**
 * 
 */

const parseTripRow = (row) => {
  if (!row || !row.children) {
    return null;
  }

  const booking = {};
  const COST_INDEX = 6;
  const COST_RE = /([0-9]+),([0-9]{2})\$$/;

  if (COST_RE.test(row.children[COST_INDEX].innerText)) {
    console.log('cost', row.children[COST_INDEX].innerText.match(COST_RE));
  }

  return booking;
};

(browser || chrome).runtime.onMessage.addListener(message => {
  const trips = [];

  document
    .querySelectorAll('.tblReservations tr')
    .forEach(row => trips.push(parseTripRow(row)));

  return Promise.resolve(trips);
});
