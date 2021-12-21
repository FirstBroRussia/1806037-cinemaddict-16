/* eslint-disable no-undef */
const INITIAL_FILMS_CARD_COUNT = 5;

const bodyElement = document.querySelector('body');
const headerBodyElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');

const controlButtons = {
  isWatchlist: 'isWatchlist',
  isWatched: 'isWatched',
  isFavorite: 'isFavorite',
};


const dayjs = require('dayjs');
const dayjsRandom = require('dayjs-random');
dayjs.extend(dayjsRandom);

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

export {getRandomNumber, getConvertedString, onEscKeydown, dayjs, INITIAL_FILMS_CARD_COUNT, bodyElement, headerBodyElement, mainElement, footerBodyElement, footerStatisticBodyElement, controlButtons};
