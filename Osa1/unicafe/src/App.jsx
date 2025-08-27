import { useState } from 'react'

const Statistics = (props) => {
  return (
    <div>
      <h2>statistics of feedbacks</h2>
      <p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
    </div>
  )
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

  
  const yhteenlasketunMaara = good + neutral + bad
  // keskiarvo - neutraali on 0
  const keskiarvo = yhteenlasketunMaara === 0 ? 0 : (good - bad) / yhteenlasketunMaara
  const prosenttiaPosiitivisaaPalautteista = yhteenlasketunMaara === 0 ? 0 : (good / yhteenlasketunMaara) * 100

  return (
    <div>
      <h1>give us feedback</h1>
      <button onClick={() => handleFeedback('good')}>good</button>
      <button onClick={() => handleFeedback('neutral')}>neutral</button>
      <button onClick={() => handleFeedback('bad')}>bad</button>
    
      <Statistics good={good} neutral={neutral} bad={bad} />

      <p>all {yhteenlasketunMaara}</p>
      <p>average {keskiarvo}</p>
      <p>positive {prosenttiaPosiitivisaaPalautteista}</p>

    </div>
  )
}

export default App