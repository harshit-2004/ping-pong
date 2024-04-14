import React from 'react';
import './App.css';
import GameStart from "./components/GameStart";

function App() {
  const onRestart = () => {
    console.log("Starting a new Game");
    window.location.reload(); // Reload the page
  }

  return (
    <GameStart onRestart={onRestart} />
  );
}

export default App;