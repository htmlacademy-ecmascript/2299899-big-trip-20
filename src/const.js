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

const DateTimeFormat = {
  INFO_DATE: 'D MMM',
  POINT_DATE: 'MMM D',
  POINT_TIME: 'HH:mm',
  POINT_TIME_DELTA: 'DD[D] HH[H] mm[M]',
  FORM_DATE_TIME: 'DD/MM/YY HH:mm',
};

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
  DateTimeFormat,
  FilterType,
  SortType,
  FilterTypeMessages,
  UserAction,
  UpdateType,
  BLANK_TRIP_POINT,
};
