let x1 =7.0;
let x2 = 14.0;
let k = 50;
let l0 = 7.0;
let m1 = 5.0;
let m2 = 5.0;
let v1 = 0.0;
let v2 = 0.0;
let ms = 0.75;
let mk = 0.4;
let g = 9.81;
let a1 = 0;
let a2 = 0;
let changeInTime = 0.07;
let running = false;

let scaleFactor; // to convert simulation units to pixels

// initial states for reset
const initial = {
  x1: 7.0,
  x2: 14.0,
  v1: 0.0,
  v2: 0.0,
  a1: 0,
  a2: 0,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  scaleFactor = windowWidth / 30; // scale simulation units to screen width
}

function draw() {
  background(220);
  translate(windowWidth * 0.1, windowHeight * 0.55); // origin slightly lower to make floor visible
  scale(1, -1); // flip y-axis

  if (running) simulatePhysics();

  // convert simulation x-values to pixels
  let px1 = x1 * scaleFactor;
  let px2 = x2 * scaleFactor;

  let wallHeight = windowHeight * 0.05;   // wall height in vh
  let floorOffset = windowHeight * 0.01;  // floor thickness and shift downward
  let massSize = windowWidth * 0.02;      // mass size in vw


  // draw spring 1
  stroke(100, 100, 255);
  strokeWeight(2);
  line(0, 0, px1, 0);

  // draw spring 2
  stroke(50, 50, 50);
  strokeWeight(2);
  line(px1, 0, px2, 0);

  // draw spring 3
  stroke(100, 255, 100);
  strokeWeight(2);
  line(px2, 0, windowWidth * 0.7, 0);
  // draw fixed wall at left
  stroke(0);
  strokeWeight(wallHeight * 0.5);
  line(0, -wallHeight, 0, wallHeight);

  // draw fixed wall at right (70% of width)
  stroke(0);
  strokeWeight(wallHeight * 0.5);
  line(windowWidth * 0.7, -wallHeight, windowWidth * 0.7, wallHeight);

  // draw floor slightly lower
  stroke(0);
  strokeWeight(floorOffset);
  line(0, -floorOffset * 2.5, windowWidth * 0.7, -floorOffset * 2.5); 

  // draw masses
  fill(255, 100, 225);
  ellipse(px1, 0, massSize, massSize);
  fill(100, 255, 225);
  ellipse(px2, 0, massSize, massSize);
}

function simulatePhysics() {
  let f1 = (k / 100) * (l0 - x1) + (k / 100) * (x2 - x1 - l0);
  let f2 = (-k / 100) * (x2 - x1 - l0) + (k / 100) * (l0 - (x2 - l0));

  let fn1 = m1 * g;
  let fn2 = m2 * g;

  let ff1, ff2;
  let direction1, direction2;

  if (Math.abs(f1) <= ms * fn1) {
    ff1 = f1;
  } else {
    direction1 = v1 > 0 ? 1 : -1;
    ff1 = mk * fn1 * -1 * direction1;
  }

  if (Math.abs(f2) <= ms * fn2) {
    ff2 = f2;
  } else {
    direction2 = v2 > 0 ? 1 : -1;
    ff2 = mk * fn2 * -1 * direction2;
  }

  f1 += ff1;
  f2 += ff2;

  let a1Old = a1;
  let a2Old = a2;

  a1 = f1 / m1;
  a2 = f2 / m2;

  v1 = v1 + ((a1 + a1Old) / 2) * changeInTime;
  v2 = v2 + ((a2 + a2Old) / 2) * changeInTime;

  x1 = x1 + v1 * changeInTime;
  x2 = x2 + v2 * changeInTime;
}

function startStop() {
  running = !running;
}

function reset() {
  x1 = initial.x1;
  x2 = initial.x2;
  v1 = initial.v1;
  v2 = initial.v2;
  a1 = initial.a1;
  a2 = initial.a2;
  running = false;
}
