import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CRABS } from "../rendering/tiles.js";
import { SCALE } from "../constants/world.js";

var CRAB_COLORS = [
  { shell: "#C45030", legs: "#A83820" },
  { shell: "#D06838", legs: "#B85028" },
  { shell: "#B84828", legs: "#983018" },
];

function SingleCrab(props) {
  var crab = props.crab;
  var colorIdx = props.colorIdx;
  var groupRef = useRef();
  var leftLegsRef = useRef();
  var rightLegsRef = useRef();
  var leftClawRef = useRef();
  var rightClawRef = useRef();

  var stateRef = useRef({
    x: crab.x * SCALE,
    z: crab.y * SCALE,
    angle: Math.random() * Math.PI * 2,
    // Crabs scuttle sideways then pause
    scuttleDir: Math.random() > 0.5 ? 1 : -1,
    scuttleTime: 0,
    pauseTime: 0,
    paused: false,
    pauseDuration: 1 + Math.random() * 3,
    scuttleDuration: 1 + Math.random() * 2,
    speed: 0.015 + Math.random() * 0.01,
    // Wander bounds (stay near spawn)
    homeX: crab.x * SCALE,
    homeZ: crab.y * SCALE,
  });

  useFrame(function (state, delta) {
    if (!groupRef.current) return;
    var s = stateRef.current;

    if (s.paused) {
      s.pauseTime += delta;
      if (s.pauseTime > s.pauseDuration) {
        // Start scuttling again
        s.paused = false;
        s.scuttleTime = 0;
        s.scuttleDuration = 1 + Math.random() * 2;
        // Maybe change direction
        if (Math.random() > 0.5) s.scuttleDir *= -1;
        // Maybe turn to face a new direction
        if (Math.random() > 0.7) s.angle += (Math.random() - 0.5) * 2;
      }
    } else {
      s.scuttleTime += delta;

      // Scuttle sideways (crabs walk sideways!)
      var sideX = Math.cos(s.angle) * s.speed * s.scuttleDir;
      var sideZ = -Math.sin(s.angle) * s.speed * s.scuttleDir;
      s.x += sideX;
      s.z += sideZ;

      // If too far from home, turn back
      var dx = s.x - s.homeX;
      var dz = s.z - s.homeZ;
      var distFromHome = Math.sqrt(dx * dx + dz * dz);
      if (distFromHome > 5) {
        s.angle = Math.atan2(-dz, dx);
        s.scuttleDir = 1;
      }

      if (s.scuttleTime > s.scuttleDuration) {
        // Pause
        s.paused = true;
        s.pauseTime = 0;
        s.pauseDuration = 1 + Math.random() * 3;
      }
    }

    groupRef.current.position.set(s.x, 0.08, s.z);
    groupRef.current.rotation.y = s.angle;

    // Leg animation when scuttling
    var legWiggle = s.paused ? 0 : Math.sin(state.clock.elapsedTime * 16) * 0.4;
    if (leftLegsRef.current) leftLegsRef.current.rotation.z = legWiggle;
    if (rightLegsRef.current) rightLegsRef.current.rotation.z = -legWiggle;

    // Claw snapping when paused
    var clawSnap = s.paused ? Math.max(0, Math.sin(state.clock.elapsedTime * 3)) * 0.3 : 0.1;
    if (leftClawRef.current) leftClawRef.current.rotation.y = clawSnap;
    if (rightClawRef.current) rightClawRef.current.rotation.y = -clawSnap;
  });

  var colors = CRAB_COLORS[colorIdx % CRAB_COLORS.length];

  return (
    <group ref={groupRef}>
      {/* Body - flattened oval */}
      <mesh scale={[1, 0.4, 0.8]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial color={colors.shell} roughness={0.7} />
      </mesh>

      {/* Eyes on stalks */}
      <mesh position={[-0.08, 0.12, 0.14]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.08, 0.12, 0.14]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Eye stalks */}
      <mesh position={[-0.08, 0.08, 0.13]} scale={[0.3, 1, 0.3]}>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 4]} />
        <meshStandardMaterial color={colors.shell} />
      </mesh>
      <mesh position={[0.08, 0.08, 0.13]} scale={[0.3, 1, 0.3]}>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 4]} />
        <meshStandardMaterial color={colors.shell} />
      </mesh>

      {/* Left legs (3 legs) */}
      <group ref={leftLegsRef} position={[-0.15, -0.02, 0]}>
        <mesh position={[-0.06, 0, 0.08]} rotation={[0, 0, -0.6]} scale={[0.6, 0.2, 0.2]}>
          <boxGeometry args={[0.15, 0.03, 0.03]} />
          <meshStandardMaterial color={colors.legs} />
        </mesh>
        <mesh position={[-0.07, 0, 0]} rotation={[0, 0, -0.5]} scale={[0.6, 0.2, 0.2]}>
          <boxGeometry args={[0.15, 0.03, 0.03]} />
          <meshStandardMaterial color={colors.legs} />
        </mesh>
        <mesh position={[-0.06, 0, -0.08]} rotation={[0, 0, -0.6]} scale={[0.6, 0.2, 0.2]}>
          <boxGeometry args={[0.15, 0.03, 0.03]} />
          <meshStandardMaterial color={colors.legs} />
        </mesh>
      </group>

      {/* Right legs (3 legs) */}
      <group ref={rightLegsRef} position={[0.15, -0.02, 0]}>
        <mesh position={[0.06, 0, 0.08]} rotation={[0, 0, 0.6]} scale={[0.6, 0.2, 0.2]}>
          <boxGeometry args={[0.15, 0.03, 0.03]} />
          <meshStandardMaterial color={colors.legs} />
        </mesh>
        <mesh position={[0.07, 0, 0]} rotation={[0, 0, 0.5]} scale={[0.6, 0.2, 0.2]}>
          <boxGeometry args={[0.15, 0.03, 0.03]} />
          <meshStandardMaterial color={colors.legs} />
        </mesh>
        <mesh position={[0.06, 0, -0.08]} rotation={[0, 0, 0.6]} scale={[0.6, 0.2, 0.2]}>
          <boxGeometry args={[0.15, 0.03, 0.03]} />
          <meshStandardMaterial color={colors.legs} />
        </mesh>
      </group>

      {/* Left claw */}
      <group ref={leftClawRef} position={[-0.12, 0.02, 0.15]}>
        {/* Arm */}
        <mesh position={[-0.06, 0, 0.02]} rotation={[0, 0.3, -0.3]}>
          <boxGeometry args={[0.1, 0.04, 0.04]} />
          <meshStandardMaterial color={colors.legs} />
        </mesh>
        {/* Pincer top */}
        <mesh position={[-0.13, 0.02, 0.02]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.06, 0.02, 0.03]} />
          <meshStandardMaterial color={colors.shell} />
        </mesh>
        {/* Pincer bottom */}
        <mesh position={[-0.13, -0.02, 0.02]}>
          <boxGeometry args={[0.06, 0.02, 0.03]} />
          <meshStandardMaterial color={colors.shell} />
        </mesh>
      </group>

      {/* Right claw */}
      <group ref={rightClawRef} position={[0.12, 0.02, 0.15]}>
        <mesh position={[0.06, 0, 0.02]} rotation={[0, -0.3, 0.3]}>
          <boxGeometry args={[0.1, 0.04, 0.04]} />
          <meshStandardMaterial color={colors.legs} />
        </mesh>
        <mesh position={[0.13, 0.02, 0.02]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.06, 0.02, 0.03]} />
          <meshStandardMaterial color={colors.shell} />
        </mesh>
        <mesh position={[0.13, -0.02, 0.02]}>
          <boxGeometry args={[0.06, 0.02, 0.03]} />
          <meshStandardMaterial color={colors.shell} />
        </mesh>
      </group>
    </group>
  );
}

function Crabs() {
  return (
    <>
      {CRABS.map(function (crab, i) {
        return <SingleCrab key={i} crab={crab} colorIdx={i} />;
      })}
    </>
  );
}

export default Crabs;
