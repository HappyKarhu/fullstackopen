import { useEffect, useState } from 'react'
import './App.css'
import type { NonSensitiveDiaryEntry } from "./types";
import { getAllDiaries, createDiary } from "./services/diaryService";

interface NewDiaryEntry {
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

function App() {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [newDiary, setNewDiary] = useState<NewDiaryEntry>({
    date: '',
    weather: '',
    visibility: '',
    comment: '',
  });

  useEffect(() => {
    getAllDiaries().then(data => setDiaries(data));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiary({ ...newDiary, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const addedDiary = await createDiary(newDiary);
    setDiaries([...diaries, addedDiary]);
    setNewDiary({ date: '', weather: '', visibility: '', comment: '' });
  };

  return (
      <div>
        <h2>Add new entry</h2>
        <form onSubmit={handleSubmit}>
        <input
          type="text" //date is automaticlly calendar format if text would be text
          name="date"
          placeholder="YYYY-MM-DD"
          value={newDiary.date}
          onChange={handleChange} 
        />
        <input
          type="text"
          name="weather"
          placeholder="Weather"
          value={newDiary.weather}
          onChange={handleChange}
        />
        <input
          type="text"
          name="visibility"
          placeholder="Visibility"
          value={newDiary.visibility}
          onChange={handleChange}
        />
        <input
          type="text"
          name="comment"
          placeholder="Comment"
          value={newDiary.comment}
          onChange={handleChange}
        />
        <button type='submit'>add</button>
      </form>

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