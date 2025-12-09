import axios from 'axios';
import type { NonSensitiveDiaryEntry, NewDiaryEntry } from "../types";


const baseUrl = "/api/diaries";

export const getAllDiaries = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return response.data;
};


//to add Diary
export const createDiary = async (diary: NewDiaryEntry): Promise<NonSensitiveDiaryEntry> => {
    try {
    const response = await axios.post<NonSensitiveDiaryEntry>(baseUrl, diary, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Backend sent an error message
      throw new Error(error.response.data?.error || "Failed to create diary");
    } else {
      throw new Error("Failed to create diary");
    }
  }
};