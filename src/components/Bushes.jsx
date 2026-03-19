import { BUSHES } from "../rendering/tiles.js";
import { SCALE } from "../constants/world.js";

function Bush(props) {
  var bush = props.bush;
  var x = bush.x * SCALE;
  var z = bush.y * SCALE;

  return (
    <group position={[x, 0, z]}>
      {/* Dark base layer */}
      <mesh position={[0.02, 0.6, 0.03]} castShadow>
        <sphereGeometry args={[1.4, 8, 6]} />
        <meshStandardMaterial color="#264A22" roughness={0.9} />
      </mesh>

      {/* Main mass */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[1.2, 8, 6]} />
        <meshStandardMaterial color="#2E5828" roughness={0.88} />
      </mesh>

      {/* Light highlight */}
      <mesh position={[-0.3, 0.9, -0.1]}>
        <sphereGeometry args={[0.7, 6, 4]} />
        <meshStandardMaterial color="#447A3A" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Bushes() {
  return (
    <>
      {BUSHES.map(function (bush, i) {
        return <Bush key={i} bush={bush} />;
      })}
    </>
  );
}

export default Bushes;
