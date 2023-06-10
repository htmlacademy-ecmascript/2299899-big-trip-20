import dayjs from 'dayjs';

const sortDate = (tripPointA, tripPointB) =>
  dayjs(tripPointA.timeStart).diff(dayjs(tripPointB.timeStart));

const sortTime = (tripPointA, tripPointB) => {
  const deltaA = dayjs(tripPointA.timeFinish).diff(dayjs(tripPointA.timeStart));
  const deltaB = dayjs(tripPointB.timeFinish).diff(dayjs(tripPointB.timeStart));
  return deltaB - deltaA;
};

const sortPrice = (tripPointA, tripPointB) =>
  tripPointB.price - tripPointA.price;

export { sortDate, sortTime, sortPrice };
