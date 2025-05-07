let bgColor1;
let bgColor2;
let inkColorDark;
let lineColor;

let innerRectX, innerRectY, innerRectW, innerRectH;

let P_TL, P_TR, P_BL, P_BR;
let P_div_L, P_div_R;
let fraction_div = 0.485;

let el1_cx, el1_cy, el1_w, el1_h;
let el2_cx, el2_cy, el2_w, el2_h;

let animationTime = 0;

function setup() {
  createCanvas(400, 400);

  bgColor1 = color(243, 239, 230);
  bgColor2 = color(247, 244, 235);
  inkColorDark = color(8, 8, 8);
  lineColor = color(10, 10, 10);

  innerRectX = 33;
  innerRectY = 33;
  innerRectW = width - 2 * innerRectX;
  innerRectH = height - 2 * innerRectY;

  P_TL = createVector(62, 84);
  P_TR = createVector(339, 80);
  P_BL = createVector(98, 291);
  P_BR = createVector(303, 285);

  P_div_L = p5.Vector.lerp(P_TL, P_BL, fraction_div);
  P_div_R = p5.Vector.lerp(P_TR, P_BR, fraction_div);

  let trapezoid_top_width = P_TR.x - P_TL.x;
  let trapezoid_avg_height = (P_BL.y - P_TL.y + (P_BR.y - P_TR.y)) / 2;
  let trapezoid_visual_centerX = (P_TL.x + P_TR.x + P_BL.x + P_BR.x) / 4;

  el1_w = trapezoid_top_width * 0.67;
  el1_h = trapezoid_avg_height * 0.60;
  el1_cx = trapezoid_visual_centerX - trapezoid_top_width * 0.265;
  el1_cy = P_TL.y + trapezoid_avg_height * 0.625;

  el2_w = trapezoid_top_width * 0.61;
  el2_h = trapezoid_avg_height * 0.645;
  el2_cx = trapezoid_visual_centerX + trapezoid_top_width * 0.240;
  el2_cy = P_TR.y + trapezoid_avg_height * 0.345;
}

function getXonLineSegment(pA, pB, y_target) {
  let minY = min(pA.y, pB.y) - 0.1;
  let maxY = max(pA.y, pB.y) + 0.1;
  if (y_target < minY || y_target > maxY) return null;
  if (abs(pA.y - pB.y) < 0.01) return pA.x;
  let t = (y_target - pA.y) / (pB.y - pA.y);
  return pA.x + t * (pB.x - pA.x);
}

function draw() {
  background(bgColor1);

  noStroke();
  for (let i = 0; i < 50000; i++) {
    let x = random(width);
    let y = random(height);
    let speckleSize = random(0.3, 1.5);
    let r_offset = random(-9, 5);
    let g_offset = random(-9, 5);
    let b_offset = random(-9, 5);
    fill(
      max(0, red(bgColor1) + r_offset),
      max(0, green(bgColor1) + g_offset),
      max(0, blue(bgColor1) + b_offset),
      random(4, 12)
    );
    ellipse(x, y, speckleSize, speckleSize);
  }

  push();
  noStroke();
  fill(bgColor2);
  rect(innerRectX, innerRectY, innerRectW, innerRectH);
  for (let i = 0; i < 20000; i++) {
    let x = innerRectX + random(innerRectW);
    let y = innerRectY + random(innerRectH);
    let speckleSize = random(0.3, 1.4);
    let r_offset = random(-7, 4);
    let g_offset = random(-7, 4);
    let b_offset = random(-7, 4);
    fill(
      max(0, red(bgColor2) + r_offset),
      max(0, green(bgColor2) + g_offset),
      max(0, blue(bgColor2) + b_offset),
      random(3, 10)
    );
    ellipse(x, y, speckleSize, speckleSize);
  }
  pop();

  // Elipses com animação alternada
  noStroke();
  fill(bgColor2);

  let pulse1 = 1 + 0.05 * sin(animationTime);
  let pulse2 = 1 - 0.05 * sin(animationTime);

  let current_el1_w = el1_w * pulse1;
  let current_el1_h = el1_h * pulse1;

  let current_el2_w = el2_w * pulse2;
  let current_el2_h = el2_h * pulse2;

  ellipse(el1_cx, el1_cy, current_el1_w, current_el1_h);
  ellipse(el2_cx, el2_cy, current_el2_w, current_el2_h);

  animationTime += 0.03;
}