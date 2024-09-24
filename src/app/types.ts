export interface Flatmate {
  id: string;
  identifier: string;
  isBusy: boolean;
  streak: number;
  lastCleanedDate: Date | null;
  busyUntil: Date | null;
}
