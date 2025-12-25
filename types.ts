
export interface ZodiacSign {
  id: string;
  name: string;
  dateRange: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  icon: string;
}

export interface ReadingResult {
  horoscope: string;
  faceAnalysis: string;
  palmAnalysis: string;
  futurePrediction: string;
  luckyNumbers: number[];
  spiritAnimal: string;
}

export type Step = 'intro' | 'zodiac' | 'face-scan' | 'palm-scan' | 'analyzing' | 'result';
