// p5js full script
// xhs：@lingbelinging
// fish model&texture from: https://free3d.com/3d-model/3d-fish-model-low-poly-63627.html
// a-rainy-day:

let fishModel;
let fishTexture;
let raindrops = [];
let rainCount = 600;
let dryRadius = 180;
let rainHeight = 800;
let mainBlueColor;

function preload() {
  fishModel = loadModel('fish.obj', true);
  fishTexture = loadImage('fish_texture.png');
}

function setup() {
  let dim = min(windowWidth, windowHeight);
  createCanvas(dim, dim, WEBGL);
  noStroke();

  mainBlueColor = color(100, 170, 255); // 统一蓝色调

  for (let i = 0; i < rainCount; i++) {
    raindrops.push(new RainDrop(true));
  }
}

function draw() {
  background(255); 
  camera(0, -400, 600, 0, 0, 0, 0, 1, 0);
  ambientLight(200); 
  directionalLight(255, 255, 255, 0.5, 1, -0.5);

  push();
  rotateX(HALF_PI); 
  translate(0, 0, 1); 
  noStroke(); 
  
  let r = red(mainBlueColor);
  let g = green(mainBlueColor);
  let b = blue(mainBlueColor);

  fill(r, g, b, 20);
  ellipse(0, 0, dryRadius * 2.8, dryRadius * 2.8);
  fill(r, g, b, 60);
  ellipse(0, 0, dryRadius * 2.2, dryRadius * 2.2);
  fill(r, g, b, 150);
  ellipse(0, 0, dryRadius * 1.8, dryRadius * 1.8);
  pop();

  push();
  translate(0, -10, 0);

  if (fishModel) {
    rotateY(frameCount * 0.01); 
    scale(1); 
    rotateZ(HALF_PI); 

    noStroke();
    if (fishTexture) {
      texture(fishTexture);
    } else {
      ambientMaterial(200);
    }
    model(fishModel);
  }
  pop();

  for (let drop of raindrops) {
    drop.update();
    drop.show();
  }
}

function windowResized() {
  let dim = min(windowWidth, windowHeight);
  resizeCanvas(dim, dim);
}


class RainDrop {
  constructor(initialStart = false) {
    this.isSplashing = false;
    this.splashTimer = 0;
    this.splashMaxTime = random(10, 20);
    this.reset(initialStart);
  }

  reset(initialStart) {
    this.isSplashing = false;
    this.splashTimer = 0;

    let validPosition = false;
    let x, z;
    let spawnRange = 1000;

    while (!validPosition) {
      x = random(-spawnRange, spawnRange);
      z = random(-spawnRange, spawnRange);
      let d = dist(x, z, 0, 0);
      if (d > dryRadius * 1.1) {
        validPosition = true;
      }
    }

    let startY = -rainHeight;
    if (initialStart) {
       startY = random(-rainHeight, 0);
    }

    this.pos = createVector(x, startY, z);
    this.vel = createVector(0, random(15, 25), 0);
    this.len = random(20, 40);
  }

  update() {
    if (this.isSplashing) {
      this.splashTimer++;
      if (this.splashTimer > this.splashMaxTime) {
        this.reset();
      }
    } else {
      this.pos.add(this.vel);
      if (this.pos.y > 0) {
        this.isSplashing = true;
        this.pos.y = 0.5;
      }
    }
  }

  show() {
    let r = red(mainBlueColor);
    let g = green(mainBlueColor);
    let b = blue(mainBlueColor);
    
    if (this.isSplashing) {
      push();
      translate(this.pos.x, this.pos.y, this.pos.z);
      rotateX(HALF_PI);
      noFill();
      let progress = this.splashTimer / this.splashMaxTime;
      let alpha = map(progress, 0, 1, 200, 0);
      let rad = map(progress, 0, 1, 5, 50);
      stroke(r, g, b, alpha);
      strokeWeight(2);
      ellipse(0, 0, rad, rad);
      pop();
    } else {
      stroke(r, g, b, 150);
      strokeWeight(1.5);
      line(this.pos.x, this.pos.y, this.pos.z,
           this.pos.x, this.pos.y - this.len, this.pos.z);
    }
  }
}
