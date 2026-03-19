import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { getSaveInfo, deleteSave, getFirstEmptySlot, loadGame } from "../state/saveLoad.js";

// Color options
var HAIR_COLORS = [
  { name: "Brown", hex: "#2A1E14" },
  { name: "Blonde", hex: "#C8A840" },
  { name: "Red", hex: "#8B2A1A" },
  { name: "Black", hex: "#0A0A0A" },
  { name: "Pink", hex: "#DD6090" },
  { name: "Blue", hex: "#3050AA" },
];
var SHIRT_COLORS = [
  { name: "Green", hex: "#5A6A58" },
  { name: "Red", hex: "#8A3838" },
  { name: "Blue", hex: "#3A4A7A" },
  { name: "Purple", hex: "#6A3A7A" },
  { name: "Yellow", hex: "#8A7A30" },
  { name: "Orange", hex: "#8A5A30" },
];
var PANTS_COLORS = [
  { name: "Gray", hex: "#3A3E48" },
  { name: "Brown", hex: "#4A3A28" },
  { name: "Black", hex: "#1A1A1E" },
  { name: "Blue", hex: "#2A3A5A" },
  { name: "Green", hex: "#2A4A2A" },
];
var SKIN_COLORS = [
  { name: "Light", hex: "#F0D0B0" },
  { name: "Medium", hex: "#D4AA80" },
  { name: "Tan", hex: "#B88A60" },
  { name: "Dark", hex: "#7A5A3A" },
];

var HAIR_STYLES = [
  { name: "Short", id: "short" },
  { name: "Long", id: "long" },
  { name: "Pigtails", id: "pigtails" },
  { name: "Spiky", id: "spiky" },
  { name: "Ponytail", id: "ponytail" },
];

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

// Spinning character preview (3D)
function CharacterPreview(props) {
  var colors = props.colors;
  var groupRef = useRef();

  useFrame(function (state) {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#B8D4A8" />
      <directionalLight position={[3, 5, 4]} intensity={1.0} color="#FFF8E0" />
      <color attach="background" args={["#1A2E1A"]} />

      <group ref={groupRef} position={[0, -1, 0]}>
        {/* Torso */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[0.7, 0.7, 0.4]} />
          <meshStandardMaterial color={colors.shirt} roughness={0.85} />
        </mesh>
        {/* Collar */}
        <mesh position={[0, 1.42, 0]}>
          <boxGeometry args={[0.5, 0.1, 0.35]} />
          <meshStandardMaterial color={colors.shirt} roughness={0.8} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.72, 0]}>
          <sphereGeometry args={[0.28, 8, 8]} />
          <meshStandardMaterial color={colors.skin} roughness={0.7} />
        </mesh>
        {/* Hair */}
        {renderHairMeshes(colors.hair, colors.hairStyle)}
        {/* Skirt (girl mode) */}
        {colors.gender === "girl" && (
          <mesh position={[0, 0.72, 0]}>
            <cylinderGeometry args={[0.2, 0.44, 0.28, 8]} />
            <meshStandardMaterial color={colors.pants} roughness={0.85} />
          </mesh>
        )}
        {/* Eyes */}
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
        <mesh position={[-0.47, 1.08, 0]}>
          <boxGeometry args={[0.2, 0.25, 0.2]} />
          <meshStandardMaterial color={colors.shirt} roughness={0.85} />
        </mesh>
        <mesh position={[-0.47, 0.85, 0]}>
          <boxGeometry args={[0.16, 0.22, 0.16]} />
          <meshStandardMaterial color={colors.skin} roughness={0.7} />
        </mesh>
        {/* Right Arm */}
        <mesh position={[0.47, 1.08, 0]}>
          <boxGeometry args={[0.2, 0.25, 0.2]} />
          <meshStandardMaterial color={colors.shirt} roughness={0.85} />
        </mesh>
        <mesh position={[0.47, 0.85, 0]}>
          <boxGeometry args={[0.16, 0.22, 0.16]} />
          <meshStandardMaterial color={colors.skin} roughness={0.7} />
        </mesh>
        {/* Left Leg */}
        <mesh position={[-0.17, 0.47, 0]}>
          <boxGeometry args={[0.22, 0.4, 0.22]} />
          <meshStandardMaterial color={colors.pants} roughness={0.85} />
        </mesh>
        <mesh position={[-0.17, 0.23, 0.03]}>
          <boxGeometry args={[0.24, 0.15, 0.3]} />
          <meshStandardMaterial color="#3E2E20" roughness={0.9} />
        </mesh>
        {/* Right Leg */}
        <mesh position={[0.17, 0.47, 0]}>
          <boxGeometry args={[0.22, 0.4, 0.22]} />
          <meshStandardMaterial color={colors.pants} roughness={0.85} />
        </mesh>
        <mesh position={[0.17, 0.23, 0.03]}>
          <boxGeometry args={[0.24, 0.15, 0.3]} />
          <meshStandardMaterial color="#3E2E20" roughness={0.9} />
        </mesh>
      </group>
    </>
  );
}

