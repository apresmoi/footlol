module.exports = function player(_id, _x, _y) {
  this.id = _id;
  this.speed = 2;
  this.direction = { dx: 0, dy: 0 };
  this.position = { x: _x || 0, y: _y || 0 };
  this.updatePosition = function (direction) {
    this.position.x += direction.dx * this.speed;
    this.position.y += direction.dy * this.speed;
  };
};