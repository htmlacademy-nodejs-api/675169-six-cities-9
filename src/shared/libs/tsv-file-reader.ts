import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer } from '../types/offer.type.js';
import { CityEnum, HousingEnum } from '../enums/index.js';
import { ComfortList, ComfortType, Coordinate, Image, User } from '../types/index.js';


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
      favorite,
      rating,
      housingType,
      roomsNumber,
      guestsNumber,
      rentPrice,
      comforts,
      author,
      coordinate,
      user,
    ] = line.split('\t');

    return {
      title,
      description,
      postDate: new Date(postDate),
      city: CityEnum[city as CityEnum],
      preview: { image: preview},
      images: this.parseImages(images),
      premium: this.parseBooleen(premium),
      favorite: this.parseBooleen(favorite),
      rating: Number(parseFloat(rating).toFixed(1)),
      housingType: housingType as HousingEnum,
      roomsNumber: Number(roomsNumber),
      guestsNumber: Number(guestsNumber),
      rentPrice: Number(rentPrice),
      comforts: this.parseComforts(comforts),
      author,
      coordinate: this.parseCoordintates(coordinate),
      user: this.parseUser(user)
    };
  }

  private parseImages(imagesString: string): Image[] {
    return imagesString.split(';').map((image) => ({ image }));
  }

  private parseBooleen(booleanSting: string): boolean {
    return booleanSting === 'true';
  }

  private parseComforts(comfortsString: string): ComfortList {
    const items = comfortsString.split(';').map((item) => item.trim());

    const validItems: ComfortType[] = items as ComfortType[];
    return validItems as unknown as ComfortList;
  }

  private parseCoordintates(coordintatesString: string): Coordinate {
    const [latitude, longitude] = coordintatesString.split(';');
    const result = {latitude: Number(latitude), longitude: Number(longitude)};
    return result;
  }

  private parseUser(userString: string): User {
    const [name, email, image, password, pro] = userString.split(';');

    return {
      name,
      email,
      image: { image },
      password,
      pro: pro === 'true'
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
