import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
  const parts = course.parts

  const Header=({course}) => {
    return <h1>{course.name}</h1>
  }

  const Part = ({ name, exercises }) => {
  return <p>{name} {exercises}</p>
}

const Content = ({parts}) => (
    <div>
      {parts.map((part, index) => (
      <Part key={index} name={part.name} exercises={part.exercises} />
    ))}
    </div>
  )

const Total = ({parts}) => {
    const total = parts[0].exercises + parts[1].exercises + parts[2].exercises
    return <p>Number of exercises {total}</p>
}

   return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  ) 
  
}

export default App