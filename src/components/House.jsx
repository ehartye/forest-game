import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { HOUSES, SHOP_HOUSE } from "../rendering/tiles.js";
import { SCALE } from "../constants/world.js";
import { useGameState } from "../state/GameState.jsx";

function SingleHouse(props) {
  var house = props.house;
  var gameState = useGameState();
  var roofRef = useRef();
  var frontWallRef = useRef();

  var x = house.x * SCALE;
  var z = house.y * SCALE;
  var w = house.w * SCALE;
  var d = house.d * SCALE;
  var wallH = house.wallH * SCALE;
  var roofH = house.roofH * SCALE;
  var doorW = house.doorW * SCALE;
  var wallThick = 0.6;

  // Width of each front wall segment (half the wall minus half the door)
  var frontSegW = (w / 2 - doorW / 2);

  // Check if player is inside the house each frame
  useFrame(function () {
    var ppos = gameState.playerPosRef.current;
    var inside = (
      ppos.x > x - w / 2 && ppos.x < x + w / 2 &&
      ppos.z > z - d / 2 && ppos.z < z + d / 2
    );
    if (roofRef.current) roofRef.current.visible = !inside;
    if (frontWallRef.current) frontWallRef.current.visible = !inside;
  });

  return (
    <group position={[x, 0, z]}>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color={house.floorColor} roughness={0.85} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, wallH / 2, -d / 2 + wallThick / 2]} castShadow>
        <boxGeometry args={[w, wallH, wallThick]} />
        <meshStandardMaterial color={house.wallColor} roughness={0.8} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-w / 2 + wallThick / 2, wallH / 2, 0]} castShadow>
        <boxGeometry args={[wallThick, wallH, d]} />
        <meshStandardMaterial color={house.wallColor} roughness={0.8} />
      </mesh>

      {/* Right wall */}
      <mesh position={[w / 2 - wallThick / 2, wallH / 2, 0]} castShadow>
        <boxGeometry args={[wallThick, wallH, d]} />
        <meshStandardMaterial color={house.wallColor} roughness={0.8} />
      </mesh>

      {/* Front wall with door gap (hides when player inside) */}
      <group ref={frontWallRef}>
        {/* Left portion */}
        <mesh position={[-w / 2 + frontSegW / 2, wallH / 2, d / 2 - wallThick / 2]} castShadow>
          <boxGeometry args={[frontSegW, wallH, wallThick]} />
          <meshStandardMaterial color={house.wallColor} roughness={0.8} />
        </mesh>
        {/* Right portion */}
        <mesh position={[w / 2 - frontSegW / 2, wallH / 2, d / 2 - wallThick / 2]} castShadow>
          <boxGeometry args={[frontSegW, wallH, wallThick]} />
          <meshStandardMaterial color={house.wallColor} roughness={0.8} />
        </mesh>
        {/* Door lintel (top of door frame) */}
        <mesh position={[0, wallH * 0.85, d / 2 - wallThick / 2]}>
          <boxGeometry args={[doorW + 0.4, wallH * 0.3, wallThick + 0.1]} />
          <meshStandardMaterial color={house.doorFrameColor} roughness={0.9} />
        </mesh>
      </group>

      {/* Door frame posts (always visible) */}
      <mesh position={[-doorW / 2 - 0.1, wallH * 0.35, d / 2 - wallThick / 2]}>
        <boxGeometry args={[0.3, wallH * 0.7, wallThick + 0.1]} />
        <meshStandardMaterial color={house.doorFrameColor} roughness={0.9} />
      </mesh>
      <mesh position={[doorW / 2 + 0.1, wallH * 0.35, d / 2 - wallThick / 2]}>
        <boxGeometry args={[0.3, wallH * 0.7, wallThick + 0.1]} />
        <meshStandardMaterial color={house.doorFrameColor} roughness={0.9} />
      </mesh>

      {/* Roof (hides when player inside) */}
      <group ref={roofRef}>
        <mesh position={[0, wallH + roofH / 2, 0]} castShadow>
          <boxGeometry args={[w + 2, roofH, d + 2]} />
          <meshStandardMaterial color={house.roofColor} roughness={0.85} />
        </mesh>
        {/* Roof overhang trim */}
        <mesh position={[0, wallH + 0.1, 0]}>
          <boxGeometry args={[w + 2.5, 0.3, d + 2.5]} />
          <meshStandardMaterial color={house.doorFrameColor} roughness={0.9} />
        </mesh>
      </group>

      {/* === Interior Furniture === */}

      {house.isShop ? (
        <>
          {/* Shop counter - runs across the back */}
          <mesh position={[0, 1.2, -d / 2 + 2.5]} castShadow>
            <boxGeometry args={[w * 0.7, 0.2, 2]} />
            <meshStandardMaterial color="#6B4B8A" roughness={0.85} />
          </mesh>
          {/* Counter legs */}
          <mesh position={[-w * 0.3, 0.5, -d / 2 + 2.5]}>
            <boxGeometry args={[0.2, 1.0, 0.2]} />
            <meshStandardMaterial color="#4A3260" roughness={0.9} />
          </mesh>
          <mesh position={[w * 0.3, 0.5, -d / 2 + 2.5]}>
            <boxGeometry args={[0.2, 1.0, 0.2]} />
            <meshStandardMaterial color="#4A3260" roughness={0.9} />
          </mesh>

          {/* Shopkeeper - stands behind counter */}
          {/* Body */}
          <mesh position={[0, 1.6, -d / 2 + 1]} castShadow>
            <boxGeometry args={[0.7, 0.7, 0.4]} />
            <meshStandardMaterial color="#7B3FA0" roughness={0.85} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 2.2, -d / 2 + 1]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#D4AA80" roughness={0.7} />
          </mesh>
          {/* Hat */}
          <mesh position={[0, 2.5, -d / 2 + 1]}>
            <cylinderGeometry args={[0.35, 0.4, 0.25, 8]} />
            <meshStandardMaterial color="#5A2A80" roughness={0.8} />
          </mesh>

          {/* Shelves on back wall */}
          <mesh position={[-3, 2.5, -d / 2 + 0.5]}>
            <boxGeometry args={[2.5, 0.15, 0.8]} />
            <meshStandardMaterial color="#6B4B8A" roughness={0.85} />
          </mesh>
          <mesh position={[3, 2.5, -d / 2 + 0.5]}>
            <boxGeometry args={[2.5, 0.15, 0.8]} />
            <meshStandardMaterial color="#6B4B8A" roughness={0.85} />
          </mesh>
        </>
      ) : (
        <>
          {/* Table */}
          <mesh position={[-3, 1.2, -2]} castShadow>
            <boxGeometry args={[3, 0.2, 2]} />
            <meshStandardMaterial color="#8B6B4A" roughness={0.85} />
          </mesh>
          {/* Table legs */}
          <mesh position={[-4.2, 0.5, -2.7]}>
            <boxGeometry args={[0.2, 1.0, 0.2]} />
            <meshStandardMaterial color="#6B4B2A" roughness={0.9} />
          </mesh>
          <mesh position={[-1.8, 0.5, -2.7]}>
            <boxGeometry args={[0.2, 1.0, 0.2]} />
            <meshStandardMaterial color="#6B4B2A" roughness={0.9} />
          </mesh>
          <mesh position={[-4.2, 0.5, -1.3]}>
            <boxGeometry args={[0.2, 1.0, 0.2]} />
            <meshStandardMaterial color="#6B4B2A" roughness={0.9} />
          </mesh>
          <mesh position={[-1.8, 0.5, -1.3]}>
            <boxGeometry args={[0.2, 1.0, 0.2]} />
            <meshStandardMaterial color="#6B4B2A" roughness={0.9} />
          </mesh>

          {/* Bed frame - against back wall, right side */}
          <mesh position={[5, 0.35, -5]}>
            <boxGeometry args={[4.4, 0.7, 6.4]} />
            <meshStandardMaterial color="#6B4B2A" roughness={0.9} />
          </mesh>
          {/* Bed mattress */}
          <mesh position={[5, 0.6, -5]} castShadow>
            <boxGeometry args={[4, 0.5, 6]} />
            <meshStandardMaterial color="#DDEEDD" roughness={0.7} />
          </mesh>
          {/* Pillow */}
          <mesh position={[5, 0.95, -7]}>
            <boxGeometry args={[2.5, 0.4, 1.5]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
          </mesh>
        </>
      )}
    </group>
  );
}

function Houses() {
  var gameState = useGameState();

  return (
    <>
      {HOUSES.map(function (house, i) {
        return <SingleHouse key={i} house={house} />;
      })}
      {gameState.shopBuilt && <SingleHouse house={SHOP_HOUSE} />}
    </>
  );
}

export default Houses;
