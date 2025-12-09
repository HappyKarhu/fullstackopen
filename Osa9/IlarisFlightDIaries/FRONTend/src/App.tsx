import { useEffect, useState } from 'react'
import './App.css'
import type { NonSensitiveDiaryEntry } from "./types";
import { getAllDiaries } from "./services/diaryService";

function App() {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaries().then(data => setDiaries(data));
  }, []);

  return (
      <div>
      <h2>Diary entries</h2>
      {diaries.length === 0 ? (
        <p>Loading diaries...</p>
      ) : (
        diaries.map(diary => (
        <div key={diary.id}>
          <h3 className="diary-date">{diary.date}</h3>
          <p><span className="diary-label">Weather:</span> {diary.weather}</p>
          <p><span className="diary-label">Visibility:</span> {diary.visibility}</p>
        </div>

        ))
      )}
    </div>
  );
}

export default App