let x1 = 7.0, x2 = 14.0;
let k = 50, l0 = 7.0;
let m1 = 5.0, m2 = 5.0;
let v1 = 0, v2 = 0;
let ms = 0.75, mk = 0.4;
let g = 9.81;
let a1 = 0, a2 = 0;
let dt = 0.07;
let running = false;
let scale_factor;
const initial = { x1:7, x2:14, v1:0, v2:0, a1:0, a2:0 };
let dragging_1=false, dragging_2=false;

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("springCanvasContainer");
    scale_factor = windowWidth / 30;
}

function draw() {
    clear(); 
    background(0,0,0,0); 
    translate(windowWidth*0.1, windowHeight*0.55);
    scale(1,-1);

    m1 = parseFloat(document.getElementById("m1").value);
    m2 = parseFloat(document.getElementById("m2").value);
    k = parseFloat(document.getElementById("k").value);
    mk = parseFloat(document.getElementById("mk").value);

    document.getElementById("m1_value").innerText = m1;
    document.getElementById("m2_value").innerText = m2;
    document.getElementById("k_value").innerText = k;
    document.getElementById("mk_value").innerText = mk;

    if(running) simulate_physics();

    let px1 = x1 * scale_factor;
    let px2 = x2 * scale_factor;
    let wall_height = windowHeight*0.05;
    let floor_offset = windowHeight*0.01;
    let mass_size = windowWidth*0.02;

    function draw_spring(x_start, x_end, y, coils=8, amplitude=10){
        stroke(255);
        strokeWeight(2);
        noFill();
        beginShape();
        for(let i=0;i<=100;i++){
            let t = i/100;
            let xi = x_start + t*(x_end-x_start);
            let yi = y + amplitude*sin(TWO_PI*coils*t);
            vertex(xi,yi);
        }
        endShape();
    }

    draw_spring(0, px1, 0);
    draw_spring(px1, px2, 0);
    draw_spring(px2, windowWidth*0.7, 0);

    stroke(0);
    strokeWeight(wall_height*0.5);
    line(0,-wall_height,0,wall_height);
    line(windowWidth*0.7,-wall_height,windowWidth*0.7,wall_height);

    strokeWeight(floor_offset);
    line(0,-floor_offset*2.5,windowWidth*0.7,-floor_offset*2.5);

    fill(255,100,225);
    ellipse(px1,0,mass_size,mass_size);
    fill(100,255,225);
    ellipse(px2,0,mass_size,mass_size);
}

function simulate_physics(){
    let f1 = (k/100)*(l0-x1) + (k/100)*(x2-x1-l0);
    let f2 = (-k/100)*(x2-x1-l0) + (k/100)*(l0-(x2-l0));
    let fn1 = m1*g, fn2 = m2*g;
    let ff1, ff2, dir1, dir2;
    ff1 = Math.abs(f1)<=ms*fn1 ? f1 : mk*fn1*-Math.sign(v1);
    ff2 = Math.abs(f2)<=ms*fn2 ? f2 : mk*fn2*-Math.sign(v2);
    f1 += ff1; f2 += ff2;
    let a1_old=a1, a2_old=a2;
    a1=f1/m1; a2=f2/m2;
    v1+= (a1+a1_old)/2*dt; v2+= (a2+a2_old)/2*dt;
    x1+=v1*dt; x2+=v2*dt;
}

function start_stop(){running=!running;}

function mousePressed(){
    let px1=x1*scale_factor, px2=x2*scale_factor;
    let mx=mouseX-windowWidth*0.1, my=windowHeight*0.55-mouseY;
    let mass_size=windowWidth*0.02;
    if(dist(mx,my,px1,0)<mass_size/2){dragging_1=true; running=false;}
    else if(dist(mx,my,px2,0)<mass_size/2){dragging_2=true; running=false;}
}

function mouseDragged(){
    if(dragging_1){x1=constrain((mouseX-windowWidth*0.1)/scale_factor,0,x2-1);}
    if(dragging_2){x2=constrain((mouseX-windowWidth*0.1)/scale_factor,x1+1,(windowWidth*0.7)/scale_factor);}
}

function mouseReleased(){
    if(dragging_1||dragging_2){dragging_1=false; dragging_2=false; running=true;}
}

function reset() {
    running = false;

    x1 = initial.x1;
    x2 = initial.x2;
    v1 = 0;
    v2 = 0;
    a1 = 0;
    a2 = 0;


    document.getElementById("m1").value = m1 = 5.0;
    document.getElementById("m2").value = m2 = 5.0;
    document.getElementById("k").value  = k  = 50;
    document.getElementById("mk").value = mk = 0.4;

    document.getElementById("m1_value").innerText = 5.0;
    document.getElementById("m2_value").innerText = 5.0;
    document.getElementById("k_value").innerText  = 50;
    document.getElementById("mk_value").innerText = 0.4;
}

