import { useMemo } from "react";
import { TREES, ISLANDS } from "../rendering/tiles.js";
import { SCALE } from "../constants/world.js";
import { useGameState, FRUIT_COLORS } from "../state/GameState.jsx";

// Determine which island theme a tree belongs to
function getTreeTheme(tx, ty) {
  for (var i = 0; i < ISLANDS.length; i++) {
    var isl = ISLANDS[i];
    if (Math.abs(tx - isl.cx) < isl.hw && Math.abs(ty - isl.cy) < isl.hh) {
      return isl.theme;
    }
  }
  return null;
}

// Fruit positions helper (shared by all tree types)
function buildFruitSpheres(fruitList, treeIdx, canopyR, trunkH) {
  var fruitSpheres = [];
  if (fruitList) {
    for (var f = 0; f < fruitList.length; f++) {
      var fruit = fruitList[f];
      if (fruit.picked) continue;
      var seed = treeIdx * 17 + 5;
      var count = 2 + (seed % 2);
      for (var j = 0; j < count; j++) {
        var angle = (j / count) * Math.PI * 2 + (seed % 10) * 0.3;
        var r = canopyR * 0.5 + ((seed + j * 31) % 20) / 20 * canopyR * 0.3;
        var fx = Math.cos(angle) * r;
        var fz = Math.sin(angle) * r;
        var fy = trunkH + canopyR * 0.2 + ((seed + j * 13) % 10) / 10 * canopyR * 0.4;
        fruitSpheres.push({
          key: treeIdx + "-" + f + "-" + j,
          x: fx, y: fy, z: fz,
          color: FRUIT_COLORS[fruit.type],
        });
      }
    }
  }
  return fruitSpheres;
}

