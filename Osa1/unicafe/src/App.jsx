import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

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
    

      <h1>statistics of feedbacks</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}

export default App
