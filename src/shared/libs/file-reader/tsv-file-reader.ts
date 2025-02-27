import EventEmitter from 'node:events';
import { FileReader } from './file-reader.interface.js';
import { CityEnum, HousingEnum } from '../../enums/index.js';
import { ComfortList, ComfortType, Coordinate, Image, User } from '../../types/index.js';
import { NEWLINE, SEMICOLON, TAB_SPACE } from '../../constants/index.js';
import { createReadStream } from 'node:fs';
import { Offer } from '../../types/offer.type.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(
    private readonly filename: string
  ) {
    super();
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
      author,
    ] = line.split(TAB_SPACE);

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
      author: this.parseUser(author)
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
    const [name, email, image, pro] = userString.split(SEMICOLON);

    return {
      name,
      email,
      image: { image },
      pro: this.parseBoolean(pro)
    };
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      nextLinePosition = remainingData.indexOf(NEWLINE);

      while (nextLinePosition >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);

        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });

        nextLinePosition = remainingData.indexOf(NEWLINE);
      }
    }

    this.emit('end', importedRowCount);
  }
}
