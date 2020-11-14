import './App.css';
import Header from './workout_modules/Header.js';
import Exercises from './workout_modules/Exercises.js';
import InteractiveScreen from './workout_modules/InteractiveScreen.js';


function App() {
  return (
    <div className="App">
      <Header />
      <InteractiveScreen />
      <Exercises />
     </div>
  );
}

export default App;
