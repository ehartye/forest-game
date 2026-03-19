import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameState } from "../state/GameState.jsx";

var FOLLOW_DIST = 3.0;   // how far behind the player the horse stays
var FOLLOW_SPEED = 0.04;  // how fast the horse catches up (lerp factor)

function Horse() {
  var gameState = useGameState();
  var groupRef = useRef();
  var headRef = useRef();
  var tailRef = useRef();
  var horsePosRef = useRef({ x: 0, z: 0, initialized: false });

  useFrame(function (state) {
    if (!groupRef.current) return;
    var t = state.clock.elapsedTime;

    // Head bob
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(t * 1.5) * 0.08;
    }
    // Tail swish
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 2) * 0.2;
    }

    // Follow the player
    var ppos = gameState.playerPosRef.current;
    var hp = horsePosRef.current;

    // Initialize horse position near the player on first frame
    if (!hp.initialized) {
      hp.x = ppos.x - FOLLOW_DIST;
      hp.z = ppos.z;
      hp.initialized = true;
    }

    // Distance from horse to player
    var dx = ppos.x - hp.x;
    var dz = ppos.z - hp.z;
    var dist = Math.sqrt(dx * dx + dz * dz);

    // Only move if farther than FOLLOW_DIST
    if (dist > FOLLOW_DIST) {
      // Target is FOLLOW_DIST behind the player (toward the horse)
      var targetX = ppos.x - (dx / dist) * FOLLOW_DIST;
      var targetZ = ppos.z - (dz / dist) * FOLLOW_DIST;

      // Lerp toward target (smooth follow)
      hp.x += (targetX - hp.x) * FOLLOW_SPEED;
      hp.z += (targetZ - hp.z) * FOLLOW_SPEED;
    }

    // Update position
    groupRef.current.position.x = hp.x;
    groupRef.current.position.z = hp.z;

    // Share position so Player can detect mount proximity
    gameState.horsePosRef.current.x = hp.x;
    gameState.horsePosRef.current.z = hp.z;

    // Face the player
    if (dist > 0.1) {
      var angle = Math.atan2(dx, dz);
      // Smooth rotation
      var currentY = groupRef.current.rotation.y;
      var diff = angle - currentY;
      // Wrap angle difference to [-PI, PI]
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      groupRef.current.rotation.y = currentY + diff * 0.06;
    }
  });

  // Only show when bought but not riding
  if (!gameState.hasHorse || gameState.onHorse) return null;

  return (
    <group ref={groupRef}>
      {/* Round body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.7, 10, 8]} />
        <meshStandardMaterial color="#8B6B4A" roughness={0.85} />
      </mesh>
      {/* Rump */}
      <mesh position={[0, 1.1, -0.5]} castShadow>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshStandardMaterial color="#8B6B4A" roughness={0.85} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.45, 0.65]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#8B6B4A" roughness={0.85} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 1.75, 1.0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.28, 8, 8]} />
          <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
        </mesh>
        {/* Snout */}
        <mesh position={[0, -0.08, 0.22]} castShadow>
          <sphereGeometry args={[0.18, 8, 6]} />
          <meshStandardMaterial color="#9A7A5A" roughness={0.85} />
        </mesh>
        {/* Nostrils */}
        <mesh position={[-0.06, -0.1, 0.38]}>
          <sphereGeometry args={[0.03, 4, 4]} />
          <meshStandardMaterial color="#4A3A2A" roughness={0.9} />
        </mesh>
        <mesh position={[0.06, -0.1, 0.38]}>
          <sphereGeometry args={[0.03, 4, 4]} />
          <meshStandardMaterial color="#4A3A2A" roughness={0.9} />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.12, 0.25, -0.05]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
        </mesh>
        <mesh position={[0.12, 0.25, -0.05]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.18, 0.06, 0.15]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.18, 0.06, 0.15]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Pupils */}
        <mesh position={[-0.2, 0.06, 0.19]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
        <mesh position={[0.2, 0.06, 0.19]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
      </group>

      {/* Mane - puffy balls along neck */}
      <mesh position={[0, 1.65, 0.5]}>
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshStandardMaterial color="#3A2A14" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.55, 0.35]}>
        <sphereGeometry args={[0.13, 6, 6]} />
        <meshStandardMaterial color="#3A2A14" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.45, 0.15]}>
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshStandardMaterial color="#3A2A14" roughness={0.9} />
      </mesh>

      {/* Tail */}
      <group ref={tailRef} position={[0, 1.15, -1.0]}>
        <mesh>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshStandardMaterial color="#3A2A14" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.15, -0.08]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#3A2A14" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.3, -0.12]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color="#3A2A14" roughness={0.9} />
        </mesh>
      </group>

      {/* Legs - round stubby */}
      <mesh position={[-0.3, 0.35, 0.45]}>
        <sphereGeometry args={[0.14, 6, 6]} />
        <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
      </mesh>
      <mesh position={[0.3, 0.35, 0.45]}>
        <sphereGeometry args={[0.14, 6, 6]} />
        <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
      </mesh>
      <mesh position={[-0.3, 0.35, -0.5]}>
        <sphereGeometry args={[0.14, 6, 6]} />
        <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
      </mesh>
      <mesh position={[0.3, 0.35, -0.5]}>
        <sphereGeometry args={[0.14, 6, 6]} />
        <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
      </mesh>

      {/* Hooves - round */}
      <mesh position={[-0.3, 0.08, 0.45]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 0.08, 0.45]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
      </mesh>
      <mesh position={[-0.3, 0.08, -0.5]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 0.08, -0.5]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default Horse;
