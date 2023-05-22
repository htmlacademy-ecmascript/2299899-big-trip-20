import dayjs from 'dayjs';

const sortTime = (tripPointA, tripPointB) => {
  const deltaA = dayjs(tripPointA.timeFinish).diff(dayjs(tripPointA.timeStart));
  const deltaB = dayjs(tripPointB.timeFinish).diff(dayjs(tripPointB.timeStart));
  return deltaB - deltaA;
};

const sortPrice = (tripPointA, tripPointB) =>
  tripPointB.price - tripPointA.price;

export { sortTime, sortPrice };
