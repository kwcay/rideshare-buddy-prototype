/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

(WebExt => {
  if (!WebExt) {
    return console.error('WebExtensions API not found.');
  }

  messageListeners.forEach(listener => WebExt
    .runtime
    .onMessage
    .addListener(listener));

})(browser || chrome);

console.log('content.js loaded.');
