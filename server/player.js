module.exports = function player(_id, _x, _y) {
  this.id = _id;
  this.position = { x: _x || 0, y: _y || 0 };
  this.updatePosition = function (position) {
    this.position.x = position.x;
    this.position.y = position.y;
  };
};