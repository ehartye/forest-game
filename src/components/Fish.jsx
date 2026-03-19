import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { FISH, ZONES } from "../rendering/tiles.js";
import { SCALE } from "../constants/world.js";

// Fish color palettes
var FISH_COLORS = [
  { body: "#E87830", belly: "#F0A858" },  // orange
  { body: "#A0A8B0", belly: "#C8D0D8" },  // silver
  { body: "#C8A020", belly: "#E0C848" },  // golden
  { body: "#48A078", belly: "#70C0A0" },  // greenish
];

function SingleFish(props) {
  var fish = props.fish;
  var colorIdx = props.colorIdx;
  var groupRef = useRef();
  var tailRef = useRef();

  // Get the bounding box of this fish's water zone
  var bounds = useMemo(function () {
    var zone = ZONES[fish.zone];
    var pts = zone.points;
    var minX = pts[0][0], maxX = pts[0][0];
    var minY = pts[0][1], maxY = pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      if (pts[i][0] < minX) minX = pts[i][0];
      if (pts[i][0] > maxX) maxX = pts[i][0];
      if (pts[i][1] < minY) minY = pts[i][1];
      if (pts[i][1] > maxY) maxY = pts[i][1];
    }
    // Shrink bounds a bit so fish don't swim to edges
    var pad = 30;
    return {
      minX: (minX + pad) * SCALE,
      maxX: (maxX - pad) * SCALE,
      minZ: (minY + pad) * SCALE,
      maxZ: (maxY - pad) * SCALE
    };
  }, [fish.zone]);

  // State for swimming AI and jumping
  var stateRef = useRef({
    x: fish.x * SCALE,
    z: fish.y * SCALE,
    targetX: fish.x * SCALE,
    targetZ: fish.y * SCALE,
    angle: Math.random() * Math.PI * 2,
    speed: 0.02 + Math.random() * 0.02,
    // Jump state
    jumping: false,
    jumpTime: 0,
    jumpDuration: 0,
    jumpHeight: 0,
    nextJump: 3 + Math.random() * 8,  // seconds until next jump
    elapsed: Math.random() * 5,  // stagger start times
  });

  function pickTarget(s) {
    s.targetX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    s.targetZ = bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ);
  }

  useFrame(function (state, delta) {
    if (!groupRef.current) return;
    var s = stateRef.current;
    s.elapsed += delta;

    // Swimming toward target
    var dx = s.targetX - s.x;
    var dz = s.targetZ - s.z;
    var dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 0.5) {
      // Reached target, pick new one
      pickTarget(s);
    } else {
      // Move toward target
      var moveX = (dx / dist) * s.speed;
      var moveZ = (dz / dist) * s.speed;
      s.x += moveX;
      s.z += moveZ;

      // Smoothly rotate to face direction
      var targetAngle = Math.atan2(moveX, moveZ);
      var angleDiff = targetAngle - s.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      s.angle += angleDiff * 0.1;
    }

    // Jump logic
    var yPos = -0.2;  // default depth below water surface
    var pitchTilt = 0;

    if (!s.jumping) {
      if (s.elapsed > s.nextJump) {
        // Start a jump!
        s.jumping = true;
        s.jumpTime = 0;
        s.jumpDuration = 0.6 + Math.random() * 0.4;
        s.jumpHeight = 1.0 + Math.random() * 1.5;
      }
    }

    if (s.jumping) {
      s.jumpTime += delta;
      var t = s.jumpTime / s.jumpDuration;  // 0 to 1

      if (t >= 1) {
        // Jump finished
        s.jumping = false;
        s.nextJump = s.elapsed + 3 + Math.random() * 8;
      } else {
        // Parabolic arc: y = 4h * t * (1-t)
        yPos = -0.2 + 4 * s.jumpHeight * t * (1 - t);
        // Tilt fish: nose up on ascent, nose down on descent
        pitchTilt = (0.5 - t) * 2.5;
        // Move forward a bit during jump
        s.x += Math.sin(s.angle) * 0.04;
        s.z += Math.cos(s.angle) * 0.04;
      }
    }

    // Apply position
    groupRef.current.position.set(s.x, yPos, s.z);
    groupRef.current.rotation.y = s.angle;
    groupRef.current.rotation.x = pitchTilt;

    // Tail wiggle
    if (tailRef.current) {
      var wiggle = Math.sin(s.elapsed * 12) * 0.4;
      tailRef.current.rotation.y = wiggle;
    }
  });

  var colors = FISH_COLORS[colorIdx % FISH_COLORS.length];

  return (
    <group ref={groupRef}>
      {/* Body - flattened ellipsoid */}
      <mesh scale={[1, 0.5, 0.6]}>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshStandardMaterial color={colors.body} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Belly - lighter underside */}
      <mesh position={[0, -0.08, 0]} scale={[0.85, 0.35, 0.5]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color={colors.belly} roughness={0.4} />
      </mesh>

      {/* Eye - left */}
      <mesh position={[-0.12, 0.05, 0.16]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Eye - right */}
      <mesh position={[-0.12, 0.05, -0.16]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Tail fin */}
      <group ref={tailRef} position={[0.35, 0, 0]}>
        <mesh scale={[0.4, 0.5, 0.15]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.5, 0.5, 1]} />
          <meshStandardMaterial color={colors.body} roughness={0.5} transparent opacity={0.85} />
        </mesh>
      </group>

      {/* Dorsal fin */}
      <mesh position={[0.05, 0.18, 0]} scale={[0.5, 0.35, 0.08]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.4, 0.4, 1]} />
        <meshStandardMaterial color={colors.body} roughness={0.5} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function Fish() {
  return (
    <>
      {FISH.map(function (fish, i) {
        return <SingleFish key={i} fish={fish} colorIdx={i} />;
      })}
    </>
  );
}

export default Fish;
