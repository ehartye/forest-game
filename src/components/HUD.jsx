import { useState, useEffect, useRef, useCallback } from "react";
import { useGameState, FRUIT_COLORS, FRUIT_PRICES } from "../state/GameState.jsx";
import { ZONES, HOUSES, SHOP_HOUSE, ISLANDS } from "../rendering/tiles.js";
import { saveGame } from "../state/saveLoad.js";

// Map fits world from -1500 to 7800 x -1500 to 6500
// Scale: 0.05 → (7800+1500)*0.05 = 465, (6500+1500)*0.05 = 400
var MAP_DRAW_SCALE = 0.05;
var MAP_OFFSET_X = 1500;
var MAP_OFFSET_Y = 1500;
var MAP_W = 465;
var MAP_H = 400;

var AXE_RIDDLE = "Your axe is by the pond!\nGo find the water with the fish\nand look for something shiny.";

var PLANS_HINT = "Somewhere deep in the dark forest,\na scroll of building plans waits to be found...";

function mapX(wx) { return (wx + MAP_OFFSET_X) * MAP_DRAW_SCALE; }
function mapY(wy) { return (wy + MAP_OFFSET_Y) * MAP_DRAW_SCALE; }

function drawMap(ctx, playerX, playerZ, gameState) {
  ctx.clearRect(0, 0, MAP_W, MAP_H);

  // Ocean background
  ctx.fillStyle = "#1A3A58";
  ctx.fillRect(0, 0, MAP_W, MAP_H);

  // Draw zones in order (matches world rendering) - use each zone's actual color
  for (var i = 0; i < ZONES.length; i++) {
    var zone = ZONES[i];
    ctx.fillStyle = zone.color;
    ctx.beginPath();
    var pts = zone.points;
    ctx.moveTo(mapX(pts[0][0]), mapY(pts[0][1]));
    for (var j = 1; j < pts.length; j++) {
      ctx.lineTo(mapX(pts[j][0]), mapY(pts[j][1]));
    }
    ctx.closePath();
    ctx.fill();
  }

  // Draw houses
  for (var h = 0; h < HOUSES.length; h++) {
    var house = HOUSES[h];
    var hx = mapX(house.x);
    var hy = mapY(house.y);
    var hw = house.w * MAP_DRAW_SCALE;
    var hd = house.d * MAP_DRAW_SCALE;
    ctx.fillStyle = "#CC3333";
    ctx.fillRect(hx - hw / 2, hy - hd / 2, hw, hd);
    ctx.strokeStyle = "#FFD0D0";
    ctx.lineWidth = 1;
    ctx.strokeRect(hx - hw / 2, hy - hd / 2, hw, hd);
    ctx.fillStyle = "white";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("HOUSE", hx, hy - hd / 2 - 3);
  }

  // Draw shop (if built)
  if (gameState.shopBuilt) {
    var sx = mapX(SHOP_HOUSE.x);
    var sz = mapY(SHOP_HOUSE.y);
    var sw = SHOP_HOUSE.w * MAP_DRAW_SCALE;
    var sd = SHOP_HOUSE.d * MAP_DRAW_SCALE;
    ctx.fillStyle = "#7B3FA0";
    ctx.fillRect(sx - sw / 2, sz - sd / 2, sw, sd);
    ctx.strokeStyle = "#D0A0FF";
    ctx.lineWidth = 1;
    ctx.strokeRect(sx - sw / 2, sz - sd / 2, sw, sd);
    ctx.fillStyle = "white";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("SHOP", sx, sz - sd / 2 - 3);
  }

  // Draw island labels
  var ISLAND_LABELS = {
    tropical: "TROPICAL", volcanic: "VOLCANO", snowy: "SNOW",
    mushroom: "MUSHROOM", alien: "ALIEN",
  };
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "center";
  for (var il = 0; il < ISLANDS.length; il++) {
    var isl = ISLANDS[il];
    var ix = mapX(isl.cx);
    var iy = mapY(isl.cy);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(ISLAND_LABELS[isl.theme] || "", ix, iy - isl.hh * MAP_DRAW_SCALE - 2);
    // Treasure indicator
    if (gameState.treasuresFound[isl.name]) {
      ctx.fillStyle = "#FFD700";
      ctx.fillText("*", ix + 25, iy - isl.hh * MAP_DRAW_SCALE - 2);
    }
  }

  // Draw player dot
  // Convert player 3D pos to map: player pos is in 3D units (world * 0.1), so playerX = worldX * 0.1
  var px = mapX(playerX / 0.1);
  var pz = mapY(playerZ / 0.1);
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(px, pz, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("YOU", px, pz - 8);
}

function MapOverlay(props) {
  var gameState = props.gameState;
  var canvasRef = useRef(null);
  var rafRef = useRef(null);

  useEffect(function () {
    function loop() {
      if (canvasRef.current) {
        var ctx = canvasRef.current.getContext("2d");
        var ppos = gameState.playerPosRef.current;
        drawMap(ctx, ppos.x, ppos.z, gameState);
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    loop();
    return function () {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState]);

  // Building plans info
  var showPlans = gameState.hasPlans && !gameState.shopBuilt;

  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.6)",
      zIndex: 100,
    }}>
      <div style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
      }}>
        {/* Map panel */}
        <div style={{
          background: "#1A2A1A",
          borderRadius: 12,
          padding: 16,
          border: "2px solid rgba(255,255,255,0.3)",
        }}>
          <div style={{
            fontFamily: "monospace",
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 8,
          }}>
            MAP
          </div>
          <canvas
            ref={canvasRef}
            width={MAP_W}
            height={MAP_H}
            style={{
              borderRadius: 6,
              display: "block",
              imageRendering: "pixelated",
            }}
          />
          <div style={{
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
            textAlign: "center",
            marginTop: 8,
          }}>
            Press F to close
          </div>
        </div>

        {/* Building plans panel */}
        {showPlans && (
          <div style={{
            background: "#2A1A3A",
            borderRadius: 12,
            padding: 16,
            border: "2px solid #D0A0FF",
            width: 200,
            fontFamily: "monospace",
          }}>
            <div style={{
              color: "#D0A0FF",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 12,
            }}>
              BUILDING PLANS
            </div>
            <div style={{
              color: "#E8D0FF",
              fontSize: 13,
              textAlign: "center",
              marginBottom: 12,
            }}>
              Purple Shop
            </div>
            <div style={{
              color: "white",
              fontSize: 14,
              marginBottom: 8,
            }}>
              Materials needed:
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
              color: gameState.wood >= 10 ? "#6AFF6A" : "#FFB0B0",
              fontSize: 14,
            }}>
              <span style={{ color: "#B8956A" }}>Wood:</span>
              <span>{gameState.wood} / 10</span>
              <span>{gameState.wood >= 10 ? " Ready!" : ""}</span>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: 6,
              height: 12,
              marginTop: 8,
              overflow: "hidden",
            }}>
              <div style={{
                background: gameState.wood >= 10 ? "#6AFF6A" : "#D0A0FF",
                height: "100%",
                width: Math.min(gameState.wood / 10, 1) * 100 + "%",
                borderRadius: 6,
              }} />
            </div>
            <div style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 11,
              textAlign: "center",
              marginTop: 10,
            }}>
              {gameState.wood >= 10
                ? "Go to a clearing to build!"
                : "Chop trees with your axe!"}
            </div>
          </div>
        )}

        {/* Shop built - show earnings info */}
        {gameState.shopBuilt && (
          <div style={{
            background: "#2A1A3A",
            borderRadius: 12,
            padding: 16,
            border: "2px solid #D0A0FF",
            width: 200,
            fontFamily: "monospace",
          }}>
            <div style={{
              color: "#D0A0FF",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 12,
            }}>
              YOUR SHOP
            </div>
            <div style={{
              color: "#FFD700",
              fontSize: 14,
              textAlign: "center",
              marginBottom: 10,
            }}>
              Gold: {gameState.gold}g
            </div>
            <div style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
              lineHeight: "1.6",
            }}>
              Sell prices:
            </div>
            {["apple", "orange", "pear", "coconut", "dragonfruit", "frostberry", "glowberry", "starfruit"].map(function (ft) {
              return (
                <div key={ft} style={{ color: FRUIT_COLORS[ft], fontSize: 12 }}>
                  {ft.charAt(0).toUpperCase() + ft.slice(1)}: {FRUIT_PRICES[ft]}g
                </div>
              );
            })}
            <div style={{
              marginTop: 10,
              paddingTop: 8,
              borderTop: "1px solid rgba(255,255,255,0.2)",
              color: gameState.hasHorse ? "#6AFF6A" : "#D0A0FF",
              fontSize: 13,
            }}>
              {gameState.hasHorse ? "Horse: Owned!" : "Horse: 50g"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HUD() {
  var gameState = useGameState();
  var inventory = gameState.inventory;
  var nearAction = gameState.nearAction;
  var pickup = gameState.pickup;

  // Map toggle
  var _m = useState(false);
  var mapOpen = _m[0], setMapOpen = _m[1];

  // Riddle dismissed
  var _r = useState(false);
  var riddleDismissed = _r[0], setRiddleDismissed = _r[1];

  // Save popup
  var _sv = useState(false);
  var showSaved = _sv[0], setShowSaved = _sv[1];

  var doSave = useCallback(function () {
    if (!gameState.saveSlot) return;
    var ok = saveGame(gameState.saveSlot.current, gameState);
    if (ok) {
      setShowSaved(true);
      setTimeout(function () { setShowSaved(false); }, 1500);
    }
  }, [gameState]);

  // Auto-save every 60 seconds
  useEffect(function () {
    var timer = setInterval(function () { doSave(); }, 60000);
    return function () { clearInterval(timer); };
  }, [doSave]);

  useEffect(function () {
    function onKeyDown(e) {
      if (e.key === "f" || e.key === "F") {
        setMapOpen(function (prev) { return !prev; });
      }
      if (e.key === "p" || e.key === "P") {
        doSave();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return function () { window.removeEventListener("keydown", onKeyDown); };
  }, [doSave]);

  // Pickup popup that fades after 1.5s
  var _s = useState(null);
  var showPopup = _s[0], setShowPopup = _s[1];

  useEffect(function () {
    if (pickup) {
      var msg = "";
      if (pickup.type === "axe") msg = "Found the AXE!";
      else if (pickup.type === "plans") msg = "Found BUILDING PLANS!";
      else if (pickup.type === "wood") msg = "+1 wood!";
      else if (pickup.type === "shop") msg = "Shop built!";
      else if (pickup.type === "gold") msg = "+" + pickup.amount + "g!";
      else if (pickup.type === "horse") msg = "You bought a HORSE!";
      else if (pickup.type === "treasure") msg = "+100g TREASURE!";
      else msg = "+1 " + pickup.type + "!";
      setShowPopup(msg);
      var timer = setTimeout(function () {
        setShowPopup(null);
      }, 2000);
      return function () { clearTimeout(timer); };
    }
  }, [pickup]);

  // Show riddle at start, hide once axe is found
  var showRiddle = !gameState.hasAxe && !riddleDismissed;

  // Show base fruits always, island fruits only when you have some
  var baseFruits = ["apple", "orange", "pear"];
  var islandFruits = ["coconut", "dragonfruit", "frostberry", "glowberry", "starfruit"];
  var shownFruits = baseFruits.slice();
  for (var ifi = 0; ifi < islandFruits.length; ifi++) {
    if ((inventory[islandFruits[ifi]] || 0) > 0) {
      shownFruits.push(islandFruits[ifi]);
    }
  }

  return (
    <>
      <style>{"\n        @keyframes fruitFadeUp {\n          0% { opacity: 1; transform: translateX(-50%) translateY(0); }\n          100% { opacity: 0; transform: translateX(-50%) translateY(-30px); }\n        }\n      "}</style>

      {/* Map overlay */}
      {mapOpen && <MapOverlay gameState={gameState} />}

      {/* Riddle sticker - shows at start until dismissed or axe found */}
      {showRiddle && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#FFF8DC",
          border: "3px solid #8B6B4A",
          borderRadius: 12,
          padding: "20px 28px",
          maxWidth: 360,
          zIndex: 50,
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}>
          <div style={{
            fontFamily: "monospace",
            color: "#5A3A1A",
            fontSize: 13,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}>
            A note stuck to your jacket...
          </div>
          <div style={{
            fontFamily: "monospace",
            color: "#3A2A0A",
            fontSize: 15,
            lineHeight: "1.6",
            whiteSpace: "pre-line",
            textAlign: "center",
          }}>
            {AXE_RIDDLE}
          </div>
          <div
            onClick={function () { setRiddleDismissed(true); }}
            style={{
              fontFamily: "monospace",
              color: "#8B6B4A",
              fontSize: 12,
              textAlign: "center",
              marginTop: 12,
              cursor: "pointer",
            }}
          >
            [ click to peel off ]
          </div>
        </div>
      )}

      {/* Inventory + resources - top left */}
      <div style={{
        position: "absolute",
        top: 16,
        left: 16,
        fontFamily: "monospace",
        color: "white",
        fontSize: 16,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        {/* Fruit inventory */}
        <div style={{
          display: "flex",
          gap: 16,
          background: "rgba(0,0,0,0.4)",
          padding: "8px 14px",
          borderRadius: 8,
        }}>
          {shownFruits.map(function (type) {
            return (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: FRUIT_COLORS[type],
                }} />
                <span>{inventory[type]}</span>
              </div>
            );
          })}
        </div>

        {/* Wood count (shows when you have axe) */}
        {gameState.hasAxe && (
          <div style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "rgba(0,0,0,0.4)",
            padding: "6px 14px",
            borderRadius: 8,
          }}>
            <span style={{ color: "#B8956A" }}>Wood:</span>
            <span>{gameState.wood}</span>
          </div>
        )}

        {/* Swimming indicator */}
        {gameState.isSwimming && (
          <div style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "rgba(30,80,120,0.6)",
            padding: "6px 14px",
            borderRadius: 8,
          }}>
            <span style={{ color: "#80D0FF" }}>Swimming...</span>
          </div>
        )}

        {/* Gold count (shows when shop is built) */}
        {gameState.shopBuilt && (
          <div style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "rgba(0,0,0,0.4)",
            padding: "6px 14px",
            borderRadius: 8,
          }}>
            <span style={{ color: "#FFD700" }}>Gold:</span>
            <span style={{ color: "#FFD700" }}>{gameState.gold}g</span>
          </div>
        )}
      </div>

      {/* Hint text - top right */}
      {!gameState.hasAxe && riddleDismissed && (
        <div style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontFamily: "monospace",
          color: "#FFD700",
          fontSize: 13,
          pointerEvents: "none",
          background: "rgba(0,0,0,0.4)",
          padding: "6px 12px",
          borderRadius: 8,
          maxWidth: 220,
          textAlign: "center",
        }}>
          Find the axe by the pond...
        </div>
      )}

      {gameState.hasAxe && !gameState.hasPlans && (
        <div style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontFamily: "monospace",
          color: "#B08FD8",
          fontSize: 13,
          pointerEvents: "none",
          background: "rgba(0,0,0,0.4)",
          padding: "6px 12px",
          borderRadius: 8,
          maxWidth: 220,
          textAlign: "center",
        }}>
          {PLANS_HINT}
        </div>
      )}

      {gameState.hasPlans && !gameState.shopBuilt && (
        <div style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontFamily: "monospace",
          color: "#B08FD8",
          fontSize: 13,
          pointerEvents: "none",
          background: "rgba(0,0,0,0.4)",
          padding: "6px 12px",
          borderRadius: 8,
          maxWidth: 220,
          textAlign: "center",
        }}>
          Chop trees for wood ({gameState.wood}/10), then find a clearing to build!
        </div>
      )}

      {gameState.shopBuilt && !gameState.isSwimming && (
        <div style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontFamily: "monospace",
          color: "#80D0FF",
          fontSize: 13,
          pointerEvents: "none",
          background: "rgba(0,0,0,0.4)",
          padding: "6px 12px",
          borderRadius: 8,
          maxWidth: 220,
          textAlign: "center",
        }}>
          Explore the ocean! Swim to islands for rare fruits and treasure!
        </div>
      )}

      {/* Pickup popup */}
      {showPopup && (
        <div style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "monospace",
          color: "white",
          fontSize: 22,
          fontWeight: "bold",
          pointerEvents: "none",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          animation: "fruitFadeUp 2s ease-out forwards",
        }}>
          {showPopup}
        </div>
      )}

      {/* Action prompt */}
      {nearAction && (
        <div style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "monospace",
          color: "white",
          fontSize: 18,
          fontWeight: "bold",
          pointerEvents: "none",
          textShadow: "0 2px 6px rgba(0,0,0,0.5)",
        }}>
          {nearAction.label}
        </div>
      )}

      {/* Controls hint */}
      <div style={{
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "monospace",
        color: "rgba(255,255,255,0.5)",
        fontSize: 14,
        pointerEvents: "none",
      }}>
        WASD to move &nbsp;|&nbsp; Right-click drag to look &nbsp;|&nbsp; F for map &nbsp;|&nbsp; P to save
      </div>

      {/* Saved popup */}
      {showSaved && (
        <div style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "monospace",
          color: "#88FF88",
          fontSize: 20,
          fontWeight: "bold",
          pointerEvents: "none",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          background: "rgba(20,40,20,0.7)",
          padding: "8px 24px",
          borderRadius: 8,
          border: "1px solid #4A8A40",
        }}>
          Saved!
        </div>
      )}
    </>
  );
}

export default HUD;
