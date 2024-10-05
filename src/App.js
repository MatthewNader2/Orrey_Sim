import React, { useEffect } from "react";
import "./App.css";
import initOrrey from "./Orrey"; // Import a function to initialize Orrey.js

function App() {
  useEffect(() => {
    // Call the function to initialize Orrey once the component is mounted
    initOrrey();
  }, []);

  return (
    <div className="App">
      {/* Fullscreen canvas where Three.js will render the scene */}
      <canvas
        id="three-canvas"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      />
    </div>
  );
}

export default App;
