import type { NonSensitiveDiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = "/api/diaries";

export const getAllDiaries = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const response = await fetch(baseUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch diaries");
  }

  const data: NonSensitiveDiaryEntry[] = await response.json();
  return data;
};

//to add Diary
export const createDiary = async (diary: NewDiaryEntry): Promise<NonSensitiveDiaryEntry> => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(diary),
  });

  if (!response.ok) {
    throw new Error("Failed to create diary");
  }

  const data: NonSensitiveDiaryEntry = await response.json();
  return data;
};