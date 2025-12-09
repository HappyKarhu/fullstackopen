export interface NonSensitiveDiaryEntry {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment?: string; //optinal, considered sensitive
}