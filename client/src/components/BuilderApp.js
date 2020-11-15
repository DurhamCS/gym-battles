import "./BuilderApp.css";
import Header from "./workout_modules/Header.js";
import InteractiveScreen from "./workout_modules/InteractiveScreen.js";
import React from "react";

function BuilderApp() {
  return (
    <div className="BuilderApp" style={{backgroundColor: "transparent"}}>
      <div className="InteracticeScreen">
        <InteractiveScreen />
      </div>
    </div>
  );
}

export default BuilderApp;
