import dayjs from 'dayjs';
import { getRandomArrayElement, getRandomInt } from '../utils/common.js';
import { TRIP_POINTS_TYPES } from '../const.js';

const MOCK_MIN_MINUTES = 15;
const MOCK_MAX_MINUTES = 1500;
const MOCK_MIN_PRICE = 10;
const MOCK_MAX_PRICE = 200;
const MOCK_CITIES = [
  'Barcelona',
  'Reykjavik',
  'Malaga',
  'Warsaw',
  'York',
  'Gdansk',
  'Lodz',
  'Bremen',
  'Sheffield',
];
const MOCK_DESCRIPTION_MAX_LENGTH = 5;
const MOCK_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];
const MOCK_PHOTOS_MAX_AMOUNT = 5;
const MOCK_OFFERS = [
  {
    type: 'luggage',
    title: 'Add luggage',
    price: 30,
    tripPointsTypes: ['Bus', 'Train', 'Ship', 'Drive', 'Flight'],
  },
  {
    type: 'comfort',
    title: 'Comfort class',
    price: 100,
    tripPointsTypes: ['Train', 'Ship', 'Flight'],
  },
  {
    type: 'meal',
    title: 'Add meal',
    price: 15,
    tripPointsTypes: [
      'Train',
      'Ship',
      'Flight',
      'Check-in',
    ],
  },
  {
    type: 'seats',
    title: 'Choose seats',
    price: 5,
    tripPointsTypes: ['Bus', 'Train', 'Ship', 'Flight'],
  },
];

const generateDescription = () => {
  const generatedSet = new Set();
  while (generatedSet.size < getRandomInt(MOCK_DESCRIPTION_MAX_LENGTH, 1)) {
    const randomSentence =
      MOCK_DESCRIPTIONS[getRandomInt(MOCK_DESCRIPTIONS.length)];
    if (!generatedSet.has(randomSentence)) {
      generatedSet.add(randomSentence);
    }
  }
  return Array.from(generatedSet).join(' ');
};

const createTimeGenerator = () => {
  let lastGeneratedTime = dayjs().subtract(getRandomInt(3), 'day');
  return (minutes) => {
    lastGeneratedTime = lastGeneratedTime.add(minutes, 'm');
    return lastGeneratedTime;
  };
};

const createIdGenerator = () => {
  let lastGeneratedId = 0;
  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const generateTime = createTimeGenerator();
const generateId = createIdGenerator();

const generateMockPhotos = () => {
  const array = [];
  for (let i = 1; i <= MOCK_PHOTOS_MAX_AMOUNT; i++) {
    array.push(
      `https://loremflickr.com/248/152?random=${getRandomInt(MOCK_MAX_MINUTES)}`
    );
  }
  return array;
};

const generateMockTripPoint = () => {
  const mockTripPoint = {
    id: generateId(),
    type: getRandomArrayElement(TRIP_POINTS_TYPES),
    destination: {
      city: getRandomArrayElement(MOCK_CITIES),
      description: generateDescription(),
      photos: generateMockPhotos(),
    },
    timeStart: generateTime(0).toDate(),
    timeFinish: generateTime(
      getRandomInt(MOCK_MAX_MINUTES, MOCK_MIN_MINUTES)
    ).toDate(),
    price: getRandomInt(MOCK_MAX_PRICE, MOCK_MIN_PRICE),
    isFavorite: getRandomInt(1),
  };
  mockTripPoint.offers = MOCK_OFFERS.filter((offer) =>
    offer.tripPointsTypes.includes(mockTripPoint.type)
  );
  mockTripPoint.offers = mockTripPoint.offers.slice(
    getRandomInt(mockTripPoint.offers.length)
  );
  return mockTripPoint;
};

export { generateMockTripPoint, MOCK_CITIES, MOCK_OFFERS, generateMockPhotos, generateDescription, generateId };
