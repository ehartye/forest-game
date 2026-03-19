// Save/Load system using localStorage

var SAVE_KEY_PREFIX = "forest-save-";

function saveGame(slot, gameState) {
  var pickedFruits = [];
  for (var i = 0; i < gameState.fruits.length; i++) {
    if (gameState.fruits[i].picked) {
      pickedFruits.push(i);
    }
  }

  var data = {
    characterColors: gameState.characterColors,
    inventory: gameState.inventory,
    gold: gameState.gold,
    wood: gameState.wood,
    hasAxe: gameState.hasAxe,
    hasPlans: gameState.hasPlans,
    shopBuilt: gameState.shopBuilt,
    hasHorse: gameState.hasHorse,
    choppedTrees: gameState.choppedTrees,
    treasuresFound: gameState.treasuresFound,
    playerPos: gameState.playerPosRef.current,
    pickedFruits: pickedFruits,
    savedAt: Date.now(),
  };

  try {
    localStorage.setItem(SAVE_KEY_PREFIX + slot, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

function loadGame(slot) {
  try {
    var raw = localStorage.getItem(SAVE_KEY_PREFIX + slot);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function getSaveInfo(slot) {
  var data = loadGame(slot);
  if (!data) return null;
  return {
    gold: data.gold || 0,
    wood: data.wood || 0,
    hasAxe: data.hasAxe || false,
    hasHorse: data.hasHorse || false,
    shopBuilt: data.shopBuilt || false,
    treasuresFound: data.treasuresFound ? Object.keys(data.treasuresFound).length : 0,
    savedAt: data.savedAt || 0,
  };
}

function deleteSave(slot) {
  try {
    localStorage.removeItem(SAVE_KEY_PREFIX + slot);
  } catch (e) {
    // ignore
  }
}

function getFirstEmptySlot() {
  for (var s = 1; s <= 3; s++) {
    if (!loadGame(s)) return s;
  }
  return 1;
}

export { saveGame, loadGame, getSaveInfo, deleteSave, getFirstEmptySlot };
