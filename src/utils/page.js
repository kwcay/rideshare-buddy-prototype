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

const showErrorPage = (returnPage, errorMsg) => {
  document.querySelector('#error-page').dataset.returnPage = returnPage;
  document.querySelector('#error-page p').innerHTML = errorMsg;
  setActivePage('error');
};
