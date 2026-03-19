import { useRef } from "react";
import Ground from "./Ground.jsx";
import Water from "./Water.jsx";
import Trees from "./Trees.jsx";
import Rocks from "./Rocks.jsx";
import Bushes from "./Bushes.jsx";
import Fish from "./Fish.jsx";
import Crabs from "./Crabs.jsx";
import Houses from "./House.jsx";
import Items from "./Items.jsx";
import Horse from "./Horse.jsx";
import Gnomes from "./Gnomes.jsx";
import Player from "./Player.jsx";
import ThirdPersonCamera from "./ThirdPersonCamera.jsx";

function Game() {
  var playerRef = useRef();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#B8D4A8" />
      <directionalLight
        position={[50, 80, 30]}
        intensity={1.2}
        color="#FFF8E0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={300}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />
      <hemisphereLight args={["#87CEEB", "#3A5A2E", 0.3]} />

      {/* Sky and fog */}
      <fog attach="fog" args={["#A8C8A0", 80, 300]} />
      <color attach="background" args={["#87CEEB"]} />

      {/* World */}
      <Ground />
      <Water />
      <Trees />
      <Rocks />
      <Bushes />
      <Fish />
      <Crabs />
      <Houses />
      <Items />
      <Horse />
      <Gnomes />

      {/* Player and camera */}
      <Player ref={playerRef} />
      <ThirdPersonCamera target={playerRef} />
    </>
  );
}

export default Game;
