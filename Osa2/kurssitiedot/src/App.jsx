import Course from './components/course'

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 14,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 6,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 1,
        id: 3
      },
      {
        name: 'Node.js',
        exercises: 0,
        id: 4
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App