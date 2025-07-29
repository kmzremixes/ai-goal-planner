export interface DailyData {
  notebook: string;
}

export interface AllRecords {
  [date: string]: DailyData;
}
