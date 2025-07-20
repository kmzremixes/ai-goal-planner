export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
}

export interface DailyData {
  transactions: Transaction[];
  notebook: string;
}

export interface AllRecords {
  [date: string]: DailyData;
}