// Color picker row
function ColorRow(props) {
  var label = props.label;
  var options = props.options;
  var selected = props.selected;
  var onPick = props.onPick;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <span style={{ color: "#CDE8C0", fontFamily: "monospace", fontSize: 14, width: 50, textAlign: "right" }}>
        {label}
      </span>
      <div style={{ display: "flex", gap: 6 }}>
        {options.map(function (opt) {
          var isSelected = opt.hex === selected;
          return (
            <button
              key={opt.hex}
              onClick={function () { onPick(opt.hex); }}
              title={opt.name}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: isSelected ? "3px solid #FFFFFF" : "2px solid #4A6A40",
                background: opt.hex,
                cursor: "pointer",
                boxShadow: isSelected ? "0 0 8px rgba(255,255,255,0.5)" : "none",
                outline: "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// Gender toggle (Boy / Girl)
function GenderToggle(props) {
  var selected = props.selected;
  var onPick = props.onPick;
  var options = [
    { id: "boy", label: "Boy" },
    { id: "girl", label: "Girl" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <span style={{ color: "#CDE8C0", fontFamily: "monospace", fontSize: 14, width: 50, textAlign: "right" }}>
        Style
      </span>
      <div style={{ display: "flex", gap: 6 }}>
        {options.map(function (opt) {
          var isSelected = opt.id === selected;
          return (
            <button
              key={opt.id}
              onClick={function () { onPick(opt.id); }}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                border: isSelected ? "3px solid #FFFFFF" : "2px solid #4A6A40",
                background: isSelected ? "#3A6A30" : "#1A2A1A",
                color: isSelected ? "#E8FFE0" : "#8AAA80",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: 14,
                fontWeight: "bold",
                boxShadow: isSelected ? "0 0 8px rgba(255,255,255,0.3)" : "none",
                outline: "none",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Hair style picker
function HairStylePicker(props) {
  var selected = props.selected;
  var onPick = props.onPick;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <span style={{ color: "#CDE8C0", fontFamily: "monospace", fontSize: 14, width: 50, textAlign: "right" }}>
        Hair
      </span>
      <div style={{ display: "flex", gap: 6 }}>
        {HAIR_STYLES.map(function (style) {
          var isSelected = style.id === selected;
          return (
            <button
              key={style.id}
              onClick={function () { onPick(style.id); }}
              title={style.name}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: isSelected ? "3px solid #FFFFFF" : "2px solid #4A6A40",
                background: isSelected ? "#3A6A30" : "#1A2A1A",
                color: isSelected ? "#E8FFE0" : "#8AAA80",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: "bold",
                boxShadow: isSelected ? "0 0 8px rgba(255,255,255,0.3)" : "none",
                outline: "none",
              }}
            >
              {style.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Lobby(props) {
  var characterColors = props.characterColors;
  var setCharacterColors = props.setCharacterColors;
  var onStart = props.onStart;

  var _v = useState("main"); // "main" or "load"
  var view = _v[0], setView = _v[1];

  var _sl = useState(null);
  var savesInfo = _sl[0], setSavesInfo = _sl[1];

  function refreshSaves() {
    var info = [];
    for (var s = 1; s <= 3; s++) {
      info.push(getSaveInfo(s));
    }
    setSavesInfo(info);
  }

  function setColor(key, hex) {
    var next = Object.assign({}, characterColors);
    next[key] = hex;
    setCharacterColors(next);
  }

  function handleNewGame() {
    var slot = getFirstEmptySlot();
    onStart(characterColors, null, slot);
  }

  function handleLoad(slot) {
    var data = loadGame(slot);
    if (!data) return;
    // Merge saved colors with defaults so old saves get gender/hairStyle
    var savedColors = data.characterColors || {};
    var colors = Object.assign({}, characterColors, savedColors);
    onStart(colors, data, slot);
  }

  function handleDelete(slot) {
    deleteSave(slot);
    refreshSaves();
  }

  function showLoadScreen() {
    refreshSaves();
    setView("load");
  }

  var containerStyle = {
    width: "100%",
    height: "100vh",
    background: "linear-gradient(180deg, #0A1A0A 0%, #1A2E1A 50%, #0A1A0A 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "monospace",
    color: "#E8F0E0",
    overflow: "hidden",
  };

  var titleStyle = {
    fontSize: 42,
    fontWeight: "bold",
    color: "#88CC70",
    textShadow: "0 0 20px rgba(100,200,80,0.4), 0 2px 4px rgba(0,0,0,0.5)",
    marginBottom: 8,
    letterSpacing: 3,
  };

  var subtitleStyle = {
    fontSize: 14,
    color: "#6A9A5A",
    marginBottom: 20,
  };

  var previewStyle = {
    width: 200,
    height: 260,
    borderRadius: 12,
    border: "2px solid #3A5A30",
    overflow: "hidden",
    marginBottom: 16,
  };

  var buttonStyle = {
    padding: "12px 36px",
    fontSize: 18,
    fontFamily: "monospace",
    fontWeight: "bold",
    border: "2px solid #5A8A48",
    borderRadius: 8,
    cursor: "pointer",
    outline: "none",
    marginTop: 8,
  };

  var newGameBtnStyle = Object.assign({}, buttonStyle, {
    background: "#3A6A30",
    color: "#E8FFE0",
  });

  var loadBtnStyle = Object.assign({}, buttonStyle, {
    background: "#2A4A28",
    color: "#B8D8A8",
  });

  if (view === "load") {
    return (
      <div style={containerStyle}>
        <div style={{ fontSize: 28, fontWeight: "bold", color: "#88CC70", marginBottom: 24 }}>
          Load Game
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
          {savesInfo && savesInfo.map(function (info, idx) {
            var slot = idx + 1;
            if (!info) {
              return (
                <div key={slot} style={{
                  padding: "16px 20px",
                  background: "#1A2A1A",
                  border: "1px solid #2A4A28",
                  borderRadius: 8,
                  color: "#4A6A4A",
                  fontSize: 14,
                }}>
                  Slot {slot}: Empty
                </div>
              );
            }
            return (
              <div key={slot} style={{
                padding: "16px 20px",
                background: "#1A3A1A",
                border: "2px solid #4A7A40",
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }} onClick={function () { handleLoad(slot); }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: "#A8D8A0", marginBottom: 4 }}>
                    Slot {slot}
                  </div>
                  <div style={{ fontSize: 12, color: "#7AAA70" }}>
                    Gold: {info.gold} | Wood: {info.wood}
                    {info.hasHorse ? " | Horse" : ""}
                    {info.shopBuilt ? " | Shop" : ""}
                    {info.treasuresFound > 0 ? " | " + info.treasuresFound + " treasures" : ""}
                  </div>
                </div>
                <button
                  onClick={function (e) { e.stopPropagation(); handleDelete(slot); }}
                  style={{
                    background: "#5A2020",
                    color: "#FFA0A0",
                    border: "1px solid #8A4040",
                    borderRadius: 4,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontFamily: "monospace",
                    fontSize: 12,
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={function () { setView("main"); }}
          style={Object.assign({}, buttonStyle, {
            background: "#2A3A2A",
            color: "#8AAA80",
            marginTop: 20,
          })}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Forest Adventure</div>
      <div style={subtitleStyle}>by Anika</div>

      {/* Character preview */}
      <div style={previewStyle}>
        <Canvas camera={{ fov: 40, near: 0.1, far: 10, position: [0, 0.8, 3.5] }}>
          <CharacterPreview colors={characterColors} />
        </Canvas>
      </div>

      {/* Character options */}
      <div style={{ marginBottom: 16 }}>
        <GenderToggle
          selected={characterColors.gender}
          onPick={function (g) { setColor("gender", g); }}
        />
        <HairStylePicker
          selected={characterColors.hairStyle}
          onPick={function (s) { setColor("hairStyle", s); }}
        />
        <ColorRow
          label="Color"
          options={HAIR_COLORS}
          selected={characterColors.hair}
          onPick={function (h) { setColor("hair", h); }}
        />
        <ColorRow
          label="Shirt"
          options={SHIRT_COLORS}
          selected={characterColors.shirt}
          onPick={function (h) { setColor("shirt", h); }}
        />
        <ColorRow
          label="Pants"
          options={PANTS_COLORS}
          selected={characterColors.pants}
          onPick={function (h) { setColor("pants", h); }}
        />
        <ColorRow
          label="Skin"
          options={SKIN_COLORS}
          selected={characterColors.skin}
          onPick={function (h) { setColor("skin", h); }}
        />
      </div>

      {/* Buttons */}
      <button onClick={handleNewGame} style={newGameBtnStyle}>
        New Game
      </button>
      <button onClick={showLoadScreen} style={loadBtnStyle}>
        Load Game
      </button>
    </div>
  );
}

export default Lobby;
