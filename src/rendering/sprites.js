// Realistic character with natural proportions and shading

function drawPlayer(ctx, x, y, dir, frame, moving) {
  var bob = moving ? Math.sin(frame * 0.15) * 1.2 : 0;
  var armAngle = moving ? Math.sin(frame * 0.15) * 22 : 0;
  var legAngle = moving ? Math.sin(frame * 0.15) * 18 : 0;

  ctx.save();
  ctx.translate(x, y);

  // Ground shadow - soft oval
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath(); ctx.ellipse(0, 22, 11, 4, 0, 0, Math.PI * 2); ctx.fill();

  var facingDown = dir === 2;
  var facingUp = dir === 0;
  var facingRight = dir === 1;
  var facingLeft = dir === 3;

  // --- LEFT LEG ---
  ctx.save();
  ctx.translate(-4, 8 + bob);
  ctx.rotate(legAngle * Math.PI / 180);
  // Pant leg
  ctx.fillStyle = "#3A3E48";
  rr(ctx, -3, 0, 7, 13, 2);
  ctx.fillStyle = "#32363E";
  rr(ctx, 1, 0, 3, 13, 1);
  // Boot
  ctx.fillStyle = "#3E2E20";
  rr(ctx, -4, 11, 9, 6, 2);
  ctx.fillStyle = "#4A3A2A";
  rr(ctx, -4, 11, 9, 3, 2);
  // Sole
  ctx.fillStyle = "#2A1E14";
  ctx.fillRect(-4, 16, 9, 2);
  ctx.restore();

  // --- RIGHT LEG ---
  ctx.save();
  ctx.translate(4, 8 + bob);
  ctx.rotate(-legAngle * Math.PI / 180);
  ctx.fillStyle = "#3A3E48";
  rr(ctx, -4, 0, 7, 13, 2);
  ctx.fillStyle = "#32363E";
  rr(ctx, -4, 0, 3, 13, 1);
  ctx.fillStyle = "#3E2E20";
  rr(ctx, -5, 11, 9, 6, 2);
  ctx.fillStyle = "#4A3A2A";
  rr(ctx, -5, 11, 9, 3, 2);
  ctx.fillStyle = "#2A1E14";
  ctx.fillRect(-5, 16, 9, 2);
  ctx.restore();

  // --- TORSO ---
  ctx.save();
  ctx.translate(0, bob);
  // Jacket
  ctx.fillStyle = "#5A6A58";
  rr(ctx, -9, -10, 18, 20, 3);
  // Jacket shadow side
  ctx.fillStyle = "#4E5E4C";
  rr(ctx, 2, -10, 7, 20, 2);
  // Jacket fold line
  ctx.fillStyle = "#506050";
  ctx.fillRect(0, -8, 1, 16);
  // Collar
  ctx.fillStyle = "#6A7A68";
  rr(ctx, -6, -12, 12, 4, 2);
  // Pocket hint
  ctx.fillStyle = "#4E5E4C";
  ctx.fillRect(-7, 2, 5, 4);
  ctx.fillRect(3, 2, 5, 4);
  ctx.restore();

  // --- BACK ARM ---
  var side = facingRight ? -1 : 1;
  ctx.save();
  ctx.translate(side * 10, -5 + bob);
  ctx.rotate(-side * armAngle * Math.PI / 180);
  // Sleeve
  ctx.fillStyle = "#5A6A58";
  rr(ctx, -3, 0, 7, 7, 2);
  ctx.fillStyle = "#4E5E4C";
  rr(ctx, 1, 0, 3, 7, 1);
  // Forearm - skin
  ctx.fillStyle = "#C49A70";
  rr(ctx, -2, 6, 6, 7, 2);
  ctx.fillStyle = "#B88E64";
  rr(ctx, 2, 6, 2, 7, 1);
  // Hand
  ctx.fillStyle = "#C8A078";
  ctx.beginPath(); ctx.ellipse(1, 14, 3.5, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#BA9068";
  ctx.beginPath(); ctx.ellipse(2, 14, 2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // --- FRONT ARM ---
  ctx.save();
  ctx.translate(-side * 10, -5 + bob);
  ctx.rotate(side * armAngle * Math.PI / 180);
  ctx.fillStyle = "#5A6A58";
  rr(ctx, -3, 0, 7, 7, 2);
  ctx.fillStyle = "#4E5E4C";
  rr(ctx, -3, 0, 3, 7, 1);
  ctx.fillStyle = "#C49A70";
  rr(ctx, -2, 6, 6, 7, 2);
  ctx.fillStyle = "#B88E64";
  rr(ctx, -2, 6, 2, 7, 1);
  ctx.fillStyle = "#C8A078";
  ctx.beginPath(); ctx.ellipse(1, 14, 3.5, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#BA9068";
  ctx.beginPath(); ctx.ellipse(0, 14, 2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // --- NECK ---
  ctx.save();
  ctx.translate(0, bob);
  ctx.fillStyle = "#C49A70";
  ctx.fillRect(-3, -15, 6, 6);
  ctx.fillStyle = "#B88E64";
  ctx.fillRect(1, -15, 2, 6);
  ctx.restore();

  // --- HEAD ---
  ctx.save();
  ctx.translate(0, -20 + bob);

  // Head shape - base
  ctx.fillStyle = "#D4AA80";
  ctx.beginPath(); ctx.ellipse(0, 0, 10, 11, 0, 0, Math.PI * 2); ctx.fill();
  // Shadow side
  ctx.fillStyle = "#C49A70";
  ctx.beginPath(); ctx.ellipse(3, 1, 8, 10, 0, 0, Math.PI * 2); ctx.fill();
  // Light side
  ctx.fillStyle = "#DEBB90";
  ctx.beginPath(); ctx.ellipse(-3, -1, 6, 7, 0, 0, Math.PI * 2); ctx.fill();
  // Subtle warm tone
  ctx.fillStyle = "rgba(200,140,100,0.1)";
  ctx.beginPath(); ctx.ellipse(-2, 3, 4, 3, 0, 0, Math.PI * 2); ctx.fill();

  // Hair
  ctx.fillStyle = "#2A1E14";
  if (facingDown) {
    ctx.beginPath(); ctx.ellipse(0, -6, 11, 8, 0, 0, Math.PI * 2); ctx.fill();
    // Reshow forehead
    ctx.fillStyle = "#D4AA80";
    ctx.beginPath(); ctx.ellipse(0, 2, 9, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#C49A70";
    ctx.beginPath(); ctx.ellipse(3, 3, 7, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#DEBB90";
    ctx.beginPath(); ctx.ellipse(-3, 1, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
    // Hair line
    ctx.fillStyle = "#2A1E14";
    ctx.beginPath(); ctx.ellipse(0, -5, 10.5, 5, 0, 0, Math.PI); ctx.fill();
    // Side hair
    ctx.fillStyle = "#3A2E20";
    ctx.fillRect(-10, -4, 3, 7);
    ctx.fillRect(7, -4, 3, 7);
    // Hair strands
    ctx.fillStyle = "#362A1C";
    ctx.fillRect(-6, -9, 2, 4);
    ctx.fillRect(2, -10, 2, 5);
    ctx.fillRect(-2, -10, 2, 4);
  } else if (facingUp) {
    ctx.beginPath(); ctx.ellipse(0, -2, 11, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3A2E20";
    ctx.beginPath(); ctx.ellipse(-2, -3, 9, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1E14";
    ctx.beginPath(); ctx.ellipse(0, -5, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.beginPath(); ctx.ellipse(0, -6, 11, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#D4AA80";
    ctx.beginPath(); ctx.ellipse(facingRight ? 1 : -1, 2, 9, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#C49A70";
    ctx.beginPath(); ctx.ellipse(facingRight ? 4 : -4, 2, 6, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#DEBB90";
    ctx.beginPath(); ctx.ellipse(facingRight ? -1 : 1, 1, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1E14";
    ctx.beginPath(); ctx.ellipse(0, -5, 10.5, 5, 0, 0, Math.PI); ctx.fill();
    if (facingRight) {
      ctx.fillStyle = "#3A2E20";
      ctx.fillRect(-10, -4, 4, 9);
    } else {
      ctx.fillStyle = "#3A2E20";
      ctx.fillRect(6, -4, 4, 9);
    }
  }

  // Face features
  if (facingDown) {
    // Eyes
    ctx.fillStyle = "#F0EDE8";
    ctx.beginPath(); ctx.ellipse(-4, 0, 3, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4, 0, 3, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    // Iris
    ctx.fillStyle = "#5A7A48";
    ctx.beginPath(); ctx.ellipse(-3.5, 0.3, 2, 2.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4.5, 0.3, 2, 2.2, 0, 0, Math.PI * 2); ctx.fill();
    // Pupil
    ctx.fillStyle = "#1A1A1A";
    ctx.beginPath(); ctx.ellipse(-3.5, 0.4, 1, 1.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4.5, 0.4, 1, 1.2, 0, 0, Math.PI * 2); ctx.fill();
    // Eye shine
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath(); ctx.ellipse(-4.5, -0.5, 1, 0.8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(3.5, -0.5, 1, 0.8, 0, 0, Math.PI * 2); ctx.fill();
    // Upper eyelid shadow
    ctx.fillStyle = "rgba(100,70,50,0.15)";
    ctx.beginPath(); ctx.ellipse(-4, -1.5, 3.5, 1.5, 0, 0, Math.PI); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4, -1.5, 3.5, 1.5, 0, 0, Math.PI); ctx.fill();
    // Eyebrows
    ctx.strokeStyle = "#2A1E14";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-6, -3.5); ctx.quadraticCurveTo(-4, -5, -1.5, -3.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2, -3.5); ctx.quadraticCurveTo(4, -5, 6.5, -3.5); ctx.stroke();
    // Nose shadow
    ctx.fillStyle = "rgba(160,110,80,0.2)";
    ctx.beginPath(); ctx.ellipse(0.5, 3, 2, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(100,70,50,0.15)";
    ctx.fillRect(-0.5, 2, 2, 2);
    // Mouth
    ctx.fillStyle = "#A86858";
    ctx.beginPath(); ctx.ellipse(0.5, 6.5, 3, 1.2, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = "#C08070";
    ctx.beginPath(); ctx.ellipse(0.5, 6, 2.5, 0.8, 0, 0, Math.PI); ctx.fill();
  } else if (facingRight) {
    ctx.fillStyle = "#F0EDE8";
    ctx.beginPath(); ctx.ellipse(3.5, 0, 2.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#5A7A48";
    ctx.beginPath(); ctx.ellipse(4.2, 0.3, 1.8, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1A1A1A";
    ctx.beginPath(); ctx.ellipse(4.5, 0.4, 0.9, 1.1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath(); ctx.ellipse(3.5, -0.5, 0.8, 0.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#2A1E14";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(1.5, -3.5); ctx.quadraticCurveTo(3.5, -5, 6, -3.5); ctx.stroke();
    ctx.fillStyle = "rgba(160,110,80,0.2)";
    ctx.beginPath(); ctx.ellipse(7, 2, 1.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#A86858";
    ctx.beginPath(); ctx.ellipse(5, 6.5, 2, 1, 0, 0, Math.PI); ctx.fill();
  } else if (facingLeft) {
    ctx.fillStyle = "#F0EDE8";
    ctx.beginPath(); ctx.ellipse(-3.5, 0, 2.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#5A7A48";
    ctx.beginPath(); ctx.ellipse(-4.2, 0.3, 1.8, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1A1A1A";
    ctx.beginPath(); ctx.ellipse(-4.5, 0.4, 0.9, 1.1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath(); ctx.ellipse(-3.5, -0.5, 0.8, 0.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#2A1E14";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-1.5, -3.5); ctx.quadraticCurveTo(-3.5, -5, -6, -3.5); ctx.stroke();
    ctx.fillStyle = "rgba(160,110,80,0.2)";
    ctx.beginPath(); ctx.ellipse(-7, 2, 1.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#A86858";
    ctx.beginPath(); ctx.ellipse(-5, 6.5, 2, 1, 0, 0, Math.PI); ctx.fill();
  }

  ctx.restore(); // head
  ctx.restore(); // main
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.fill();
}

export { drawPlayer };
