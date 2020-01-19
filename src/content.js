/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

(WebExt => {
  if (!WebExt) {
    return logger.error('WebExtensions API not found.');
  }

  messageListeners.forEach(listener => WebExt
    .runtime
    .onMessage
    .addListener(listener));

})(browser || chrome);
