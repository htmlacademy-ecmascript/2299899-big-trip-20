const TRIP_POINTS_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];
const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const TIME_DELTA_FORMAT = 'DD[D] HH[H] mm[M]';
const DATETIME_FORM_FORMAT = 'DD/MM/YY HH:mm';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const FilterTypeMessages = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
};

export {
  TRIP_POINTS_TYPES,
  DATE_FORMAT,
  TIME_FORMAT,
  TIME_DELTA_FORMAT,
  DATETIME_FORM_FORMAT,
  FilterType,
  SortType,
  FilterTypeMessages,
};
