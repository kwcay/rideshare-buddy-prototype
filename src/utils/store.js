/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

const store = {
  setLocal: async keyValuePairs => WebExt.storage.local.set(keyValuePairs),
  getLocal: async keys => WebExt.storage.local.get(keys),
};

store.set = async keyValuePairs => store.setLocal(keyValuePairs);
store.get = async keys => store.getLocal(keys);
