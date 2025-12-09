export interface NonSensitiveDiaryEntry {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment?: string; //optinal, considered sensitive
}

export interface NewDiaryEntry {
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}