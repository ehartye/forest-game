import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SHOP_HOUSE } from "../rendering/tiles.js";
import { useGameState } from "../state/GameState.jsx";

var SHOP_X = SHOP_HOUSE.x * 0.1;
var SHOP_Z = SHOP_HOUSE.y * 0.1;

// Gnome hat colors - each gnome gets a different hat
var HAT_COLORS = ["#CC2222", "#2255CC", "#22AA22", "#DDAA00", "#AA22AA", "#DD6600"];
var SHIRT_COLORS = ["#6A4A2A", "#4A3A6A", "#3A5A3A", "#5A4A2A", "#5A2A4A", "#4A4A3A"];

// Spawn points around the shop
var GNOME_SPAWNS = [
  { x: SHOP_X + 12, z: SHOP_Z + 8 },
  { x: SHOP_X - 10, z: SHOP_Z + 10 },
  { x: SHOP_X + 8, z: SHOP_Z - 12 },
  { x: SHOP_X - 12, z: SHOP_Z - 6 },
  { x: SHOP_X + 15, z: SHOP_Z },
  { x: SHOP_X - 8, z: SHOP_Z + 15 },
];

function SingleGnome(props) {
  var spawn = props.spawn;
  var idx = props.idx;
  var groupRef = useRef();
  var leftLegRef = useRef();
  var rightLegRef = useRef();

  var stateRef = useRef({
    x: spawn.x,
    z: spawn.z,
    angle: Math.random() * Math.PI * 2,
    targetX: SHOP_X + (Math.random() - 0.5) * 20,
    targetZ: SHOP_Z + (Math.random() - 0.5) * 20,
    speed: 0.02 + Math.random() * 0.01,
    waitTime: 0,
    waiting: false,
    waitDuration: 2 + Math.random() * 4,
  });

  useFrame(function (state) {
    if (!groupRef.current) return;
    var s = stateRef.current;

    if (s.waiting) {
      s.waitTime += 0.016;
      if (s.waitTime > s.waitDuration) {
        s.waiting = false;
        // Pick new target near the shop
        s.targetX = SHOP_X + (Math.random() - 0.5) * 24;
        s.targetZ = SHOP_Z + (Math.random() - 0.5) * 24;
        s.waitDuration = 2 + Math.random() * 4;
      }
    } else {
      // Walk toward target
      var dx = s.targetX - s.x;
      var dz = s.targetZ - s.z;
      var dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 0.5) {
        // Reached target, wait
        s.waiting = true;
        s.waitTime = 0;
      } else {
        // Move toward target
        s.x += (dx / dist) * s.speed;
        s.z += (dz / dist) * s.speed;
        // Face movement direction
        s.angle = Math.atan2(dx, dz);
      }
    }

    groupRef.current.position.set(s.x, 0, s.z);
    groupRef.current.rotation.y = s.angle;

    // Waddle animation
    var t = state.clock.elapsedTime;
    var waddle = s.waiting ? 0 : Math.sin(t * 10 + idx * 2) * 0.4;
    if (leftLegRef.current) leftLegRef.current.rotation.x = waddle;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -waddle;

    // Slight body wobble when walking
    if (!s.waiting) {
      groupRef.current.rotation.z = Math.sin(t * 10 + idx * 2) * 0.05;
    } else {
      groupRef.current.rotation.z = 0;
    }
  });

  var hatColor = HAT_COLORS[idx % HAT_COLORS.length];
  var shirtColor = SHIRT_COLORS[idx % SHIRT_COLORS.length];

  return (
    <group ref={groupRef}>
      {/* Body / shirt */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color={shirtColor} roughness={0.85} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#E0C0A0" roughness={0.7} />
      </mesh>

      {/* Beard */}
      <mesh position={[0, 0.48, 0.08]}>
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshStandardMaterial color="#DDDDDD" roughness={0.8} />
      </mesh>

      {/* Pointy hat */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <coneGeometry args={[0.12, 0.35, 6]} />
        <meshStandardMaterial color={hatColor} roughness={0.7} />
      </mesh>

      {/* Hat brim */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 8]} />
        <meshStandardMaterial color={hatColor} roughness={0.7} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.04, 0.63, 0.12]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.04, 0.63, 0.12]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.57, 0.14]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#D0A080" roughness={0.7} />
      </mesh>

      {/* Left leg */}
      <group ref={leftLegRef} position={[-0.08, 0.18, 0]}>
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.1, 0.18, 0.1]} />
          <meshStandardMaterial color="#4A3A2A" roughness={0.85} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.18, 0.02]}>
          <boxGeometry args={[0.12, 0.06, 0.15]} />
          <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rightLegRef} position={[0.08, 0.18, 0]}>
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.1, 0.18, 0.1]} />
          <meshStandardMaterial color="#4A3A2A" roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.18, 0.02]}>
          <boxGeometry args={[0.12, 0.06, 0.15]} />
          <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

function Gnomes() {
  var gameState = useGameState();

  // Only show gnomes when shop is built
  if (!gameState.shopBuilt) return null;

  // More gnomes appear as you earn gold (1 gnome per 20g earned, max 6)
  var gnomeCount = Math.min(6, Math.max(1, Math.floor(gameState.gold / 20) + 1));

  var gnomes = [];
  for (var i = 0; i < gnomeCount; i++) {
    gnomes.push(
      <SingleGnome key={i} spawn={GNOME_SPAWNS[i]} idx={i} />
    );
  }

  return <>{gnomes}</>;
}

export default Gnomes;
