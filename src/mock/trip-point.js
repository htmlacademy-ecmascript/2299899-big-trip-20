import { getRandomArrayElement, getRandomInt } from '../utils.js';
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
    type: getRandomArrayElement(TRIP_POINTS_TYPES),
    name: 'Add luggage',
    price: 30,
  },
  {
    type: getRandomArrayElement(TRIP_POINTS_TYPES),
    name: 'Switch to comfort class',
    price: 100,
  },
  {
    type: getRandomArrayElement(TRIP_POINTS_TYPES),
    name: 'Add meal',
    price: 15
  },
  {
    type: getRandomArrayElement(TRIP_POINTS_TYPES),
    name: 'Choose seats',
    price: 5,
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
  const lastGeneratedTime = new Date(Date.now());
  return (hours) => {
    lastGeneratedTime.setMinutes(lastGeneratedTime.getMinutes() + hours);
    return lastGeneratedTime;
  };
};

const generateTime = createTimeGenerator();

const generateMockPhotos = () => {
  const array = [];
  for (let i = 1; i <= MOCK_PHOTOS_MAX_AMOUNT; i++) {
    array.push(
      `https://loremflickr.com/248/152?random=${getRandomInt(MOCK_MAX_MINUTES)}`
    );
  }
  return array;
};

const generateMockTripPoint = () => ({
  type: getRandomArrayElement(TRIP_POINTS_TYPES),
  destination: {
    city: getRandomArrayElement(MOCK_CITIES),
    description: generateDescription(),
    photos: generateMockPhotos(),
  },
  timeStart: new Date(generateTime(0)),
  timeFinish: new Date(
    generateTime(getRandomInt(MOCK_MAX_MINUTES, MOCK_MIN_MINUTES))
  ),
  price: getRandomInt(MOCK_MAX_PRICE, MOCK_MIN_PRICE),
  offers: MOCK_OFFERS.slice(getRandomInt(MOCK_OFFERS.length)),
  isFavorite: true,
});

export { generateMockTripPoint };
