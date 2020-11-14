import exerciseData from "./Exercisedata"
import Exercise from "./Exercise"


function Exercises() {
    const exerciseComponents = exerciseData.map(prop => <Exercise exer={prop.exer} key={prop.id} />)
    return (
        <div style=>
            {exerciseComponents}
        </div>
    )
}

export default Exercises;