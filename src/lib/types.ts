
export interface StoredImage {
  src: string;
  timestamp: string;
}

export interface DailyData {
  notebook: string;
  images: StoredImage[];
}

export interface AllRecords {
  [date: string]: DailyData;
}
