import { useState } from 'react'


const VoteButton =({onClick, votes}) => 
  <button onClick={onClick}>LIke it? Vote for it</button>


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  // creates array of 0s
  const[votes, setVotes]= useState(new Array(anecdotes.length).fill(0))
  
  const anecdoteVote = () => {const copy = votes.slice()
    copy[selected] += 1;
    setVotes(copy);
  }

  // create number array
  const maxVote = Math.max(...votes)
  //find max index
  const maxIndex = votes.indexOf(maxVote)
  

  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <br />
      <br />
      <VoteButton onClick={anecdoteVote} votes={votes[selected]}/>
      <br />
      <br />
      <button onClick={()=> 
        setSelected(Math.floor(Math.random() * anecdotes.length))}> Next Anecdote 
      </button>
       <p>This anecdote has {votes[selected]} {votes[selected] === 1 ? 'vote' : 'votes'}.</p>
      <br />
      <h2>Anecdote with most votes is:</h2>
      <p>{anecdotes[maxIndex]}</p>
      <p>This winning anecdote has {maxVote} {maxVote === 1 ? 'vote' : 'votes'}.</p>
    </div>
// if 1 is vote not votes === 1 ? 'vote' : 'votes
  )
}

export default App