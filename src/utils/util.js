/* eslint-disable no-undef */
import {nanoid} from 'nanoid';

const he = require('he');

const Chart = require('chart.js');
const ChartDataLabels = require('chartjs-plugin-datalabels');

const dayjs = require('dayjs');
const dayjsRandom = require('dayjs-random');
dayjs.extend(dayjsRandom);
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const ZERO_VALUE = 0;

const MIN_NOVICE_VALUE = 1;
const MAX_NOVICE_VALUE = 10;
const MIN_FAN_VALUE = 11;
const MAX_FAN_VALUE = 20;
const MOVIE_BUFF_VALUE = 21;

const INITIAL_FILMS_CARD_COUNT = 5;

const bodyElement = document.querySelector('body');
const headerBodyElement = document.querySelector('.header');
const mainBodyElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');

const RESPONSES_FROM_SERVER = {
  SUCCESS_SERVER_RESPONSE: 200,
};

const METHODS_FOR_API = {
  GET_MOVIES: 'getMovies',
  PUT_MOVIES: 'putMovies',
  GET_COMMENTS: 'getComments',
  POST_COMMENT: 'postComment',
  DELETE_COMMENT: 'deleteComment',
};

const controlButtons = {
  isWatchlist: 'watchlist',
  isWatched: 'history',
  isFavorite: 'favorite',
};

const filterMode = {
  ALL_MOVIES: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite',
};

const sortMode = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const methodsForPopup = {
  CREATE: 'create',
  DELETE: 'delete',
  EDIT: 'edit',
};

const periods = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

function getRandomNumber(min, max, fixed) {
  if (fixed) {
    const randomFractionalNumber = (Math.random() * (max + 1 - min) + min).toFixed(1);
    return randomFractionalNumber >= max ? max : randomFractionalNumber;
  }
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

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

const deleteSectionElement = () => {
  const sectionElement = mainBodyElement.querySelector('section');
  if (sectionElement !== null) {
    sectionElement.remove();
  }
};

const getReleaseDateFormat = (value) => dayjs(`${value}`).format('DD MMMM YYYY');

const getCreatingCommentDateFormat = (value) => dayjs(`${value}`).format('YYYY/MM/DD HH:mm');

export {ZERO_VALUE, MIN_NOVICE_VALUE, MAX_NOVICE_VALUE, MIN_FAN_VALUE, MAX_FAN_VALUE, MOVIE_BUFF_VALUE, RESPONSES_FROM_SERVER, nanoid, he, Chart, ChartDataLabels, getDurationFormatTime, getReleaseDateFormat, getCreatingCommentDateFormat, getRandomNumber, getConvertedString, onEscKeydown, dayjs, deleteSectionElement, METHODS_FOR_API, INITIAL_FILMS_CARD_COUNT, bodyElement, headerBodyElement, mainBodyElement, footerBodyElement, footerStatisticBodyElement, controlButtons, filterMode, sortMode, methodsForPopup, periods};
