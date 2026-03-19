import { ROCKS } from "../rendering/tiles.js";
import { SCALE } from "../constants/world.js";

function Rock(props) {
  var rock = props.rock;
  var x = rock.x * SCALE;
  var z = rock.y * SCALE;
  var s = rock.size * SCALE;

  return (
    <group position={[x, 0, z]}>
      {/* Main rock body - flattened dodecahedron */}
      <mesh position={[0, s * 0.25, 0]} scale={[1, 0.6, 1]} castShadow receiveShadow>
        <dodecahedronGeometry args={[s * 0.5, 0]} />
        <meshStandardMaterial color="#686868" roughness={0.92} />
      </mesh>

      {/* Lighter face highlight */}
      <mesh position={[-s * 0.08, s * 0.3, -s * 0.05]} scale={[0.8, 0.5, 0.7]}>
        <dodecahedronGeometry args={[s * 0.35, 0]} />
        <meshStandardMaterial color="#787878" roughness={0.88} />
      </mesh>

      {/* Moss hint */}
      <mesh position={[-s * 0.1, s * 0.35, 0]} scale={[0.6, 0.3, 0.5]}>
        <sphereGeometry args={[s * 0.25, 6, 4]} />
        <meshStandardMaterial color="#3C5A32" roughness={0.95} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Rocks() {
  return (
    <>
      {ROCKS.map(function (rock, i) {
        return <Rock key={i} rock={rock} />;
      })}
    </>
  );
}

export default Rocks;
