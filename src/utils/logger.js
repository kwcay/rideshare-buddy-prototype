/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

const logger = {
  debug: (...messages) => IS_DEV_ENV && console.log('[debug]', ...messages),
  info: (...messages) => IS_DEV_ENV && console.log('[info]', ...messages),
  warning: (...messages) => console.log('[warning]', ...messages),
  error: (...messages) => console.error( ...messages),
};
