import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomBoolean, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { DECIMAL_PLACES_FOUR, DECIMAL_PLACES_ONE, GUESTS_NUMBER_MAX, GUESTS_NUMBER_MIN, LATITUDE, LONGITUDE, RATING_MAX, RATING_MIN, RENT_PRICE_MAX, RENT_PRICE_MIN, ROOMS_NUMBER_MAX, ROOMS_NUMBER_MIN, SEMICOLON, TAB_SPACE } from '../../constants/index.js';
import { OfferGenerator } from './index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const city = getRandomItem(this.mockData.cities);
    const preview = getRandomItem(this.mockData.previews);
    const images = this.mockData.images;
    const premium = getRandomBoolean();
    const rating = generateRandomValue(RATING_MIN, RATING_MAX, DECIMAL_PLACES_ONE);
    const housingType = getRandomItem(this.mockData.housingTypes);
    const roomsNumber = generateRandomValue(ROOMS_NUMBER_MIN, ROOMS_NUMBER_MAX);
    const guestsNumber = generateRandomValue(GUESTS_NUMBER_MIN, GUESTS_NUMBER_MAX);
    const rentPrice = generateRandomValue(RENT_PRICE_MIN, RENT_PRICE_MAX);
    const comforts = getRandomItems(this.mockData.comforts);
    const coordinate = [generateRandomValue(-LATITUDE, LATITUDE,DECIMAL_PLACES_FOUR), generateRandomValue(-LONGITUDE, LONGITUDE, DECIMAL_PLACES_FOUR)].join(SEMICOLON);

    const authorName = getRandomItem(this.mockData.authorNames);
    const authorEmail = getRandomItem(this.mockData.emails);
    const authorAvatar = getRandomItem(this.mockData.avatars);
    const authorStatus = getRandomBoolean();

    const author = [authorName, authorEmail,authorAvatar,authorStatus ].join(SEMICOLON);

    return [
      title,
      description,
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
    ].join(TAB_SPACE);
  }
}
