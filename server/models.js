const champions = ['Lux', 'Garen', 'Yasuo', 'Darius']

const playerRadius = 30
const ballRadius = 15

function Player(_id, _name, _champion, _side, _x, _y) {
  this.id = _id;
  this.name = _name;
  this.speed = 2;
  this.side = _side;
  this.champion = _champion;
  this.direction = { dx: 0, dy: 0 };
  this.position = { x: _x || 0, y: _y || 0 };
  this.update = (direction) => {
    this.direction = direction;
    this.position.x += this.direction.dx * this.speed;
    this.position.y += this.direction.dy * this.speed;
  };
  this.serialize = () => {
    return {
      id: this.id,
      name: this.name,
      champion: this.champion,
      direction: this.direction,
      position: this.position
    }
  }
  this.isTouchingBall = (position) => {
    const distance = Math.sqrt(Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2))
    return distance <= (ballRadius + playerRadius)
  }
  this.isTouchingPlayer = (position) => {
    const distance = Math.sqrt(Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2))
    return distance <= (playerRadius + playerRadius)
  }
};

function Ball(_x, _y) {
  this.speed = 60;
  this.direction = { dx: 0, dy: 0 };
  this.position = { x: _x || 0, y: _y || 0 };
  this.update = (direction) => {
    this.direction = direction;
    this.position.x += this.direction.dx * this.speed;
    this.position.y += this.direction.dy * this.speed;
  };
  this.serialize = () => {
    return {
      position: this.position
    }
  }
  this.shootBall = (player) => {
    const x = player.position.x - this.position.x
    const y = player.position.y - this.position.y
    const angle = Math.atan(y / x)
    console.log(x, y, angle)
    this.position = {
      x: Math.round(this.position.x - Math.sign(x) * Math.cos(angle) * this.speed),
      y: Math.round(this.position.y - Math.sign(x) * Math.sin(angle) * this.speed),
    }
  }
};

module.exports = {
  Player,
  Ball,
}