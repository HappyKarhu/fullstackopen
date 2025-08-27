import { useState } from 'react'

// statistics separetly
const Statistics = ({good,neutral,bad}) => {
  const Kaikki = good + neutral + bad

  if (Kaikki === 0) {
    return(
      <div>
        <h2>statistics of feedbacks</h2>
        <p>No Feedback given, yet.</p>
      </div>
    )
  } else if (Kaikki > 0) {
    const keskiarvo = (good - bad) /Kaikki
    const prosenttiaPosiitivisaaPalautteista =  (good / Kaikki) * 100
  
  return (
    <div>
      <h2>statistics of feedbacks</h2>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {Kaikki}</p>
      <p>average {keskiarvo}</p>
      <p>positive {prosenttiaPosiitivisaaPalautteista} %</p>
    </div>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

// palaute
  const handleFeedback = (type) => {
    if (type === 'good') setGood(good + 1)
    else if (type === 'neutral') setNeutral(neutral + 1)
    else if (type === 'bad') setBad(bad + 1)
  }

  return (
    <div>
      <h1>give us feedback</h1>
      <button onClick={() => handleFeedback('good')}>good</button>
      <button onClick={() => handleFeedback('neutral')}>neutral</button>
      <button onClick={() => handleFeedback('bad')}>bad</button>
    
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App