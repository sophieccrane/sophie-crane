export interface Race {
  id: string;
  name: string;
  date: string;
  distanceMeters: number;
  elevationGainMeters: number;
  movingTimeSeconds: number;
  points: [number, number][];
  bounds: [[number, number], [number, number]];
}
