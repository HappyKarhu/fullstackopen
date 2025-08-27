import { useState } from 'react'

// statistics separetly
const Statistics = ({good,neutral,bad}) => {
  const Kaikki = good + neutral + bad

  if (Kaikki === 0) {
    return(
      <div>
        <h2>Palaute tilastot</h2>
        <p>Palautetta ei ole vielä annettu.</p>
      </div>
    )
  } else if (Kaikki > 0) {
    const keskiarvo = (good - bad) /Kaikki
    const prosenttiaPosiitivisaaPalautteista =  (good / Kaikki) * 100
  
  return (
    <div>
      <h2>Palaute tilastot</h2>

      <table>
        <tbody><StatisticLine text= "Hyvä" value={good}/></tbody>
        <tbody><StatisticLine text= "Neutraali" value={neutral}/></tbody>
        <tbody><StatisticLine text= "Huono" value={bad}/></tbody>
        <p><br></br></p>
        <tbody><StatisticLine text= "Yhteensä" value={Kaikki}/>
        <StatisticLine text= "Keskiarvo" value={keskiarvo}/>
        <StatisticLine text= "Positiivista" value={prosenttiaPosiitivisaaPalautteista + "%"}/></tbody>
      </table>
    </div>
    )
  }
}

const Button = ({ onClick, text }) => 
  <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td> 
    <td>{value}</td>
  </tr>
)
  

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
      <h1>Anna palautetta</h1>
      <Button onClick={() => handleFeedback('good')} text= "Hyvä" />
      <Button onClick={() => handleFeedback('neutral')}text= "Neutraali" />
      <Button onClick={() => handleFeedback('bad')}text= "Huono" />
    
      <Statistics good={good} neutral={neutral} bad={bad} />
      
    </div>
  )
}

export default App