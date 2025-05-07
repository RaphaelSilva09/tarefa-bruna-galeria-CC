// Sketch em P5.js que recria uma imagem artística com formas, texturas e cores

let bgColor1; // Cor de fundo do papel externo
let bgColor2; // Cor do retângulo interno e das elipses
let inkColorDark; // Cor preta principal das áreas escuras
let lineColor; // Cor das linhas horizontais

let innerRectX, innerRectY, innerRectW, innerRectH; // Dimensões do retângulo interno

// Pontos de canto da forma escura principal
let P_TL, P_TR, P_BL, P_BR; // Topo esquerda, topo direita, base esquerda, base direita

// Posição da linha divisória entre a parte com linhas e a parte sólida
let P_div_L, P_div_R;
let fraction_div = 0.43; // Proporção da altura até a divisão

// Parâmetros das elipses
let el1_cx, el1_cy, el1_w, el1_h; // Elipse esquerda
let el2_cx, el2_cy, el2_w, el2_h; // Elipse direita

function setup() {
  createCanvas(400, 400);
  noLoop();

  // Definindo cores principais
  bgColor1 = color(243, 239, 230);
  bgColor2 = color(247, 244, 235);
  inkColorDark = color(8, 8, 8);
  lineColor = color(10, 10, 10);

  // Definindo o retângulo interno (área de desenho)
  innerRectX = 33;
  innerRectY = 33;
  innerRectW = width - 2 * innerRectX;
  innerRectH = height - 2 * innerRectY;

  // Coordenadas da forma preta em trapézio
  P_TL = createVector(62, 82.5);
  P_TR = createVector(340, 78.5);
  P_BL = createVector(98, 287.5);
  P_BR = createVector(302, 281.5);

  // Calculando os pontos intermediários da divisão horizontal
  P_div_L = p5.Vector.lerp(P_TL, P_BL, fraction_div);
  P_div_R = p5.Vector.lerp(P_TR, P_BR, fraction_div);

  // Calculando dimensões auxiliares para posicionar as elipses
  let trapezoid_top_width = P_TR.x - P_TL.x;
  let trapezoid_avg_height = (P_BL.y - P_TL.y + (P_BR.y - P_TR.y)) / 2;
  let trapezoid_visual_centerX = (P_TL.x + P_TR.x + P_BL.x + P_BR.x) / 4;

  // Parâmetros ajustados da elipse esquerda
  el1_w = trapezoid_top_width * 0.638;
  el1_h = trapezoid_avg_height * 0.615;
  el1_cx = trapezoid_visual_centerX - trapezoid_top_width * 0.252;
  el1_cy = P_TL.y + trapezoid_avg_height * 0.61;

  // Parâmetros ajustados da elipse direita
  el2_w = trapezoid_top_width * 0.618;
  el2_h = trapezoid_avg_height * 0.632;
  el2_cx = trapezoid_visual_centerX + trapezoid_top_width * 0.235;
  el2_cy = P_TR.y + trapezoid_avg_height * 0.358;
}

// Retorna a coordenada x de um ponto em uma linha entre dois pontos dados um y
function getXonLineSegment(pA, pB, y_target) {
  let minY = min(pA.y, pB.y) - 0.1;
  let maxY = max(pA.y, pB.y) + 0.1;
  if (y_target < minY || y_target > maxY) {
    return null;
  }
  if (abs(pA.y - pB.y) < 0.01) return pA.x;
  let t = (y_target - pA.y) / (pB.y - pA.y);
  return pA.x + t * (pB.x - pA.x);
}

function draw() {
  // Fundo externo do papel
  background(bgColor1);

  // Textura de papel com pontos sutis aleatórios
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
      random(5, 15)
    );
    ellipse(x, y, speckleSize, speckleSize);
  }

  // Retângulo interno ("moldura") e sua textura
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
      random(4, 12)
    );
    ellipse(x, y, speckleSize, speckleSize);
  }
  pop();

  // Linhas horizontais na parte superior da forma preta
  let lineBaseStrokeWeight = 1.9;
  let lineSpacing = 2.85;
  stroke(lineColor);
  let y_lines_start = min(P_TL.y, P_TR.y);
  let y_lines_end = max(P_div_L.y, P_div_R.y);

  for (let y_current = y_lines_start; y_current <= y_lines_end + lineBaseStrokeWeight / 2; y_current += lineSpacing) {
    let x_start = getXonLineSegment(P_TL, P_BL, y_current);
    let x_end = getXonLineSegment(P_TR, P_BR, y_current);

    if (x_start !== null && x_end !== null) {
      let effective_y = y_current + random(-0.15, 0.15);
      let currentStrokeWeight = lineBaseStrokeWeight + random(-0.1, 0.1);
      strokeWeight(currentStrokeWeight);

      let numSegments = 5;
      let prev_x = x_start;
      let prev_y = effective_y + random(-0.2, 0.2);

      for (let seg = 1; seg <= numSegments; seg++) {
        let t = seg / numSegments;
        let current_x = lerp(x_start, x_end, t);
        let current_y = effective_y + random(-0.2, 0.2);
        if (random() > 0.01) {
          line(prev_x, prev_y, current_x, current_y);
        }
        prev_x = current_x;
        prev_y = current_y;
      }
    }
  }

  // Parte inferior sólida da forma preta
  fill(inkColorDark);
  noStroke();
  beginShape();
  vertex(P_div_L.x, P_div_L.y);
  vertex(P_div_R.x, P_div_R.y);
  vertex(P_BR.x, P_BR.y);
  vertex(P_BL.x, P_BL.y);
  endShape(CLOSE);

  // Linhas horizontais sutis (grão) sobre a base sólida
  let numGrainLines = 600;
  let y_grain_start = min(P_div_L.y, P_div_R.y);
  let y_grain_end = max(P_BL.y, P_BR.y);

  for (let i = 0; i < numGrainLines; i++) {
    let y_grain = random(y_grain_start, y_grain_end);
    let x_left_grain = getXonLineSegment(P_TL, P_BL, y_grain);
    let x_right_grain = getXonLineSegment(P_TR, P_BR, y_grain);

    if (x_left_grain !== null && x_right_grain !== null) {
      let currentGrainLineWidth = x_right_grain - x_left_grain;
      let startOffset = random(currentGrainLineWidth * 0.005, currentGrainLineWidth * 0.04);
      let endOffset = random(currentGrainLineWidth * 0.005, currentGrainLineWidth * 0.04);

      let grain_alpha = random(25, 90);
      let grain_color_val;
      let grain_stroke_w;

      if (random() < 0.7) {
        grain_color_val = random(red(inkColorDark) + 5, red(inkColorDark) + 25);
        grain_stroke_w = random(0.3, 0.7);
      } else {
        grain_color_val = random(red(inkColorDark) + 30, red(inkColorDark) + 70);
        grain_stroke_w = random(0.4, 0.9);
      }

      stroke(grain_color_val, grain_alpha);
      strokeWeight(grain_stroke_w);
      line(x_left_grain + startOffset, y_grain, x_right_grain - endOffset, y_grain);
    }
  }

  // Elipses finais por cima da arte
  noStroke();
  fill(bgColor2);
  ellipse(el1_cx, el1_cy, el1_w, el1_h);
  ellipse(el2_cx, el2_cy, el2_w, el2_h);
}
