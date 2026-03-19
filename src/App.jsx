import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Game from "./components/Game.jsx";
import HUD from "./components/HUD.jsx";
import Lobby from "./components/Lobby.jsx";
import { GameStateProvider } from "./state/GameState.jsx";

var DEFAULT_COLORS = {
  hair: "#2A1E14",
  shirt: "#5A6A58",
  pants: "#3A3E48",
  skin: "#D4AA80",
  gender: "girl",
  hairStyle: "long",
};

function App() {
  var _s = useState("lobby");
  var screen = _s[0], setScreen = _s[1];

  var _c = useState(DEFAULT_COLORS);
  var characterColors = _c[0], setCharacterColors = _c[1];

  var _sd = useState(null);
  var initialSaveData = _sd[0], setInitialSaveData = _sd[1];

  var saveSlotRef = useRef(1);

  function handleStart(colors, saveData, slot) {
    setCharacterColors(colors);
    setInitialSaveData(saveData);
    saveSlotRef.current = slot;
    setScreen("game");
  }

  if (screen === "lobby") {
    return (
      <Lobby
        characterColors={characterColors}
        setCharacterColors={setCharacterColors}
        onStart={handleStart}
      />
    );
  }

  return (
    <GameStateProvider
      characterColors={characterColors}
      initialSaveData={initialSaveData}
      saveSlot={saveSlotRef}
    >
      <div style={{ width: "100%", height: "100vh", background: "#1A2A1A" }}>
        <Canvas
          shadows
          camera={{ fov: 60, near: 0.1, far: 500, position: [60, 12, 68] }}
          style={{ width: "100%", height: "100%" }}
        >
          <Game />
        </Canvas>
        <HUD />
      </div>
    </GameStateProvider>
  );
}

export default App;
