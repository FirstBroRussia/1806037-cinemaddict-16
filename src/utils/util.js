
import * as he from 'he';
import * as Chart from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const ZERO_VALUE = 0;

const INITIAL_FILMS_CARD_COUNT = 5;

const errorResponse = 'errorResponse';

const FilmsWatchedValue = {
  MIN_NOVICE_VALUE: 1,
  MAX_NOVICE_VALUE: 10,
  MIN_FAN_VALUE: 11,
  MAX_FAN_VALUE: 20,
  MOVIE_BUFF_VALUE: 21,
};

const DeleteButtonState = {
  DEFAULT: 'default',
  DELETING: 'deleting',
};

const MethodsForAPI = {
  GET_MOVIES: 'getMovies',
  PUT_MOVIES: 'putMovies',
  GET_COMMENTS: 'getComments',
  POST_COMMENT: 'postComment',
  DELETE_COMMENT: 'deleteComment',
};

const ControlButtons = {
  isWatchlist: 'watchlist',
  isWatched: 'history',
  isFavorite: 'favorite',
};

const FilterMode = {
  ALL_MOVIES: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite',
};

const SortMode = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const MethodsForPopup = {
  CREATE: 'create',
  DELETE: 'delete',
};

const getConvertedString = (string, specifiedLength) => string.length > specifiedLength ? `${string.slice(0, specifiedLength - 1)}...` : string;

const onEscKeydown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc' || evt.key === 27) {
    evt.preventDefault();
    return true;
  }
};

const getDurationFormatTime = (value) => {
  const HOUR_IN_MINUTES = 60;
  const time = Number(value);

  if (time < HOUR_IN_MINUTES) {
    return dayjs.duration(time, 'minutes').format('mm[m]');
  }
  if ((time % HOUR_IN_MINUTES) === 0) {
    return dayjs.duration(time, 'minutes').format('H[h]');
  }
  return dayjs.duration(time, 'minutes').format('H[h] mm[m]');
};

const getReleaseDateFormat = (value) => dayjs(`${value}`).format('DD MMMM YYYY');

const getCreatingCommentDateFormat = (value) => dayjs(`${value}`).format('YYYY/MM/DD HH:mm');

const setHeadShakingStyleAnimation = (element) => {
  element.classList.add('shake');
  setTimeout( () => element.classList.remove('shake'), 800);
};

export {errorResponse, FilmsWatchedValue, DeleteButtonState, ZERO_VALUE, he, Chart, ChartDataLabels, getDurationFormatTime, getReleaseDateFormat, getCreatingCommentDateFormat, getConvertedString, onEscKeydown, dayjs,  MethodsForAPI, INITIAL_FILMS_CARD_COUNT, ControlButtons, FilterMode, SortMode, MethodsForPopup, setHeadShakingStyleAnimation};
