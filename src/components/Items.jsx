import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SCALE } from "../constants/world.js";
import { ISLANDS } from "../rendering/tiles.js";
import { useGameState } from "../state/GameState.jsx";

// Axe location: near the pond, between rocks
var AXE_POS = { x: 950, y: 850 };
// Plans location: deep in the dense forest
var PLANS_POS = { x: 3300, y: 2050 };

function FloatingAxe() {
  var gameState = useGameState();
  var groupRef = useRef();
  var glowRef = useRef();

  useFrame(function (state) {
    if (!groupRef.current) return;
    var t = state.clock.elapsedTime;
    // Float up and down
    groupRef.current.position.y = 1.2 + Math.sin(t * 2) * 0.3;
    // Spin slowly
    groupRef.current.rotation.y = t * 1.5;
    // Glow pulse
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.0 + Math.sin(t * 3) * 0.15);
    }
  });

  if (gameState.hasAxe) return null;

  var x = AXE_POS.x * SCALE;
  var z = AXE_POS.y * SCALE;

  return (
    <group position={[x, 0, z]}>
      {/* Glow sphere */}
      <mesh ref={glowRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.8, 12, 8]} />
        <meshStandardMaterial color="#FFD700" transparent opacity={0.15} emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>

      <group ref={groupRef}>
        {/* Axe handle */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 6]} />
          <meshStandardMaterial color="#6B4B2A" roughness={0.9} />
        </mesh>

        {/* Axe head */}
        <mesh position={[0.15, 0.45, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.5, 0.3, 0.1]} />
          <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Axe blade edge */}
        <mesh position={[0.35, 0.45, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.12, 0.35, 0.06]} />
          <meshStandardMaterial color="#AAAAAA" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* Light pillar */}
      <pointLight position={[0, 2, 0]} color="#FFD700" intensity={3} distance={8} />
    </group>
  );
}

function FloatingPlans() {
  var gameState = useGameState();
  var groupRef = useRef();
  var glowRef = useRef();

  useFrame(function (state) {
    if (!groupRef.current) return;
    var t = state.clock.elapsedTime;
    groupRef.current.position.y = 1.2 + Math.sin(t * 2 + 1) * 0.3;
    groupRef.current.rotation.y = t * 1.2;
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.0 + Math.sin(t * 3 + 1) * 0.15);
    }
  });

  if (gameState.hasPlans) return null;

  var x = PLANS_POS.x * SCALE;
  var z = PLANS_POS.y * SCALE;

  return (
    <group position={[x, 0, z]}>
      {/* Glow sphere */}
      <mesh ref={glowRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.8, 12, 8]} />
        <meshStandardMaterial color="#7B3FA0" transparent opacity={0.15} emissive="#7B3FA0" emissiveIntensity={0.5} />
      </mesh>

      <group ref={groupRef}>
        {/* Scroll - rolled paper */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#F0E8D0" roughness={0.6} />
        </mesh>

        {/* Scroll end caps */}
        <mesh position={[0, 0, 0.42]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 8]} />
          <meshStandardMaterial color="#8B6B4A" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.42]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 8]} />
          <meshStandardMaterial color="#8B6B4A" roughness={0.8} />
        </mesh>

        {/* Purple ribbon */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.06, 0.04, 0.5]} />
          <meshStandardMaterial color="#7B3FA0" roughness={0.5} />
        </mesh>
      </group>

      {/* Light pillar */}
      <pointLight position={[0, 2, 0]} color="#7B3FA0" intensity={3} distance={8} />
    </group>
  );
}

function BuildMarker() {
  var gameState = useGameState();
  var ringRef = useRef();

  useFrame(function (state) {
    if (!ringRef.current) return;
    var t = state.clock.elapsedTime;
    ringRef.current.rotation.y = t * 0.5;
    ringRef.current.position.y = 0.3 + Math.sin(t * 2) * 0.15;
  });

  // Only show when player has plans + enough wood but hasn't built yet
  if (!gameState.hasPlans || gameState.shopBuilt || gameState.wood < 10) return null;

  var x = 2000 * SCALE;
  var z = 1940 * SCALE;

  return (
    <group position={[x, 0, z]}>
      {/* Glowing ring on the ground */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.15, 8, 24]} />
        <meshStandardMaterial color="#D0A0FF" emissive="#7B3FA0" emissiveIntensity={1} transparent opacity={0.7} />
      </mesh>
      {/* Light beam */}
      <pointLight position={[0, 3, 0]} color="#D0A0FF" intensity={5} distance={15} />
    </group>
  );
}

function TreasureChest(props) {
  var island = props.island;
  var gameState = useGameState();
  var groupRef = useRef();
  var glowRef = useRef();

  useFrame(function (state) {
    if (!groupRef.current) return;
    var t = state.clock.elapsedTime;
    groupRef.current.position.y = 1.0 + Math.sin(t * 2 + props.idx) * 0.2;
    groupRef.current.rotation.y = t * 0.8;
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.0 + Math.sin(t * 3 + props.idx) * 0.15);
    }
  });

  if (gameState.treasuresFound[island.name]) return null;

  var x = island.treasure.x * SCALE;
  var z = island.treasure.y * SCALE;

  return (
    <group position={[x, 0, z]}>
      {/* Glow */}
      <mesh ref={glowRef} position={[0, 1.0, 0]}>
        <sphereGeometry args={[1.2, 12, 8]} />
        <meshStandardMaterial color="#FFD700" transparent opacity={0.12} emissive="#FFD700" emissiveIntensity={0.6} />
      </mesh>

      <group ref={groupRef}>
        {/* Chest base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.35, 0.4]} />
          <meshStandardMaterial color="#8B6B2A" roughness={0.8} />
        </mesh>
        {/* Chest lid */}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.64, 0.12, 0.44]} />
          <meshStandardMaterial color="#A07830" roughness={0.7} />
        </mesh>
        {/* Gold clasp */}
        <mesh position={[0, 0.15, 0.21]}>
          <boxGeometry args={[0.12, 0.18, 0.04]} />
          <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Gold trim */}
        <mesh position={[0, 0.05, 0.21]}>
          <boxGeometry args={[0.62, 0.04, 0.02]} />
          <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      <pointLight position={[0, 2, 0]} color="#FFD700" intensity={4} distance={10} />
    </group>
  );
}

