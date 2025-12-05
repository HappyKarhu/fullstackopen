type CoursePart = {
  name: string;
  exerciseCount: number;
};

type HeaderProps = {
  name: string;
};

type CourseProps = {
  parts: CoursePart[];
};

type TotalProps = {
  total: number;
};

const Header = ({ name }: HeaderProps) => <h1>Course name: {name}</h1>;

const Content = ({ parts }: CourseProps) => {
  return (<div>
    {parts.map(part => (
        <p key={part.name}>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </div>
  );
}

const Total = ({ total }: TotalProps) => <p>Total sum of exercises: {total}</p>;

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [] = [
    {
      name: "Fundamentals of Computer Science",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 8
    },
    {
      name: "Deeper type usage",
      exerciseCount: 16
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};

export default App;