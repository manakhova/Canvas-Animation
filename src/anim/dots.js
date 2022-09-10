const config = {
  dotMinRadius: 6,
  dotMaxRadius: 20,
  sphereRadius: 300,
  massFactor: 0.002,
  defColor: `rgba(245, 78, 201)`,
  smooth: 0.75,
  cursorDotPadius: 35,
  mouseSize: 120
}

const TWO_PI = 2 * Math.PI;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const canvas = document.getElementById("item-1");
const ctx = canvas.getContext('2d');

let w, h, mouse, dots;

class Dot {
  constructor(r) {
    this.position = {x: mouse.x, y: mouse.y};
    this.vel = {x: 0, y: 0};
    this. radius = r || random(config.dotMinRadius, config.dotMaxRadius);
    this.mass = this.radius * config.massFactor;
    this.color = config.defColor;
  }

  _createCircle(x, y, radius, fill, color) {
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TWO_PI);
    ctx.closePath();
    fill ? ctx.fill() : ctx.stroke();
  }

  draw(x, y) {
    this.position.x = x ||  this.position.x + this.vel.x;
    this.position.y = y ||  this.position.y +this.vel.y;
    this._createCircle(this.position.x, this.position.y, this.radius, true, this.color);
    this._createCircle(this.position.x, this.position.y, this.radius, false, config.defColor);
  }
}

function updateDots() {
  for (let i = 1; i < dots.length; i++) {
    let acc = {x: 0, y: 0};

    for (let j = 0; j < dots.length; j++) {
    if (i === j) continue;
    let [a, b] = [dots[i], dots[j]];

    let delta  = {x: b.position.x - a.position.x, y: b.position.y - a.position.y};
    let dist   = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
    let force  = (dist - config.sphereRadius) / dist * b.mass;

    if (j === 0) {
        let alpha = config.mouseSize / dist;
        a.color   = `rgba(245, 78, 201, ${alpha})`;
        dist < config.mouseSize ? force = (dist - config.mouseSize) * b.mass : force = a.mass;
    }
    acc.x += delta.x * force;
    acc.y += delta.y * force;
    }

    dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
    dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
  }

  dots.map(d => d === dots[0] ? d.draw(mouse.x, mouse.y) : d.draw());
}

function setPosition({layerX, layerY}) {
  [mouse.x, mouse.y] = [layerX, layerY];
}

function isDown() {
  mouse.down = !mouse.down;
    }

    canvas.addEventListener('mousemove', setPosition);
    window.addEventListener('mousedown', isDown);
    window.addEventListener('mouseup', isDown);

function init() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  mouse = {x: w / 2, y:  h / 2, down: false};
  dots = [];

  dots.push(new Dot(config.cursorDotPadius))
}

function loop() {
  ctx.clearRect(0, 0, w, h);

  if (mouse.down) {
    dots.push(new Dot());
  }

  updateDots();
  window.requestAnimationFrame(loop);
}

export function DotAnimation() {
  init();
  loop();
}

