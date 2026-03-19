import { useRef, useImperativeHandle, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useKeyboard from "../hooks/useKeyboard.js";
import { ZONES, TREES, ROCKS, HOUSES, SHOP_HOUSE, ISLANDS } from "../rendering/tiles.js";
import { isBlocked, SCALE, pointInPoly } from "../constants/world.js";
import { useGameState } from "../state/GameState.jsx";
import { AXE_POS, PLANS_POS } from "./Items.jsx";

// Render hair meshes based on style
function renderHairMeshes(hairColor, hairStyle) {
  var r = 0.9;

  if (hairStyle === "short") {
    return (
      <mesh position={[0, 1.86, -0.02]}>
        <sphereGeometry args={[0.27, 8, 6]} />
        <meshStandardMaterial color={hairColor} roughness={r} />
      </mesh>
    );
  }

  if (hairStyle === "long") {
    return (
      <>
        <mesh position={[0, 1.88, -0.02]}>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[0, 1.48, -0.16]}>
          <boxGeometry args={[0.5, 0.7, 0.18]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
      </>
    );
  }

  if (hairStyle === "pigtails") {
    return (
      <>
        <mesh position={[0, 1.88, -0.02]}>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[-0.3, 1.68, -0.06]}>
          <sphereGeometry args={[0.14, 8, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[-0.3, 1.52, -0.06]}>
          <sphereGeometry args={[0.12, 8, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[0.3, 1.68, -0.06]}>
          <sphereGeometry args={[0.14, 8, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[0.3, 1.52, -0.06]}>
          <sphereGeometry args={[0.12, 8, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
      </>
    );
  }

  if (hairStyle === "spiky") {
    return (
      <>
        <mesh position={[0, 1.86, -0.02]}>
          <sphereGeometry args={[0.26, 8, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[0, 2.08, 0]}>
          <coneGeometry args={[0.08, 0.2, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[-0.12, 2.04, 0.08]} rotation={[0.3, 0, -0.4]}>
          <coneGeometry args={[0.07, 0.18, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[0.12, 2.04, 0.08]} rotation={[0.3, 0, 0.4]}>
          <coneGeometry args={[0.07, 0.18, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[-0.1, 2.02, -0.1]} rotation={[-0.3, 0, -0.3]}>
          <coneGeometry args={[0.06, 0.16, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[0.1, 2.02, -0.1]} rotation={[-0.3, 0, 0.3]}>
          <coneGeometry args={[0.06, 0.16, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
      </>
    );
  }

  if (hairStyle === "ponytail") {
    return (
      <>
        <mesh position={[0, 1.88, -0.02]}>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[0, 1.78, -0.28]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[0, 1.55, -0.3]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.4, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
        <mesh position={[0, 1.33, -0.32]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial color={hairColor} roughness={r} />
        </mesh>
      </>
    );
  }

  // Fallback: short
  return (
    <mesh position={[0, 1.86, -0.02]}>
      <sphereGeometry args={[0.27, 8, 6]} />
      <meshStandardMaterial color={hairColor} roughness={r} />
    </mesh>
  );
}

var SPEED = 0.30;
var HORSE_SPEED = 0.55;
var SWIM_SPEED = 0.18;

// Horse parks outside the shop door
var HORSE_PARK_X = SHOP_HOUSE.x * 0.1;
var HORSE_PARK_Z = (SHOP_HOUSE.y + SHOP_HOUSE.d / 2 + 40) * 0.1;

var Player = forwardRef(function Player(props, ref) {
  var groupRef = useRef();
  var leftLegRef = useRef();
  var rightLegRef = useRef();
  var leftArmRef = useRef();
  var rightArmRef = useRef();
  var horseFLRef = useRef();
  var horseFRRef = useRef();
  var horseBLRef = useRef();
  var horseBRRef = useRef();
  var movingRef = useRef(false);
  var wasSwimmingRef = useRef(false);
  var keysRef = useKeyboard();
  var gameState = useGameState();
  var spacePrevRef = useRef(false);
  var prevNearestRef = useRef(-1);

  useImperativeHandle(ref, function () {
    return groupRef.current;
  });

  useFrame(function (state) {
    if (!groupRef.current) return;

    var keys = keysRef.current;
    var cam = state.camera;

    // Get camera-relative directions projected onto XZ plane
    var forward = new THREE.Vector3();
    cam.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    var right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));
    right.normalize();

    var moveDir = new THREE.Vector3(0, 0, 0);

    if (keys["w"] || keys["W"] || keys["ArrowUp"]) moveDir.add(forward);
    if (keys["s"] || keys["S"] || keys["ArrowDown"]) moveDir.sub(forward);
    if (keys["d"] || keys["D"] || keys["ArrowRight"]) moveDir.add(right);
    if (keys["a"] || keys["A"] || keys["ArrowLeft"]) moveDir.sub(right);

    var pos = groupRef.current.position;

    // Check if player is in swimmable water
    var px = pos.x / SCALE;
    var pz = pos.z / SCALE;
    var swimming = false;
    for (var zi = 0; zi < ZONES.length; zi++) {
      if (ZONES[zi].type === "water" && ZONES[zi].swimmable && pointInPoly(px, pz, ZONES[zi].points)) {
        // Make sure we're not on an island (check if any non-water zone contains us too)
        var onLand = false;
        for (var li = 0; li < ZONES.length; li++) {
          if (ZONES[li].type !== "water" && pointInPoly(px, pz, ZONES[li].points)) {
            onLand = true;
            break;
          }
        }
        if (!onLand) {
          swimming = true;
        }
        break;
      }
    }

    // Update swimming state (only when it changes to avoid re-renders)
    if (swimming !== wasSwimmingRef.current) {
      wasSwimmingRef.current = swimming;
      gameState.setIsSwimming(swimming);
      // Auto-dismount horse when entering water
      if (swimming && gameState.onHorse) {
        gameState.toggleHorse();
      }
    }

    // Include shop in collision when built
    var allHouses = gameState.shopBuilt ? HOUSES.concat([SHOP_HOUSE]) : HOUSES;

    var currentSpeed = swimming ? SWIM_SPEED : (gameState.onHorse ? HORSE_SPEED : SPEED);

    if (moveDir.length() > 0.001) {
      moveDir.normalize().multiplyScalar(currentSpeed);
      movingRef.current = true;

      // Try X movement
      var newX = pos.x + moveDir.x;
      if (!isBlocked(newX, pos.z, ZONES, TREES, ROCKS, allHouses)) {
        pos.x = newX;
      }
      // Try Z movement
      var newZ = pos.z + moveDir.z;
      if (!isBlocked(pos.x, newZ, ZONES, TREES, ROCKS, allHouses)) {
        pos.z = newZ;
      }

      // Rotate player to face movement direction
      var targetAngle = Math.atan2(moveDir.x, moveDir.z);
      // Smooth rotation
      var currentAngle = groupRef.current.rotation.y;
      var diff = targetAngle - currentAngle;
      // Wrap angle difference
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      groupRef.current.rotation.y += diff * 0.15;
    } else {
      movingRef.current = false;
    }

    // Walking animation
    var time = state.clock.elapsedTime;
    var walkCycle = movingRef.current ? Math.sin(time * 8) : 0;
    var gallopCycle = movingRef.current ? Math.sin(time * 12) : 0;
    var swimCycle = Math.sin(time * 4);

    if (swimming) {
      // Swimming animation - breaststroke arms, legs still (hidden underwater)
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = movingRef.current ? swimCycle * 0.8 : -0.2;
        leftArmRef.current.rotation.z = movingRef.current ? Math.abs(swimCycle) * 0.3 : 0;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = movingRef.current ? -swimCycle * 0.8 : -0.2;
        rightArmRef.current.rotation.z = movingRef.current ? -Math.abs(swimCycle) * 0.3 : 0;
      }
    } else if (gameState.onHorse) {
      // Player legs stay still when mounted
      if (leftLegRef.current) leftLegRef.current.rotation.x = -0.3;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -0.3;
      if (leftArmRef.current) { leftArmRef.current.rotation.x = 0; leftArmRef.current.rotation.z = 0; }
      if (rightArmRef.current) { rightArmRef.current.rotation.x = 0; rightArmRef.current.rotation.z = 0; }
      // Horse legs gallop
      if (horseFLRef.current) horseFLRef.current.rotation.x = gallopCycle * 0.6;
      if (horseFRRef.current) horseFRRef.current.rotation.x = -gallopCycle * 0.6;
      if (horseBLRef.current) horseBLRef.current.rotation.x = -gallopCycle * 0.6;
      if (horseBRRef.current) horseBRRef.current.rotation.x = gallopCycle * 0.6;
    } else {
      // Normal player walking
      if (leftLegRef.current) leftLegRef.current.rotation.x = walkCycle * 0.5;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -walkCycle * 0.5;
      if (leftArmRef.current) { leftArmRef.current.rotation.x = -walkCycle * 0.4; leftArmRef.current.rotation.z = 0; }
      if (rightArmRef.current) { rightArmRef.current.rotation.x = walkCycle * 0.4; rightArmRef.current.rotation.z = 0; }
    }

    // --- Action detection (SPACE does different things based on context) ---
    gameState.playerPosRef.current = { x: pos.x, z: pos.z };

    var action = null;

    // Check for axe pickup
    if (!gameState.hasAxe) {
      var axDx = pos.x - AXE_POS.x * SCALE;
      var axDz = pos.z - AXE_POS.y * SCALE;
      if (Math.sqrt(axDx * axDx + axDz * axDz) < 3) {
        action = { type: "axe", label: "Press SPACE to pick up axe" };
      }
    }

    // Check for plans pickup
    if (!action && !gameState.hasPlans) {
      var plDx = pos.x - PLANS_POS.x * SCALE;
      var plDz = pos.z - PLANS_POS.y * SCALE;
      if (Math.sqrt(plDx * plDx + plDz * plDz) < 3) {
        action = { type: "plans", label: "Press SPACE to pick up building plans" };
      }
    }

    // Check for nearby fruit
    if (!action) {
      var nearestIdx = -1;
      var nearestDist = 3;
      var allFruits = gameState.fruits;
      for (var fi = 0; fi < allFruits.length; fi++) {
        if (allFruits[fi].picked) continue;
        var fdx = pos.x - allFruits[fi].x3d;
        var fdz = pos.z - allFruits[fi].z3d;
        var fdist = Math.sqrt(fdx * fdx + fdz * fdz);
        if (fdist < nearestDist) {
          nearestDist = fdist;
          nearestIdx = fi;
        }
      }
      if (nearestIdx !== -1) {
        action = { type: "fruit", fruitIdx: nearestIdx, label: "Press SPACE to pick fruit" };
      }
    }

    // Check for nearby tree to chop (only if has axe)
    if (!action && gameState.hasAxe) {
      var nearTreeIdx = -1;
      var nearTreeDist = 4;
      for (var ti = 0; ti < TREES.length; ti++) {
        if (gameState.choppedTrees[ti]) continue;
        var tdx = pos.x - TREES[ti].x * SCALE;
        var tdz = pos.z - TREES[ti].y * SCALE;
        var tdist = Math.sqrt(tdx * tdx + tdz * tdz);
        if (tdist < nearTreeDist) {
          nearTreeDist = tdist;
          nearTreeIdx = ti;
        }
      }
      if (nearTreeIdx !== -1) {
        action = { type: "chop", treeIdx: nearTreeIdx, label: "Press SPACE to chop tree" };
      }
    }

    // Check for build spot (clearing center at 2000, 1950 map coords)
    if (!action && gameState.hasPlans && !gameState.shopBuilt && gameState.wood >= 10) {
      var bDx = pos.x - 200;
      var bDz = pos.z - 194;
      if (Math.sqrt(bDx * bDx + bDz * bDz) < 15) {
        action = { type: "build", label: "Press SPACE to build shop (10 wood)" };
      }
    }

    // Check for treasure chests on islands
    if (!action) {
      for (var ci = 0; ci < ISLANDS.length; ci++) {
        if (gameState.treasuresFound[ISLANDS[ci].name]) continue;
        var chestX = ISLANDS[ci].treasure.x * SCALE;
        var chestZ = ISLANDS[ci].treasure.y * SCALE;
        var cDx = pos.x - chestX;
        var cDz = pos.z - chestZ;
        if (Math.sqrt(cDx * cDx + cDz * cDz) < 4) {
          action = { type: "treasure", islandName: ISLANDS[ci].name, label: "Press SPACE to open treasure chest!" };
          break;
        }
      }
    }

    // Check for shop sell or buy horse (inside shop, near counter)
    if (!action && gameState.shopBuilt) {
      var shopX = SHOP_HOUSE.x * SCALE;
      var shopZ = SHOP_HOUSE.y * SCALE;
      var counterZ = shopZ - SHOP_HOUSE.d * SCALE / 2 + 2.5 * SCALE;
      var sDx = pos.x - shopX;
      var sDz = pos.z - counterZ;
      if (Math.abs(sDx) < 5 && Math.abs(sDz) < 3) {
        var totalFruit = 0;
        var invKeys = Object.keys(gameState.inventory);
        for (var ik = 0; ik < invKeys.length; ik++) {
          totalFruit += gameState.inventory[invKeys[ik]] || 0;
        }
        if (totalFruit > 0) {
          action = { type: "sell", label: "Press SPACE to sell fruit for gold!" };
        } else if (!gameState.hasHorse && gameState.gold >= 50) {
          action = { type: "buyHorse", label: "Press SPACE to buy a horse (50g)" };
        }
      }
    }

    // Check for horse mount/dismount
    if (!action && gameState.hasHorse) {
      if (gameState.onHorse) {
        // Dismount when no other action is nearby
        action = { type: "dismount", label: "Press SPACE to dismount" };
      } else {
        // Mount if near following horse
        var hPos = gameState.horsePosRef.current;
        var hDx = pos.x - hPos.x;
        var hDz = pos.z - hPos.z;
        if (Math.sqrt(hDx * hDx + hDz * hDz) < 4) {
          action = { type: "mount", label: "Press SPACE to ride horse" };
        }
      }
    }

    // Update nearAction only when it changes
    var actionType = action ? action.type + (action.fruitIdx || "") + (action.treeIdx || "") + (action.islandName || "") : "";
    if (actionType !== prevNearestRef.current) {
      gameState.setNearAction(action);
      gameState.setNearestFruit(action && action.type === "fruit" ? action.fruitIdx : -1);
      prevNearestRef.current = actionType;
    }

    // Handle SPACE press
    var spaceDown = keys[" "] || false;
    if (spaceDown && !spacePrevRef.current && action) {
      if (action.type === "axe") {
        gameState.setHasAxe(true);
        gameState.setPickup({ type: "axe", time: Date.now() });
      } else if (action.type === "plans") {
        gameState.setHasPlans(true);
        gameState.setPickup({ type: "plans", time: Date.now() });
      } else if (action.type === "fruit") {
        gameState.pickFruit(action.fruitIdx);
      } else if (action.type === "chop") {
        gameState.chopTree(action.treeIdx);
      } else if (action.type === "build") {
        gameState.buildShop();
      } else if (action.type === "treasure") {
        gameState.openChest(action.islandName);
      } else if (action.type === "sell") {
        gameState.sellFruit();
      } else if (action.type === "buyHorse") {
        gameState.buyHorse();
      } else if (action.type === "mount") {
        gameState.toggleHorse();
      } else if (action.type === "dismount") {
        gameState.toggleHorse();
      }
    }
    spacePrevRef.current = spaceDown;
  });

  return (
    <group ref={groupRef} position={[60, 0, 58]}>
      {/* Offset - raised when on horse, lowered when swimming */}
      <group position={[0, gameState.isSwimming ? -0.8 : (gameState.onHorse ? 1.0 : -0.155), 0]}>

      {/* Torso / Jacket */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.4]} />
        <meshStandardMaterial color={gameState.characterColors.shirt} roughness={0.85} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 1.42, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.35]} />
        <meshStandardMaterial color={gameState.characterColors.shirt} roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color={gameState.characterColors.skin} roughness={0.7} />
      </mesh>

      {/* Hair */}
      {renderHairMeshes(gameState.characterColors.hair, gameState.characterColors.hairStyle)}

      {/* Skirt (girl mode) */}
      {gameState.characterColors.gender === "girl" && (
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.2, 0.44, 0.28, 8]} />
          <meshStandardMaterial color={gameState.characterColors.pants} roughness={0.85} />
        </mesh>
      )}

      {/* Eyes - two small white spheres */}
      <mesh position={[-0.08, 1.72, 0.24]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#F0EDE8" />
      </mesh>
      <mesh position={[0.08, 1.72, 0.24]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#F0EDE8" />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.08, 1.72, 0.27]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.08, 1.72, 0.27]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.47, 1.2, 0]}>
        {/* Sleeve */}
        <mesh position={[0, -0.12, 0]} castShadow>
          <boxGeometry args={[0.2, 0.25, 0.2]} />
          <meshStandardMaterial color={gameState.characterColors.shirt} roughness={0.85} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.16, 0.22, 0.16]} />
          <meshStandardMaterial color={gameState.characterColors.skin} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.09, 6, 6]} />
          <meshStandardMaterial color={gameState.characterColors.skin} roughness={0.7} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.47, 1.2, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <boxGeometry args={[0.2, 0.25, 0.2]} />
          <meshStandardMaterial color={gameState.characterColors.shirt} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.16, 0.22, 0.16]} />
          <meshStandardMaterial color={gameState.characterColors.skin} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.09, 6, 6]} />
          <meshStandardMaterial color={gameState.characterColors.skin} roughness={0.7} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.17, 0.65, 0]}>
        {/* Pants */}
        <mesh position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.22, 0.4, 0.22]} />
          <meshStandardMaterial color={gameState.characterColors.pants} roughness={0.85} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.42, 0.03]}>
          <boxGeometry args={[0.24, 0.15, 0.3]} />
          <meshStandardMaterial color="#3E2E20" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.17, 0.65, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.22, 0.4, 0.22]} />
          <meshStandardMaterial color={gameState.characterColors.pants} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.42, 0.03]}>
          <boxGeometry args={[0.24, 0.15, 0.3]} />
          <meshStandardMaterial color="#3E2E20" roughness={0.9} />
        </mesh>
      </group>
      </group>

      {/* Horse mesh (renders under player when mounted) */}
      {gameState.onHorse && (
        <group position={[0, 0, 0]}>
          {/* Body */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[0.9, 0.7, 2.0]} />
            <meshStandardMaterial color="#8B6B4A" roughness={0.85} />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 1.5, 0.8]} rotation={[0.5, 0, 0]} castShadow>
            <boxGeometry args={[0.4, 0.8, 0.4]} />
            <meshStandardMaterial color="#8B6B4A" roughness={0.85} />
          </mesh>

          {/* Head */}
          <mesh position={[0, 1.85, 1.15]} castShadow>
            <boxGeometry args={[0.35, 0.35, 0.55]} />
            <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
          </mesh>

          {/* Ears */}
          <mesh position={[-0.1, 2.08, 1.05]}>
            <boxGeometry args={[0.08, 0.15, 0.08]} />
            <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
          </mesh>
          <mesh position={[0.1, 2.08, 1.05]}>
            <boxGeometry args={[0.08, 0.15, 0.08]} />
            <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
          </mesh>

          {/* Eyes */}
          <mesh position={[-0.16, 1.9, 1.3]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          <mesh position={[0.16, 1.9, 1.3]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>

          {/* Mane */}
          <mesh position={[0, 1.55, 0.6]}>
            <boxGeometry args={[0.12, 0.5, 0.8]} />
            <meshStandardMaterial color="#3A2A14" roughness={0.9} />
          </mesh>

          {/* Tail */}
          <mesh position={[0, 1.1, -1.1]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.08, 0.6, 0.1]} />
            <meshStandardMaterial color="#3A2A14" roughness={0.9} />
          </mesh>

          {/* Front Left Leg */}
          <group ref={horseFLRef} position={[-0.3, 0.55, 0.6]}>
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[0.18, 0.55, 0.18]} />
              <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.55, 0]}>
              <boxGeometry args={[0.15, 0.08, 0.2]} />
              <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
            </mesh>
          </group>

          {/* Front Right Leg */}
          <group ref={horseFRRef} position={[0.3, 0.55, 0.6]}>
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[0.18, 0.55, 0.18]} />
              <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.55, 0]}>
              <boxGeometry args={[0.15, 0.08, 0.2]} />
              <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
            </mesh>
          </group>

          {/* Back Left Leg */}
          <group ref={horseBLRef} position={[-0.3, 0.55, -0.6]}>
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[0.18, 0.55, 0.18]} />
              <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.55, 0]}>
              <boxGeometry args={[0.15, 0.08, 0.2]} />
              <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
            </mesh>
          </group>

          {/* Back Right Leg */}
          <group ref={horseBRRef} position={[0.3, 0.55, -0.6]}>
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[0.18, 0.55, 0.18]} />
              <meshStandardMaterial color="#7A5C3A" roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.55, 0]}>
              <boxGeometry args={[0.15, 0.08, 0.2]} />
              <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
});

export default Player;
