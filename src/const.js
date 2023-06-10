import dayjs from 'dayjs';

const TRIP_POINTS_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];
const DATE_FORMAT = 'MMM D';
const INFO_DATE_FORMAT = 'D MMM';
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

const UserAction = {
  UPDATE_TRIP_POINT: 'UPDATE_TRIP_POINT',
  ADD_TRIP_POINT: 'ADD_TRIP_POINT',
  DELETE_TRIP_POINT: 'DELETE_TRIP_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const BLANK_TRIP_POINT = {
  type: TRIP_POINTS_TYPES[0],
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  timeStart: dayjs().toDate(),
  timeFinish: dayjs().toDate(),
  price: 0,
  isFavorite: false,
  offers: [],
};

export {
  TRIP_POINTS_TYPES,
  DATE_FORMAT,
  INFO_DATE_FORMAT,
  TIME_FORMAT,
  TIME_DELTA_FORMAT,
  DATETIME_FORM_FORMAT,
  FilterType,
  SortType,
  FilterTypeMessages,
  UserAction,
  UpdateType,
  BLANK_TRIP_POINT,
};
