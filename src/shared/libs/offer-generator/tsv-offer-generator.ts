import dayjs from 'dayjs';
import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomBoolean, getRandomItem, getRandomItems, getRandomPassword } from '../../helpers/index.js';
import { SEMICOLON } from '../../constants/index.js';
import { OfferGenerator } from './index.js';

// constants
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const RATING_MIN = 1;
const RATING_MAX = 5;

const ROOMS_NUMBER_MIN = 1;
const ROOMS_NUMBER_MAX = 8;

const RENT_PRICE_MIN = 100;
const RENT_PRICE_MAX = 100000;

const GUESTS_NUMBER_MIN = 1;
const GUESTS_NUMBER_MAX = 10;

const LATITUDE = 90;
const LONGITUDE = 180;


export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem<string>(this.mockData.cities);
    const preview = getRandomItem<string>(this.mockData.previews);
    const images = this.mockData.images;
    const premium = getRandomBoolean();
    const rating = generateRandomValue(RATING_MIN, RATING_MAX, 1);
    const housingType = getRandomItem<string>(this.mockData.housingTypes);
    const roomsNumber = generateRandomValue(ROOMS_NUMBER_MIN, ROOMS_NUMBER_MAX);
    const guestsNumber = generateRandomValue(GUESTS_NUMBER_MIN, GUESTS_NUMBER_MAX);
    const rentPrice = generateRandomValue(RENT_PRICE_MIN, RENT_PRICE_MAX);
    const comforts = getRandomItems<string>(this.mockData.comforts);
    const coordinate = [generateRandomValue(-LATITUDE, LATITUDE, 4), generateRandomValue(-LONGITUDE, LONGITUDE, 4)].join(SEMICOLON);

    const authorName = getRandomItem<string>(this.mockData.authorNames);
    const authorEmail = getRandomItem<string>(this.mockData.emails);
    const authorAvatar = getRandomItem<string>(this.mockData.avatars);
    const authorPassword = getRandomPassword();
    const authorStatus = getRandomBoolean();

    const author = [authorName, authorEmail,authorAvatar,authorPassword,authorStatus ].join(SEMICOLON);

    const result = [
      title,
      description,
      postDate,
      city,
      preview,
      images,
      premium,
      rating,
      housingType,
      roomsNumber,
      guestsNumber,
      rentPrice,
      comforts,
      coordinate,
      author
    ].join('\t');

    return result;
  }
}
