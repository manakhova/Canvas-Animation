const canvas = document.getElementById("item-2");
const ctx = canvas.getContext('2d');

const config = {
  bgrColor: `rgba(50, 50, 50, 0.01)`,
  directionCount: 6,
  steptToTurn: 10,
  dotSize: 2,
  dotCount: 300,
  dotVelocity: 1,
  distance: 100,
  hue: 0,
  gradientLength: 4,
  angle: 45
} //меняй значения и увидишь разные эффекты

let w, h, cx, cy

function resizeCanvas() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  cx =  w / 2;
  cy =   h / 2;
}

function drawRect(color, x, y, w, h, shadowColor, shadowBlur, gco) {
  ctx.globalCompositeOperation = gco; //будет делать эффект при наложении точек
  ctx.shadowColor = shadowColor || `black`;
  ctx.shadowBlur  = shadowBlur || 1;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

class Dot {
  constructor() {
    this.position = {x: cx, y: cy};
    this.direction = config.directionCount == 6 ?
    (Math.random() * 3 | 0) * 2 : Math.random() * config.directionCount | 0;
    this.step = 0;
  }

  redrawDot() {
    let xy = Math.abs(this.position.x - cx) + Math.abs(this.position.y - cy);
    let makeHue = (config.hue + xy / config.gradientLength) & 360;
    let color = `hsl(${makeHue}, 100%, 50%)`;
    let size = config.dotSize;
    let x = this.position.x - size / 2;
    let y = this.position.y - size / 2;
    let blur = config.dotSize - Math.sin(xy / 8) * 2;

    drawRect(color, x, y, size, size, color, blur, `lighter`);
  }

  moveDot() {
    this.step++;
    this.position.x += directionList[this.direction].x * config.dotVelocity;
    this.position.y += directionList[this.direction].y * config.dotVelocity;
  }

  changeDirection() {
    if (this.step % config.steptToTurn === 0) {
    this.direction = Math.random() > 0.5 ? 
        (this.direction + 1) % config.directionCount : 
        (this.direction + config.directionCount - 1) % config.directionCount;
    }
  }

  deleteDot(id) {
    let percent = Math.exp(this.step / config.distance);
    if (percent > 100) {
    dotList.splice(id, 1);
    }
  }
}

let directionList = [];
function createDirections() {
  for(let i = 0; i < 360; i += 360 / config.directionCount) { //дели на кол-во направлений, получаем фигуру
    let angle = config.angle + i
    let x = Math.cos(angle * Math.PI / 180);
    let y = Math.sin(angle * Math.PI / 180);

    directionList.push({x: x, y: y});
  } 
}
createDirections();

let dotList = [];
function createDots() {
  if (dotList.length < config.dotCount && Math.random() > 0.8) {
    dotList.push(new Dot());
    config.hue = (config.hue + 1) % 360;
  }
}

function refreshDots() {
  dotList.forEach((dot, id) => {
    dot.moveDot();
    dot.redrawDot();
    dot.changeDirection();
    dot.deleteDot(id);
  })
}

function loop() {
  drawRect(config.bgrColor, 0, 0, w, h, 0, 0, `normal`);
  createDots();
  refreshDots();

  requestAnimationFrame(loop);
}

export function HexagonAnimation() {
  resizeCanvas();
  loop();
}