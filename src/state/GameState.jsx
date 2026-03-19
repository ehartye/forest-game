import { createContext, useContext, useRef, useState, useCallback } from "react";
import { TREES, ISLANDS } from "../rendering/tiles.js";
import { SCALE } from "../constants/world.js";

var FRUIT_TYPES = ["apple", "orange", "pear", "coconut", "dragonfruit", "frostberry", "glowberry", "starfruit"];
var FRUIT_COLORS = {
  apple: "#CC2222",
  orange: "#E08020",
  pear: "#A0B830",
  coconut: "#8B6B3A",
  dragonfruit: "#DD2080",
  frostberry: "#80D0FF",
  glowberry: "#AAFF00",
  starfruit: "#FFD700",
};

var FRUIT_PRICES = {
  apple: 5, orange: 8, pear: 10,
  coconut: 15, dragonfruit: 20, frostberry: 18, glowberry: 22, starfruit: 25,
};

// Map island themes to their fruit type
var THEME_FRUITS = {
  tropical: "coconut",
  volcanic: "dragonfruit",
  snowy: "frostberry",
  mushroom: "glowberry",
  alien: "starfruit",
};

// Check which island a tree is on (if any)
function getIslandForTree(tx, ty) {
  for (var i = 0; i < ISLANDS.length; i++) {
    var isl = ISLANDS[i];
    if (Math.abs(tx - isl.cx) < isl.hw && Math.abs(ty - isl.cy) < isl.hh) {
      return isl;
    }
  }
  return null;
}

// Decide which trees have fruit (roughly 1 in 3 for mainland, every tree on islands)
var initialFruits = [];
for (var i = 0; i < TREES.length; i++) {
  var seed = (TREES[i].x * 13 + TREES[i].y * 7) % 100;
  var island = getIslandForTree(TREES[i].x, TREES[i].y);

  if (island) {
    // Island trees always have fruit (their island's special fruit)
    initialFruits.push({
      treeIdx: i,
      type: THEME_FRUITS[island.theme],
      picked: false,
      x3d: TREES[i].x * SCALE,
      z3d: TREES[i].y * SCALE,
    });
  } else if (seed % 3 === 0) {
    // Mainland trees: 1 in 3 get standard fruit
    var type = FRUIT_TYPES[i % 3];
    initialFruits.push({
      treeIdx: i,
      type: type,
      picked: false,
      x3d: TREES[i].x * SCALE,
      z3d: TREES[i].y * SCALE,
    });
  }
}

var EMPTY_INVENTORY = { apple: 0, orange: 0, pear: 0, coconut: 0, dragonfruit: 0, frostberry: 0, glowberry: 0, starfruit: 0 };

var GameStateContext = createContext(null);

