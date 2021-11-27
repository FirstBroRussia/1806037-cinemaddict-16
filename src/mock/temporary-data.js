import {getRandomNumber} from '../utils/util.js';

const MIN_LENGTH_COMMENTS_LIST = 0;
const MAX_LENGTH_COMMENTS_LIST = 5;

const MIN_LENGTH_DATA_FILMS = 15;
const MAX_LENGTH_DATA_FILMS = 20;

const MIN_LENGTH_STRING_DESCRIPTION = 1;
const MAX_LENGTH_STRING_DESCRIPTION = 4;

const MIN_LENGTH_STRING_SCREENWRITER = 1;
const MAX_LENGTH_STRING_SCREENWRITER = 4;

const MIN_LENGTH_STRING_ACTORS = 4;
const MAX_LENGTH_STRING_ACTORS = 16;

const MIN_LENGTH_STRING_GENRES = 1;
const MAX_LENGTH_STRING_GENRES = 3;

const NAME_FILMS = [
  'Made for each other',
  'Popeye meets sindbad',
  'Sagebrush trail',
  'Santa claus conquers the martians',
  'The dance of life',
  'The Great Flamarion',
  'The man with the golden arm'
];

const PATH_FOR_PICTURE = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg'
];

const GENRE = [
  'Melodrama',
  'Cartoon',
  'Comedy',
  'Drama',
  'Fantastic',
  'Musical',
  'Thriller'
];

const DURATION = [
  '1h 40m',
  '1h 16m',
  '54m',
  '1h 21m',
  '1h 55m',
  '1h 18m',
  '1h 59m'
];

const COMMENTS = [
  'Фильм пушка!',
  'Неплохой фильм, на один раз с пивком потянет=)',
  'Игра актёров средняя, они всё и испортили.',
  'Спецэффекты очень плохие=(',
  'Не советую смотреть этот фильм, потеря времени.',
  'ОЧЕНЬ ПЛОХОЙ ФИЛЬМ!!!'
];

const ORIGINAL_NAME_FILMS = [
  'Made for each other',
  'Popeye meets sindbad',
  'Sagebrush trail',
  'Santa claus conquers the martians',
  'The dance of life',
  'The Great Flamarion',
  'The man with the golden arm'
];

const DIRECTOR = [
  'Александр Овечкин',
  'Дмитрий Толстой',
  'Пётр Первый',
  'Григорий Оборванцев',
  'Сергей Кутерьма',
];

const SCREEMWRITER = [
  'Шакро Молодой',
  'Рембо Кровский',
  'Арни Старый',
  'Бенжамин Баттон',
  'Алексей Сплит',
];

const ACTORS = [
  'Василий Пилюлин',
  'Виктор Пелевин',
  'Стас Метёлкин',
  'Аристарх Позолотов',
  'Александр Люсин',
];

const AGE_RATING = [
  '0+',
  '6+',
  '12+',
  '16+',
  '18+'
];

const COUNTRY = [
  'USSR',
  'USA',
  'Italia',
  'The Great Britain',
  'India'
];


const DESCRIPTIONS_LIST = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  .split(/\.\s*/);

const getRandomDescriptionsList = () => Array.from({length: getRandomNumber(MIN_LENGTH_STRING_DESCRIPTION, MAX_LENGTH_STRING_DESCRIPTION)})
  .map( () => DESCRIPTIONS_LIST[getRandomNumber(0, DESCRIPTIONS_LIST.length - 1)])
  .join('. ');

const getRandomScreenWrittersList = () => Array.from({length: getRandomNumber(MIN_LENGTH_STRING_SCREENWRITER, MAX_LENGTH_STRING_SCREENWRITER)})
  .map( () => SCREEMWRITER[getRandomNumber(0, SCREEMWRITER.length - 1)])
  .join(', ');

const getRandomActorsList = () => Array.from({length: getRandomNumber(MIN_LENGTH_STRING_ACTORS, MAX_LENGTH_STRING_ACTORS)})
  .map( () => ACTORS[getRandomNumber(0, ACTORS.length - 1)])
  .join(', ');

const getRandomGenresList = () => Array.from({length: getRandomNumber(MIN_LENGTH_STRING_GENRES, MAX_LENGTH_STRING_GENRES)})
  .map( () => GENRE[getRandomNumber(0, GENRE.length - 1)])
  .join(', ');


function getRandomCommentsListForRandomFilm() {
  return Array.from({ length: getRandomNumber(MIN_LENGTH_COMMENTS_LIST, MAX_LENGTH_COMMENTS_LIST) })
    .map(() => COMMENTS[getRandomNumber(0, COMMENTS.length - 1)]);
}


const createFilmsData = () => Array.from({length: getRandomNumber(MIN_LENGTH_DATA_FILMS, MAX_LENGTH_DATA_FILMS)})
  .map( (item, index) => ({
    id: index,
    img: `./images/posters/${PATH_FOR_PICTURE[getRandomNumber(0, PATH_FOR_PICTURE.length - 1)]}`,
    name: NAME_FILMS[getRandomNumber(0, NAME_FILMS.length - 1)],
    originalName: ORIGINAL_NAME_FILMS[getRandomNumber(0, ORIGINAL_NAME_FILMS.length - 1)],
    rating: getRandomNumber(0, 10, true),
    director: DIRECTOR[getRandomNumber(0, DIRECTOR.length - 1)],
    screenwritters: getRandomScreenWrittersList(),
    actors: getRandomActorsList(),
    releaseYear: getRandomNumber(1920, 1980),
    releaseFullFormat: 'D MMMM YY',
    duration: DURATION[getRandomNumber(0, DURATION.length - 1)],
    country: COUNTRY[getRandomNumber(0, COUNTRY.length - 1)],
    genre: getRandomGenresList(),
    description: getRandomDescriptionsList(),
    ageRating: AGE_RATING[getRandomNumber(0, AGE_RATING.length - 1)],
    comments: getRandomCommentsListForRandomFilm(),
    isWatchlist: Boolean(getRandomNumber(0,1)),
    isWatched: Boolean(getRandomNumber(0,1)),
    isFavorite: Boolean(getRandomNumber(0,1)),
  }));

const filmsData = createFilmsData();

export {filmsData};
