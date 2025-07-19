export interface DailyData {
  idPhotos: number;
  photoEditing: number;
  designWork: number;
  otherIncome: number;
  notebook: string;
}

export interface AllRecords {
  [date: string]: DailyData;
}
