import Header from './Header'
import Content from './content'



const Course = ({ course }) => {
  const exercisesSuma = course.parts.reduce((sum, part) => sum + part.exercises, 0)

console.log(exercisesSuma);
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <p><strong>Total of {exercisesSuma} {exercisesSuma === 1 ? 'exercise' : 'exercises'}.</strong></p>
      <br />
    </div>
  )
}

export default Course
