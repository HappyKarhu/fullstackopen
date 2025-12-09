import { useEffect, useState } from 'react'
import './App.css'
import type { NonSensitiveDiaryEntry } from "./types";
import { getAllDiaries, createDiary } from "./services/diaryService";
import {Weather, Visibility} from "./types";

interface NewDiaryEntry { date: string; weather: Weather; visibility: Visibility; comment?: string; }

function App() {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [newDiary, setNewDiary] = useState<NewDiaryEntry>({
    date: '',
    weather: Weather.Sunny, //default value
    visibility: Visibility.Good, //default value
    comment: '',
  });

  useEffect(() => {
    getAllDiaries().then(data => setDiaries(data));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiary({ ...newDiary, [event.target.name]: event.target.value });
  };

  const [error, setError] = useState<string | null>(null);

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const addedDiary = await createDiary(newDiary);
      setDiaries([...diaries, addedDiary]);
      setNewDiary({
        date: '',
        weather: Weather.Sunny,
        visibility: Visibility.Good,
        comment: ''
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  return (
      <div>
        <h2>Add new entry</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
        <input
          type="date" //date is automaticlly calendar format if text would be text
          name="date"
          value={newDiary.date}
          onChange={handleChange} 
        />
        
        <div>
          <label>Weather: </label>
          {Object.values(Weather).map(w => (
            <label key={w}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={newDiary.weather === w}
                onChange={handleChange}
              />
              {w}
            </label>
          ))}
        </div>

        <div>
          <label>Visibility: </label>
          {Object.values(Visibility).map(v => (
            <label key={v}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={newDiary.visibility === v}
                onChange={handleChange}
              />
              {v}
            </label>
          ))}
        </div>
        <div>
          <label>Comment: </label>
          <input
            type="text"
            name="comment"
            value={newDiary.comment}
            onChange={handleChange}
          />
        </div>

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