// === ALIEN CRYSTAL TREE (static - no useFrame, no pointLight) ===
function AlienTree(props) {
  var tree = props.tree;
  var treeIdx = props.treeIdx;
  var fruitList = props.fruitList;
  var x = tree.x * SCALE;
  var z = tree.y * SCALE;
  var h = tree.h * SCALE;
  var w = tree.w * SCALE;

  var crystalH = h * 0.9;
  var crystalW = w * 0.2;
  var seed = treeIdx * 13 + 7;

  var colors = ["#AA40FF", "#60C0FF", "#FF40AA", "#40FFAA"];
  var mainColor = colors[seed % colors.length];
  var glowColor = colors[(seed + 1) % colors.length];

  var fruitSpheres = buildFruitSpheres(fruitList, treeIdx, w * 0.35, crystalH * 0.5);

  // 2 side crystals
  var sideCrystals = [];
  for (var sc = 0; sc < 2; sc++) {
    var angle = (sc / 2) * Math.PI * 2 + (seed % 10) * 0.5;
    var dist = crystalW * 2;
    var sideH = crystalH * (0.3 + (seed + sc * 11) % 20 / 40);
    sideCrystals.push({
      key: "sc" + sc,
      px: Math.cos(angle) * dist,
      pz: Math.sin(angle) * dist,
      py: crystalH * 0.2 + sc * crystalH * 0.15,
      h: sideH,
      w: crystalW * 0.6,
      rx: Math.sin(angle) * 0.4,
      rz: Math.cos(angle) * 0.4,
      color: colors[(seed + sc + 2) % colors.length],
    });
  }

  return (
    <group position={[x, 0, z]}>
      {/* Main crystal body */}
      <mesh position={[0, crystalH * 0.45, 0]} scale={[1, crystalH / crystalW * 0.5, 1]} castShadow>
        <octahedronGeometry args={[crystalW, 0]} />
        <meshStandardMaterial color={mainColor} emissive={mainColor} emissiveIntensity={0.6} roughness={0.05} metalness={0.4} />
      </mesh>

      {/* Crystal tip */}
      <mesh position={[0, crystalH * 0.85, 0]}>
        <coneGeometry args={[crystalW * 0.5, crystalH * 0.3, 4]} />
        <meshStandardMaterial color="#EEDDFF" emissive={glowColor} emissiveIntensity={0.8} roughness={0.0} metalness={0.5} />
      </mesh>

      {/* Side crystals */}
      {sideCrystals.map(function (sc) {
        return (
          <mesh key={sc.key} position={[sc.px, sc.py, sc.pz]} rotation={[sc.rx, 0, sc.rz]} castShadow>
            <coneGeometry args={[sc.w, sc.h, 4]} />
            <meshStandardMaterial color={sc.color} emissive={sc.color} emissiveIntensity={0.5} roughness={0.05} metalness={0.4} />
          </mesh>
        );
      })}

      {/* Fruit (starfruit) */}
      {fruitSpheres.map(function (fs) {
        return (
          <mesh key={fs.key} position={[fs.x, fs.y, fs.z]}>
            <sphereGeometry args={[0.18, 8, 6]} />
            <meshStandardMaterial color={fs.color} emissive={fs.color} emissiveIntensity={0.3} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

// === MUSHROOM TREE (no pointLight) ===
function MushroomTree(props) {
  var tree = props.tree;
  var treeIdx = props.treeIdx;
  var fruitList = props.fruitList;
  var x = tree.x * SCALE;
  var z = tree.y * SCALE;
  var h = tree.h * SCALE;
  var w = tree.w * SCALE;
  var tw = tree.trunk * SCALE;

  var stemH = h * 0.5;
  var capR = w * 0.5;
  var seed = treeIdx * 11 + 3;

  var capColors = ["#DD3030", "#FF8020", "#8030DD", "#30BB30"];
  var spotColors = ["#FFFFFF", "#FFE8A0", "#E8E0FF", "#E0FFE0"];
  var capColor = capColors[seed % capColors.length];
  var spotColor = spotColors[seed % spotColors.length];

  var fruitSpheres = buildFruitSpheres(fruitList, treeIdx, capR, stemH);

  // 3 spots
  var spots = [];
  for (var sp = 0; sp < 3; sp++) {
    var angle = (sp / 3) * Math.PI * 2 + seed * 0.4;
    var r = capR * 0.4 + ((seed + sp * 7) % 10) / 20 * capR * 0.3;
    spots.push({
      key: "sp" + sp,
      px: Math.cos(angle) * r,
      pz: Math.sin(angle) * r,
      py: stemH + capR * 0.35,
      size: 0.08 + ((seed + sp) % 5) / 50,
    });
  }

  return (
    <group position={[x, 0, z]}>
      {/* Stem */}
      <mesh position={[0, stemH / 2, 0]} castShadow>
        <cylinderGeometry args={[tw * 1.2, tw * 1.5, stemH, 6]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.8} />
      </mesh>

      {/* Mushroom cap */}
      <mesh position={[0, stemH + capR * 0.1, 0]} castShadow>
        <sphereGeometry args={[capR, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={capColor} roughness={0.6} />
      </mesh>

      {/* Cap underside */}
      <mesh position={[0, stemH + capR * 0.08, 0]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[capR * 0.98, 8]} />
        <meshStandardMaterial color="#E0C8A0" roughness={0.9} side={2} />
      </mesh>

      {/* Spots */}
      {spots.map(function (sp) {
        return (
          <mesh key={sp.key} position={[sp.px, sp.py, sp.pz]} rotation={[-0.3, 0, 0]}>
            <circleGeometry args={[sp.size, 6]} />
            <meshStandardMaterial color={spotColor} roughness={0.5} side={2} />
          </mesh>
        );
      })}

      {/* Fruit (glowberries) */}
      {fruitSpheres.map(function (fs) {
        return (
          <mesh key={fs.key} position={[fs.x, fs.y, fs.z]}>
            <sphereGeometry args={[0.18, 8, 6]} />
            <meshStandardMaterial color={fs.color} emissive={fs.color} emissiveIntensity={0.3} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

// === SNOWY TREE ===
function SnowyTree(props) {
  var tree = props.tree;
  var treeIdx = props.treeIdx;
  var fruitList = props.fruitList;
  var x = tree.x * SCALE;
  var z = tree.y * SCALE;
  var h = tree.h * SCALE;
  var w = tree.w * SCALE;
  var tw = tree.trunk * SCALE;

  var trunkH = h * 0.4;
  var canopyR = w * 0.45;
  var fruitSpheres = buildFruitSpheres(fruitList, treeIdx, canopyR, trunkH);

  return (
    <group position={[x, 0, z]}>
      {/* Frost-covered trunk */}
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[tw * 0.7, tw, trunkH, 6]} />
        <meshStandardMaterial color="#8A9AAA" roughness={0.7} />
      </mesh>

      {/* Icy canopy */}
      <mesh position={[0.05, trunkH + canopyR * 0.3, 0.1]} castShadow>
        <sphereGeometry args={[canopyR, 8, 6]} />
        <meshStandardMaterial color="#A8C8E0" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[-0.08, trunkH + canopyR * 0.5, -0.05]} castShadow>
        <sphereGeometry args={[canopyR * 0.85, 8, 6]} />
        <meshStandardMaterial color="#C0D8F0" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Snow cap */}
      <mesh position={[0, trunkH + canopyR * 0.8, 0]} castShadow>
        <sphereGeometry args={[canopyR * 0.6, 8, 6]} />
        <meshStandardMaterial color="#F0F4FF" roughness={0.6} />
      </mesh>

      {/* Fruit */}
      {fruitSpheres.map(function (fs) {
        return (
          <mesh key={fs.key} position={[fs.x, fs.y, fs.z]}>
            <sphereGeometry args={[0.18, 8, 6]} />
            <meshStandardMaterial color={fs.color} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

// === VOLCANIC TREE ===
function VolcanicTree(props) {
  var tree = props.tree;
  var treeIdx = props.treeIdx;
  var fruitList = props.fruitList;
  var x = tree.x * SCALE;
  var z = tree.y * SCALE;
  var h = tree.h * SCALE;
  var w = tree.w * SCALE;
  var tw = tree.trunk * SCALE;

  var trunkH = h * 0.45;
  var canopyR = w * 0.4;
  var fruitSpheres = buildFruitSpheres(fruitList, treeIdx, canopyR, trunkH);

  return (
    <group position={[x, 0, z]}>
      {/* Charred trunk */}
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[tw * 0.7, tw, trunkH, 6]} />
        <meshStandardMaterial color="#2A2020" roughness={0.95} />
      </mesh>

      {/* Dark burnt canopy */}
      <mesh position={[0.05, trunkH + canopyR * 0.3, 0.1]} castShadow>
        <sphereGeometry args={[canopyR, 8, 6]} />
        <meshStandardMaterial color="#3A2818" roughness={0.9} />
      </mesh>
      <mesh position={[-0.08, trunkH + canopyR * 0.5, -0.05]} castShadow>
        <sphereGeometry args={[canopyR * 0.85, 8, 6]} />
        <meshStandardMaterial color="#4A3020" roughness={0.85} emissive="#FF4400" emissiveIntensity={0.05} />
      </mesh>
      <mesh position={[0, trunkH + canopyR * 0.7, 0]} castShadow>
        <sphereGeometry args={[canopyR * 0.6, 8, 6]} />
        <meshStandardMaterial color="#5A3828" roughness={0.8} emissive="#FF6600" emissiveIntensity={0.1} />
      </mesh>

      {/* Fruit */}
      {fruitSpheres.map(function (fs) {
        return (
          <mesh key={fs.key} position={[fs.x, fs.y, fs.z]}>
            <sphereGeometry args={[0.18, 8, 6]} />
            <meshStandardMaterial color={fs.color} emissive={fs.color} emissiveIntensity={0.15} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

// === TROPICAL PALM TREE ===
function TropicalTree(props) {
  var tree = props.tree;
  var treeIdx = props.treeIdx;
  var fruitList = props.fruitList;
  var x = tree.x * SCALE;
  var z = tree.y * SCALE;
  var h = tree.h * SCALE;
  var w = tree.w * SCALE;
  var tw = tree.trunk * SCALE;

  var trunkH = h * 0.55;
  var canopyR = w * 0.5;
  var fruitSpheres = buildFruitSpheres(fruitList, treeIdx, canopyR, trunkH);

  // 4 palm fronds
  var fronds = [];
  for (var fr = 0; fr < 4; fr++) {
    var angle = (fr / 4) * Math.PI * 2 + treeIdx * 0.7;
    fronds.push({
      key: "fr" + fr,
      rx: Math.sin(angle) * 0.8,
      rz: Math.cos(angle) * 0.8,
      ry: angle,
    });
  }

  return (
    <group position={[x, 0, z]}>
      {/* Trunk - slightly leaning */}
      <mesh position={[0, trunkH / 2, 0]} rotation={[0.05, 0, 0.08]} castShadow>
        <cylinderGeometry args={[tw * 0.5, tw * 1.0, trunkH, 6]} />
        <meshStandardMaterial color="#8A7050" roughness={0.85} />
      </mesh>

      {/* Palm fronds */}
      {fronds.map(function (f) {
        return (
          <mesh key={f.key} position={[0, trunkH + 0.1, 0]} rotation={[f.rx, f.ry, f.rz]} castShadow>
            <sphereGeometry args={[canopyR * 0.7, 6, 4]} />
            <meshStandardMaterial color="#4A8A30" roughness={0.75} />
          </mesh>
        );
      })}

      {/* Center crown */}
      <mesh position={[0, trunkH + canopyR * 0.2, 0]}>
        <sphereGeometry args={[canopyR * 0.3, 6, 4]} />
        <meshStandardMaterial color="#5A9A3A" roughness={0.7} />
      </mesh>

      {/* Fruit */}
      {fruitSpheres.map(function (fs) {
        return (
          <mesh key={fs.key} position={[fs.x, fs.y, fs.z]}>
            <sphereGeometry args={[0.18, 8, 6]} />
            <meshStandardMaterial color={fs.color} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

// === NORMAL TREE (mainland) ===
function NormalTree(props) {
  var tree = props.tree;
  var treeIdx = props.treeIdx;
  var fruitList = props.fruitList;
  var x = tree.x * SCALE;
  var z = tree.y * SCALE;
  var h = tree.h * SCALE;
  var w = tree.w * SCALE;
  var tw = tree.trunk * SCALE;

  var trunkH = h * 0.4;
  var canopyR = w * 0.45;
  var fruitSpheres = buildFruitSpheres(fruitList, treeIdx, canopyR, trunkH);

  return (
    <group position={[x, 0, z]}>
      {/* Trunk */}
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[tw * 0.7, tw, trunkH, 6]} />
        <meshStandardMaterial color="#5A4838" roughness={0.9} />
      </mesh>

      {/* Canopy layers */}
      <mesh position={[0.05, trunkH + canopyR * 0.3, 0.1]} castShadow>
        <sphereGeometry args={[canopyR, 8, 6]} />
        <meshStandardMaterial color="#264A24" roughness={0.85} />
      </mesh>
      <mesh position={[-0.08, trunkH + canopyR * 0.5, -0.05]} castShadow>
        <sphereGeometry args={[canopyR * 0.85, 8, 6]} />
        <meshStandardMaterial color="#2E5A2A" roughness={0.85} />
      </mesh>
      <mesh position={[0, trunkH + canopyR * 0.7, 0]} castShadow>
        <sphereGeometry args={[canopyR * 0.65, 8, 6]} />
        <meshStandardMaterial color="#447A3A" roughness={0.8} />
      </mesh>

      {/* Fruit */}
      {fruitSpheres.map(function (fs) {
        return (
          <mesh key={fs.key} position={[fs.x, fs.y, fs.z]}>
            <sphereGeometry args={[0.18, 8, 6]} />
            <meshStandardMaterial color={fs.color} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

// Precompute theme for each tree (only once)
var treeThemes = [];
for (var ti = 0; ti < TREES.length; ti++) {
  treeThemes.push(getTreeTheme(TREES[ti].x, TREES[ti].y));
}

function Trees() {
  var gameState = useGameState();
  var fruits = gameState.fruits;

  var fruitsByTree = useMemo(function () {
    var map = {};
    for (var i = 0; i < fruits.length; i++) {
      var f = fruits[i];
      if (!map[f.treeIdx]) map[f.treeIdx] = [];
      map[f.treeIdx].push({ type: f.type, picked: f.picked });
    }
    return map;
  }, [fruits]);

  var choppedTrees = gameState.choppedTrees;

  return (
    <>
      {TREES.map(function (tree, i) {
        if (choppedTrees[i]) return null;
        var theme = treeThemes[i];
        var fl = fruitsByTree[i];
        if (theme === "alien") return <AlienTree key={i} tree={tree} treeIdx={i} fruitList={fl} />;
        if (theme === "mushroom") return <MushroomTree key={i} tree={tree} treeIdx={i} fruitList={fl} />;
        if (theme === "snowy") return <SnowyTree key={i} tree={tree} treeIdx={i} fruitList={fl} />;
        if (theme === "volcanic") return <VolcanicTree key={i} tree={tree} treeIdx={i} fruitList={fl} />;
        if (theme === "tropical") return <TropicalTree key={i} tree={tree} treeIdx={i} fruitList={fl} />;
        return <NormalTree key={i} tree={tree} treeIdx={i} fruitList={fl} />;
      })}
    </>
  );
}

export default Trees;
