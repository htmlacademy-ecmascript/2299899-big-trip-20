import dayjs from 'dayjs';
import { FilterType } from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints,
  [FilterType.FUTURE]: (tripPoints) =>
    tripPoints.filter(
      (point) => dayjs(point.timeStart).get('date') > dayjs().get('date')
    ),
  [FilterType.PRESENT]: (tripPoints) =>
    tripPoints.filter(
      (point) =>
        dayjs(point.timeStart).get('date') <= dayjs().get('date') &&
        dayjs(point.timeFinish).get('date') >= dayjs().get('date')
    ),
  [FilterType.PAST]: (tripPoints) =>
    tripPoints.filter(
      (point) => dayjs(point.timeFinish).get('date') < dayjs().get('date')
    ),
};

export { filter };
