import { filter } from '../utils/filter.js';

const generateFilter = (tripPoints) =>
  Object.entries(filter).map(([filterType, filterTripPoints]) => ({
    type: filterType,
    count: filterTripPoints(tripPoints).length,
  }));

export { generateFilter };
