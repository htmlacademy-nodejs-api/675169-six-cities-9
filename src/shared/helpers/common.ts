import { DECIMAL_PLACES_ZERO, PASSWORD_MAX_NUMBER, PASSWORD_MIN_NUMBER } from '../constants/index.js';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function generateRandomValue(min:number, max: number, numAfterDigit = DECIMAL_PLACES_ZERO) {
  return Number(((Math.random() * (max - min)) + min).toFixed(numAfterDigit));
}

export function getRandomItems<T>(items: T[]):T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getRandomPassword(): string {
  const randomPasswordLength = generateRandomValue(PASSWORD_MIN_NUMBER,PASSWORD_MAX_NUMBER);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';

  for (let i = 0; i < randomPasswordLength; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'UNKNOWN ERROR';
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}
