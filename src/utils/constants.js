/**
 * Copyright (c) 2020-present, Kwahu & Cayes.
 */

const WebExt = (browser || chrome);

const ENV = 'development';
const IS_DEV_ENV = ENV === 'development';

const MAX_PARALLEL_REQUESTS = 3;

const TAB_REQUEST_TRIPS_DETAILS = 'trip-details';