function GameStateProvider(props) {
  var save = props.initialSaveData;
  var characterColors = props.characterColors;
  var saveSlot = props.saveSlot;

  // Build initial fruits, applying picked status from save
  var _f = useState(function () {
    var fruits = initialFruits.map(function (f) {
      return { treeIdx: f.treeIdx, type: f.type, picked: f.picked, x3d: f.x3d, z3d: f.z3d };
    });
    if (save && save.pickedFruits) {
      for (var pi = 0; pi < save.pickedFruits.length; pi++) {
        var idx = save.pickedFruits[pi];
        if (idx >= 0 && idx < fruits.length) {
          fruits[idx] = Object.assign({}, fruits[idx], { picked: true });
        }
      }
    }
    return fruits;
  });
  var fruits = _f[0], setFruits = _f[1];

  var _i = useState(save ? Object.assign({}, EMPTY_INVENTORY, save.inventory) : EMPTY_INVENTORY);
  var inventory = _i[0], setInventory = _i[1];

  var _n = useState(-1);
  var nearestFruit = _n[0], setNearestFruit = _n[1];

  var _p = useState(null);
  var pickup = _p[0], setPickup = _p[1];

  // Items and building
  var _ax = useState(save ? save.hasAxe : false);
  var hasAxe = _ax[0], setHasAxe = _ax[1];

  var _pl = useState(save ? save.hasPlans : false);
  var hasPlans = _pl[0], setHasPlans = _pl[1];

  var _w = useState(save ? save.wood : 0);
  var wood = _w[0], setWood = _w[1];

  var _sb = useState(save ? save.shopBuilt : false);
  var shopBuilt = _sb[0], setShopBuilt = _sb[1];

  var _g = useState(save ? save.gold : 0);
  var gold = _g[0], setGold = _g[1];

  // Tracks what SPACE will do
  var _na = useState(null);
  var nearAction = _na[0], setNearAction = _na[1];

  // Track which trees have been chopped
  var _ct = useState(save ? save.choppedTrees || {} : {});
  var choppedTrees = _ct[0], setChoppedTrees = _ct[1];

  // Horse
  var _hh = useState(save ? save.hasHorse : false);
  var hasHorse = _hh[0], setHasHorse = _hh[1];

  var _oh = useState(false);
  var onHorse = _oh[0], setOnHorse = _oh[1];

  // Swimming
  var _sw = useState(false);
  var isSwimming = _sw[0], setIsSwimming = _sw[1];

  // Treasure chests found (keyed by island name)
  var _tr = useState(save ? save.treasuresFound || {} : {});
  var treasuresFound = _tr[0], setTreasuresFound = _tr[1];

  var startPos = save && save.playerPos ? save.playerPos : { x: 60, z: 58 };
  var playerPosRef = useRef(startPos);
  var horsePosRef = useRef({ x: startPos.x - 3, z: startPos.z });

  var pickFruit = useCallback(function (fruitIdx) {
    var fruit = fruits[fruitIdx];
    if (!fruit || fruit.picked) return;

    setFruits(function (prev) {
      var next = prev.slice();
      next[fruitIdx] = Object.assign({}, next[fruitIdx], { picked: true });
      return next;
    });

    setInventory(function (prev) {
      var next = Object.assign({}, prev);
      next[fruit.type] = (next[fruit.type] || 0) + 1;
      return next;
    });

    // Trigger pickup popup
    setPickup({ type: fruit.type, time: Date.now() });

    setNearestFruit(-1);
  }, [fruits]);

  var chopTree = useCallback(function (treeIdx) {
    if (!hasAxe) return;
    setChoppedTrees(function (prev) {
      var next = Object.assign({}, prev);
      next[treeIdx] = true;
      return next;
    });
    setWood(function (prev) { return prev + 1; });
    setPickup({ type: "wood", time: Date.now() });
  }, [hasAxe]);

  var buildShop = useCallback(function () {
    if (!hasPlans || wood < 10) return;
    setWood(function (prev) { return prev - 10; });
    setShopBuilt(true);
    setPickup({ type: "shop", time: Date.now() });
  }, [hasPlans, wood]);

  var sellFruit = useCallback(function () {
    var earned = 0;
    var inv = inventory;
    for (var fi = 0; fi < FRUIT_TYPES.length; fi++) {
      var ft = FRUIT_TYPES[fi];
      earned += (inv[ft] || 0) * (FRUIT_PRICES[ft] || 0);
    }
    if (earned === 0) return;
    setGold(function (prev) { return prev + earned; });
    setInventory({ apple: 0, orange: 0, pear: 0, coconut: 0, dragonfruit: 0, frostberry: 0, glowberry: 0, starfruit: 0 });
    setPickup({ type: "gold", amount: earned, time: Date.now() });
  }, [inventory]);

  var HORSE_PRICE = 50;

  var buyHorse = useCallback(function () {
    if (gold < HORSE_PRICE || hasHorse) return;
    setGold(function (prev) { return prev - HORSE_PRICE; });
    setHasHorse(true);
    setPickup({ type: "horse", time: Date.now() });
  }, [gold, hasHorse]);

  var toggleHorse = useCallback(function () {
    if (!hasHorse) return;
    setOnHorse(function (prev) { return !prev; });
  }, [hasHorse]);

  var openChest = useCallback(function (islandName) {
    if (treasuresFound[islandName]) return;
    setTreasuresFound(function (prev) {
      var next = Object.assign({}, prev);
      next[islandName] = true;
      return next;
    });
    setGold(function (prev) { return prev + 100; });
    setPickup({ type: "treasure", time: Date.now() });
  }, [treasuresFound]);

  var value = {
    fruits: fruits,
    inventory: inventory,
    nearestFruit: nearestFruit,
    setNearestFruit: setNearestFruit,
    pickFruit: pickFruit,
    playerPosRef: playerPosRef,
    horsePosRef: horsePosRef,
    pickup: pickup,
    setPickup: setPickup,
    characterColors: characterColors,
    saveSlot: saveSlot,
    // Game state
    hasAxe: hasAxe,
    setHasAxe: setHasAxe,
    hasPlans: hasPlans,
    setHasPlans: setHasPlans,
    wood: wood,
    gold: gold,
    shopBuilt: shopBuilt,
    choppedTrees: choppedTrees,
    nearAction: nearAction,
    setNearAction: setNearAction,
    chopTree: chopTree,
    buildShop: buildShop,
    sellFruit: sellFruit,
    hasHorse: hasHorse,
    onHorse: onHorse,
    buyHorse: buyHorse,
    toggleHorse: toggleHorse,
    isSwimming: isSwimming,
    setIsSwimming: setIsSwimming,
    treasuresFound: treasuresFound,
    openChest: openChest,
  };

  return (
    <GameStateContext.Provider value={value}>
      {props.children}
    </GameStateContext.Provider>
  );
}

function useGameState() {
  return useContext(GameStateContext);
}

export { GameStateProvider, useGameState, FRUIT_COLORS, FRUIT_PRICES };
