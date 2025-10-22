let v0 = 15;
let angle = 45;
let g = 9.8;
let t = 0;
let x, y;
let scale_factor; 
let projectile_moving = false; // controls start/stop motion
let points = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  scale_factor = windowWidth / 40; // make scaling relative to screen width
}

function draw() {
  background(220);
  push(); 
  translate(windowWidth*0.1, windowHeight*0.8); // origin near bottom-left
  scale(1, -1); // flip y-axis

  // get slider values
  v0 = document.getElementById("velocity").value;
  angle = document.getElementById("angle").value;

  // update slider numbers
  document.getElementById("velocity_value").innerText = v0;
  document.getElementById("angle_value").innerText = angle;

  let theta = radians(angle);

  // increment time if projectile moving
  if (projectile_moving) t += 0.02;

  // calculate projectile position
  x = v0 * cos(theta) * t * scale_factor;
  y = v0 * sin(theta) * t * scale_factor - 0.5 * g * t * t * scale_factor;

  // stop motion at ground
  if (y <= 0 && t > 0) {
    x=0
    y = 0;
    projectile_moving = false;
    t = 0;
  }

  // draw road with dashed lines
  strokeWeight(2);
  stroke(0);
  let road_y1 = -scale_factor; 
  let road_y2 = scale_factor; 
  for(let i=-windowWidth/10; i<windowWidth; i+=40){
    line(i, 0, i+20, 0); // dashed center line
  }
  line(-windowWidth/10, road_y1, windowWidth, road_y1); // bottom boundary
  line(-windowWidth/10, road_y2, windowWidth, road_y2); // top boundary

  // draw scoring target (relative positions)
  let target_x = scale_factor * 20; 
  ellipse(target_x, 0, scale_factor*4, scale_factor*1.8); // 1 point
  ellipse(target_x, 0, scale_factor*2.6, scale_factor*1.2); // 2 points
  ellipse(target_x, 0, scale_factor*1.4, scale_factor*0.4); // 3 points

  // draw projectile
  ellipse(x, y, scale_factor*0.8, scale_factor*0.8);

  //draw the points 
  points.push([x,y]) 
  for (let p of points){ 
    point(p[0],p[1]); 
    strokeWeight(3) 
  }
  

  pop();
}






// reset projectile to initial position
function reset_projectile(){
  angle = 45;
  v0 = 15;
  t = 0;
  projectile_moving = false;
  points = [];

  document.getElementById("angle").value = angle;
  document.getElementById("velocity").value = v0;
  document.getElementById("angle_value").innerText = angle;
  document.getElementById("velocity_value").innerText = v0;
}

// toggle motion for start/stop button
function toggle_motion(){
  projectile_moving = !projectile_moving;
}
