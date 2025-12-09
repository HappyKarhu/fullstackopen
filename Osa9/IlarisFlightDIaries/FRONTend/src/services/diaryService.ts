import type { NonSensitiveDiaryEntry } from "../types";

const baseUrl = "/api/diaries";

export const getAllDiaries = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const response = await fetch(baseUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch diaries");
  }

  const data: NonSensitiveDiaryEntry[] = await response.json();
  return data;
};