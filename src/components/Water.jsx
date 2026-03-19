import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ZONES } from "../rendering/tiles.js";
import { SCALE } from "../constants/world.js";

function WaterZone(props) {
  var zone = props.zone;
  var meshRef = useRef();

  var shape = useMemo(function () {
    var pts = zone.points;
    var s = new THREE.Shape();
    // Map 2D pixel coords to 3D: x -> x, y -> z (but Shape is 2D so we use x,y and rotate later)
    s.moveTo(pts[0][0] * SCALE, pts[0][1] * SCALE);
    for (var i = 1; i < pts.length; i++) {
      s.lineTo(pts[i][0] * SCALE, pts[i][1] * SCALE);
    }
    s.closePath();
    return s;
  }, [zone]);

  useFrame(function (state) {
    if (meshRef.current) {
      meshRef.current.position.y = -0.12 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        color={zone.color}
        transparent
        opacity={0.75}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}

function Water() {
  var waterZones = useMemo(function () {
    var result = [];
    for (var i = 0; i < ZONES.length; i++) {
      if (ZONES[i].type === "water") {
        result.push(ZONES[i]);
      }
    }
    return result;
  }, []);

  return (
    <>
      {waterZones.map(function (zone, i) {
        return <WaterZone key={i} zone={zone} />;
      })}
    </>
  );
}

export default Water;