function TreasureChests() {
  var chests = [];
  for (var i = 0; i < ISLANDS.length; i++) {
    chests.push(
      <TreasureChest key={i} island={ISLANDS[i]} idx={i} />
    );
  }
  return <>{chests}</>;
}

// === ALIEN ISLAND DECORATIONS ===
// All static meshes (no useFrame) for performance. Only 1 pointLight per island.

// Static alien eye-stalk plant
function AlienPlant(props) {
  var stalkH = 0.6 + (props.seed % 4) * 0.15;
  var stalkColor = props.seed % 2 === 0 ? "#8040C0" : "#40C0A0";
  var eyeColor = props.seed % 3 === 0 ? "#FF4080" : (props.seed % 3 === 1 ? "#40FF80" : "#8080FF");

  return (
    <group position={[props.x, 0, props.z]}>
      {/* Stalk */}
      <mesh position={[0, stalkH / 2, 0]} rotation={[0.1, 0, 0.15]}>
        <cylinderGeometry args={[0.03, 0.06, stalkH, 4]} />
        <meshStandardMaterial color={stalkColor} emissive={stalkColor} emissiveIntensity={0.2} roughness={0.6} />
      </mesh>
      {/* Eye bulb */}
      <mesh position={[0, stalkH + 0.08, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.5} roughness={0.2} />
      </mesh>
      {/* Pupil */}
      <mesh position={[0, stalkH + 0.08, 0.08]}>
        <sphereGeometry args={[0.04, 4, 4]} />
        <meshStandardMaterial color="#000000" roughness={0.1} />
      </mesh>
    </group>
  );
}

// All decorations for one alien island - static crystals + plants + 1 light
function AlienIslandDecor(props) {
  var cx = props.cx * SCALE;
  var cz = props.cy * SCALE;
  var hw = props.hw * SCALE;
  var idx = props.idx;

  // 3 static ground crystals
  var crystals = [];
  var crystalColors = ["#AA40FF", "#60C0FF", "#FF40AA"];
  for (var c = 0; c < 3; c++) {
    var angle = (c / 3) * Math.PI * 2 + idx * 1.5;
    var dist = hw * 0.35 + c * 0.5;
    var cH = 0.8 + (c * 0.3);
    crystals.push(
      <mesh key={"c" + c} position={[cx + Math.cos(angle) * dist, cH / 2, cz + Math.sin(angle) * dist]} rotation={[0.1 * c, c * 0.7, 0.15 * c]}>
        <coneGeometry args={[0.15, cH, 4]} />
        <meshStandardMaterial color={crystalColors[c]} emissive={crystalColors[c]} emissiveIntensity={0.6} roughness={0.05} metalness={0.4} />
      </mesh>
    );
  }

  // 3 static alien plants
  var plants = [];
  for (var p = 0; p < 3; p++) {
    var pAngle = (p / 3) * Math.PI * 2 + idx * 2.5 + 0.5;
    var pDist = hw * 0.4 + p * 0.3;
    plants.push(
      <AlienPlant
        key={"p" + p}
        x={cx + Math.cos(pAngle) * pDist}
        z={cz + Math.sin(pAngle) * pDist}
        seed={idx * 17 + p * 7}
      />
    );
  }

  // 1 portal ring (static, no useFrame)
  var portalAngle = idx * 2.5;
  var portalDist = hw * 0.3;
  var px = cx + Math.cos(portalAngle) * portalDist;
  var pz = cz + Math.sin(portalAngle) * portalDist;

  return (
    <>
      {crystals}
      {plants}
      {/* Portal ring */}
      <mesh position={[px, 2.5, pz]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.06, 6, 16]} />
        <meshStandardMaterial color="#C060FF" emissive="#8030DD" emissiveIntensity={0.8} roughness={0.1} metalness={0.5} />
      </mesh>
      {/* 1 light per island */}
      <pointLight position={[px, 2.5, pz]} color="#C060FF" intensity={3} distance={10} />
    </>
  );
}

function AlienDecorations() {
  var alienIslands = [];
  for (var i = 0; i < ISLANDS.length; i++) {
    if (ISLANDS[i].theme === "alien") {
      alienIslands.push(
        <AlienIslandDecor
          key={i}
          cx={ISLANDS[i].cx}
          cy={ISLANDS[i].cy}
          hw={ISLANDS[i].hw}
          idx={i}
        />
      );
    }
  }
  return <>{alienIslands}</>;
}

function Items() {
  return (
    <>
      <FloatingAxe />
      <FloatingPlans />
      <BuildMarker />
      <TreasureChests />
      <AlienDecorations />
    </>
  );
}

export { Items as default, AXE_POS, PLANS_POS };
