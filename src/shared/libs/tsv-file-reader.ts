import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer } from '../types/offer.type.js';
import { CityEnum, HousingEnum } from '../enums/index.js';
import { ComfortList, ComfortType, Coordinate, Image, User } from '../types/index.js';
import { SEMICOLON } from '../constants/index.js';


export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
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
      user,
    ] = line.split('\t');

    return {
      title,
      description,
      postDate: new Date(postDate),
      city: city as CityEnum,
      preview: { image: preview},
      images: this.parseImages(images),
      premium: this.parseBoolean(premium),
      rating: Number(parseFloat(rating).toFixed(1)),
      housingType: housingType as HousingEnum,
      roomsNumber: Number(roomsNumber),
      guestsNumber: Number(guestsNumber),
      rentPrice: Number(rentPrice),
      comforts: this.parseComforts(comforts),
      coordinate: this.parseCoordintates(coordinate),
      author: this.parseUser(user)
    };
  }

  private parseImages(imagesString: string): Image[] {
    return imagesString.split(SEMICOLON).map((image) => ({ image }));
  }

  private parseBoolean(booleanSting: string): boolean {
    return booleanSting.toLowerCase() === 'true';
  }

  private parseComforts(comfortsString: string): ComfortList {
    const items = comfortsString.split(SEMICOLON).map((item) => item.trim());

    const validItems: ComfortType[] = items as ComfortType[];
    return validItems as unknown as ComfortList;
  }

  private parseCoordintates(coordintatesString: string): Coordinate {
    const [latitude, longitude] = coordintatesString.split(SEMICOLON);
    const result = {latitude: Number(latitude), longitude: Number(longitude)};
    return result;
  }

  private parseUser(userString: string): User {
    const [name, email, image, password, pro] = userString.split(SEMICOLON);

    return {
      name,
      email,
      image: { image },
      password,
      pro: this.parseBoolean(pro)
    };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
