export enum ScreensaverType {
  None = 'NONE',
  Bubbles = 'BUBBLES',
  Matrix = 'MATRIX',
  MatrixGold = 'MATRIX_GOLD',
  SolarSystem = 'SOLAR_SYSTEM',
  AIDreamscape = 'AI_DREAMSCAPE',
}

export type MonetizationType = 'FREE' | 'ONE_TIME_PURCHASE' | 'SUBSCRIPTION';

export interface ScreensaverConfig {
  id: ScreensaverType;
  name: string;
  description: string;
  thumbnail: string;
  monetizationType: MonetizationType;
  priceDisplay?: string; // e.g., "$1.99"
  tags: string[];
}

export interface Bubble {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}
