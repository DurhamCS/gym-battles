import './BuilderApp.css';
import Header from './workout_modules/Header.js';
import InteractiveScreen from './workout_modules/InteractiveScreen.js';


function BuilderApp() {
  return (
    <div className="BuilderApp">
      <div className="Header">
        <Header />
      </div>
      <div className="InteracticeScreen">
        <InteractiveScreen />
      </div>
     </div>
  );
}

export default BuilderApp;
