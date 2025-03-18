export interface Elevator {
  id: number;
  currentFloor: number;
  direction: string | null;
  queue: number[];
  doorOpen: boolean;
}