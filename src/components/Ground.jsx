import { useMemo } from "react";
import * as THREE from "three";
import { ZONES } from "../rendering/tiles.js";
import { SCALE, pointInPoly } from "../constants/world.js";

// Ground extends beyond the playable area to cover under the ocean
var GROUND_MIN_X = -2000;
var GROUND_MAX_X = 8000;
var GROUND_MIN_Z = -2000;
var GROUND_MAX_Z = 8000;
var GROUND_W = (GROUND_MAX_X - GROUND_MIN_X) * SCALE;
var GROUND_H = (GROUND_MAX_Z - GROUND_MIN_Z) * SCALE;

function Ground() {
  var geometry = useMemo(function () {
    var segW = 300;
    var segH = 300;
    var geo = new THREE.PlaneGeometry(GROUND_W, GROUND_H, segW, segH);
    geo.rotateX(-Math.PI / 2);

    // Shift so it covers from GROUND_MIN to GROUND_MAX
    var centerX = (GROUND_MIN_X + GROUND_MAX_X) / 2 * SCALE;
    var centerZ = (GROUND_MIN_Z + GROUND_MAX_Z) / 2 * SCALE;
    geo.translate(centerX, 0, centerZ);

    var positions = geo.attributes.position;
    var count = positions.count;
    var colors = new Float32Array(count * 3);

    // Default grass color
    var grassR = 0x4A / 255, grassG = 0x6B / 255, grassB = 0x38 / 255;

    // Parse hex color to [r, g, b] (0-1 range)
    function parseHex(hex) {
      var r = parseInt(hex.slice(1, 3), 16) / 255;
      var g = parseInt(hex.slice(3, 5), 16) / 255;
      var b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b];
    }

    // Pre-parse zone colors for performance
    var parsedZoneColors = [];
    for (var zi = 0; zi < ZONES.length; zi++) {
      parsedZoneColors.push(parseHex(ZONES[zi].color));
    }

    for (var i = 0; i < count; i++) {
      var vx = positions.getX(i);
      var vz = positions.getZ(i);

      // Convert 3D position back to 2D pixel coords for zone test
      var px = vx / SCALE;
      var py = vz / SCALE;

      var r = grassR, g = grassG, b = grassB;

      // Check zones in order (later zones override) - use each zone's actual color
      for (var z = 0; z < ZONES.length; z++) {
        if (pointInPoly(px, py, ZONES[z].points)) {
          var c = parsedZoneColors[z];
          r = c[0]; g = c[1]; b = c[2];
        }
      }

      // Add slight variation for natural look
      var noise = ((i * 127 + 53) % 100) / 100 * 0.06 - 0.03;
      colors[i * 3] = Math.max(0, Math.min(1, r + noise));
      colors[i * 3 + 1] = Math.max(0, Math.min(1, g + noise));
      colors[i * 3 + 2] = Math.max(0, Math.min(1, b + noise));
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.95} />
    </mesh>
  );
}

export default Ground;
