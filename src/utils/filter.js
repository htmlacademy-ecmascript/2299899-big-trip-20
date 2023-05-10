import dayjs from 'dayjs';
import { FilterType } from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints,
  [FilterType.FUTURE]: (tripPoints) =>
    tripPoints.filter(
      (point) => point.timeStart.get('date') > dayjs().get('date')
    ),
  [FilterType.PRESENT]: (tripPoints) =>
    tripPoints.filter(
      (point) =>
        point.timeStart.get('date') <= dayjs().get('date') &&
        point.timeFinish.get('date') >= dayjs().get('date')
    ),
  [FilterType.PAST]: (tripPoints) =>
    tripPoints.filter(
      (point) => point.timeFinish.get('date') < dayjs().get('date')
    ),
};

export { filter };
