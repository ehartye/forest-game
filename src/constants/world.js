// World constants and collision for 3D game

var ZONES_DATA = null;
var TREES_DATA = null;
var ROCKS_DATA = null;

var SCALE = 0.1;
var WORLD_3D_W = 480;
var WORLD_3D_H = 360;
var PLAYER_HEIGHT = 1.8;
var PLAYER_RADIUS = 0.8;

function toWorld(px, py) {
  return [px * SCALE, 0, py * SCALE];
}

function fromWorld(x, z) {
  return [x / SCALE, z / SCALE];
}

function pointInPoly(px, py, pts) {
  var inside = false;
  for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function isBlocked(x3d, z3d, zones, trees, rocks, houses) {
  var px = x3d / SCALE;
  var py = z3d / SCALE;
  var playerR = 8;

  // Water zones (shallow ponds are walkable!)
  for (var i = 0; i < zones.length; i++) {
    if (zones[i].type === "water" && !zones[i].shallow && !zones[i].swimmable && pointInPoly(px, py, zones[i].points)) return true;
  }
  // Tree trunks
  for (var t = 0; t < trees.length; t++) {
    var tr = trees[t];
    var dx = px - tr.x, dy = py - tr.y;
    if (Math.abs(dx) < tr.trunk + playerR && Math.abs(dy) < 10 + playerR) return true;
  }
  // Rocks
  for (var r = 0; r < rocks.length; r++) {
    var rk = rocks[r];
    var dx2 = px - rk.x, dy2 = py - rk.y;
    if (dx2 * dx2 + dy2 * dy2 < (rk.size + playerR) * (rk.size + playerR) * 0.3) return true;
  }
  // House walls
  if (houses) {
    for (var h = 0; h < houses.length; h++) {
      var house = houses[h];
      var hw = house.w / 2;
      var hd = house.d / 2;
      var hx = house.x;
      var hy = house.y;
      var wallThick = 6;
      var doorHW = house.doorW / 2;

      // Left wall
      if (px > hx - hw - playerR && px < hx - hw + wallThick + playerR &&
          py > hy - hd - playerR && py < hy + hd + playerR) return true;
      // Right wall
      if (px > hx + hw - wallThick - playerR && px < hx + hw + playerR &&
          py > hy - hd - playerR && py < hy + hd + playerR) return true;
      // Back wall
      if (py > hy - hd - playerR && py < hy - hd + wallThick + playerR &&
          px > hx - hw - playerR && px < hx + hw + playerR) return true;
      // Front wall - left segment (door gap in center)
      if (py > hy + hd - wallThick - playerR && py < hy + hd + playerR &&
          px > hx - hw - playerR && px < hx - doorHW + playerR) return true;
      // Front wall - right segment
      if (py > hy + hd - wallThick - playerR && py < hy + hd + playerR &&
          px > hx + doorHW - playerR && px < hx + hw + playerR) return true;
    }
  }
  // World bounds (water zones handle most edges, this is a safety net)
  if (px < -1500 || px > 7800 || py < -1500 || py > 6500) return true;
  return false;
}

export { SCALE, WORLD_3D_W, WORLD_3D_H, PLAYER_HEIGHT, PLAYER_RADIUS, toWorld, fromWorld, pointInPoly, isBlocked };
