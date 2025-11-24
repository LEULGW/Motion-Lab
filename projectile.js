let v0 = 15;
let angle = 45;
let g = 9.8;
let t = 0;
let x = 0, y = 0;
let scale_factor;
let projectile_moving = false;
let points = [];
let star_popup = null; // {text, x, y, timer, size, rise, alpha}

let velocity_slider, angle_slider;

function setup() {
  createCanvas(windowWidth, windowHeight);
  scale_factor = windowWidth / 40;

  velocity_slider = document.getElementById("velocity");
  angle_slider = document.getElementById("angle");
}

function drawBackground() {
  let skyTop = color(135, 206, 250);
  let skyBottom = color(100, 149, 237);

  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height * 0.7, 0, 1);
    let c = lerpColor(skyTop, skyBottom, inter);
    stroke(c);
    line(0, y, width, y);
  }

  noStroke();
  fill(70, 130, 180);
  beginShape();
  vertex(0, height * 0.7);
  vertex(width * 0.2, height * 0.5);
  vertex(width * 0.4, height * 0.7);
  vertex(width * 0.6, height * 0.45);
  vertex(width * 0.8, height * 0.7);
  vertex(width, height * 0.55);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  fill(80, 200, 120);
  rect(0, height * 0.7, width, height * 0.3);

  fill(60);
  rect(0, height * 0.757, width, height * 0.09);
}

function draw() {
  background(220);
  drawBackground();

  push();
  translate(windowWidth * 0.1, windowHeight * 0.8);
  scale(1, -1);

  v0 = parseFloat(velocity_slider.value);
  angle = parseFloat(angle_slider.value);
  document.getElementById("velocity_value").innerText = v0;
  document.getElementById("angle_value").innerText = angle;

  let theta = radians(angle);

  if (projectile_moving) t += 0.02;

  x = v0 * cos(theta) * t * scale_factor;
  y = v0 * sin(theta) * t * scale_factor - 0.5 * g * t * t * scale_factor;

  // ---- Ground collision logic ----
  if (y <= 0 && t > 0) {
    y = 0;
    projectile_moving = false;

    let target_x = scale_factor * 20;
    let dx = x - target_x;

    let stars = "";
    if (Math.abs(dx) <= scale_factor * 0.7) stars = "★★★";
    else if (Math.abs(dx) <= scale_factor * 1.3) stars = "★★";
    else if (Math.abs(dx) <= scale_factor * 2) stars = "★";

    if (stars !== "") {
      star_popup = {
        text: stars,
        x: target_x,
        y: -30,    
        timer: 45, 
        size: 10,
        rise: 0,
        alpha: 255   
      };
    }

    setTimeout(() => {
      x = 0;
      y = 0;
      t = 0;
      points = [];
    }, 150);
  }

  // ---- Road Markings ----
  strokeWeight(2);
  stroke(255);
  for (let i = -windowWidth / 10; i < windowWidth; i += 40) {
    line(i, 0, i + 20, 0);
  }

  let road_y1 = -scale_factor;
  let road_y2 = scale_factor;
  line(-windowWidth / 10, road_y1, windowWidth, road_y1);
  line(-windowWidth / 10, road_y2, windowWidth, road_y2);

  // ---- Target ----
  let target_x = scale_factor * 20;
  fill(255, 0, 0);
  ellipse(target_x, 0, scale_factor * 4, scale_factor * 1.8);
  fill(255);
  ellipse(target_x, 0, scale_factor * 2.6, scale_factor * 1.2);
  fill(255, 0, 0);
  ellipse(target_x, 0, scale_factor * 1.4, scale_factor * 0.4);

  // ---- Projectile ----
  fill(255);
  ellipse(x, y, scale_factor * 0.8, scale_factor * 0.8);

  // ---- Trajectory Points ----
  points.push([x, y]);
  stroke(255);
  strokeWeight(3);
  for (let p of points) point(p[0], p[1]);

  pop();

  // ⭐ ---- STAR POPUP (fade + rise + size grow) ---- ⭐
  if (star_popup) {
    star_popup.rise += 4;    
    star_popup.size += 1.3;  
    star_popup.alpha -= 6;   // <-- fade-out

    fill(255, 215, 0, star_popup.alpha);
    textAlign(CENTER);
    textSize(star_popup.size);

    text(
      star_popup.text,
      windowWidth * 0.1 + star_popup.x,
      windowHeight * 0.75 - star_popup.y - star_popup.rise
    );

    star_popup.timer--;
    if (star_popup.alpha <= 0 || star_popup.timer <= 0) {
      star_popup = null;
    }
  }
}

function reset_projectile() {
  angle = 45;
  v0 = 15;
  t = 0;
  projectile_moving = false;
  points = [];

  velocity_slider.value = v0;
  angle_slider.value = angle;
  document.getElementById("velocity_value").innerText = v0;
  document.getElementById("angle_value").innerText = angle;
}

function toggle_motion() {
  projectile_moving = !projectile_moving;
}
