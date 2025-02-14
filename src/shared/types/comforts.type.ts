import { ComfortsEnum } from '../enums/index.js';
export type ComfortType = ComfortsEnum;

export type ComfortList = readonly [ComfortType, ...ComfortType[]];
