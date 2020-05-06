const champions = ['Lux', 'Garen', 'Yasuo', 'Darius']
const [width, height] = [1900, 830]

const timeResolution = 20 / 1000
const meterRatio = 1900 / 120

const playerRadius = 25
const ballRadius = 12

const positions = [
  [[200, 415]],
  [[1700, 415]]
]

const round = (number, decimals = 2) => Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)

function Match(_id, _socket) {
  this.players = {}
  this.ball = new Ball();
  this.socket = _socket;

  this.serialize = () => {
    return {
      players: Object.keys(this.players).reduce((r, key) => {
        if (this.socket.clients().connected[key]) {
          r[key] = this.players[key].serialize()
        }
        return r;
      }, {}),
      ball: this.ball.serialize(),
    }
  }

  this.getPlayerList = () => {
    return Object.keys(this.players).map(key => this.players[key])
  }

  this.addPlayer = (client, id, name, champion) => {
    const side = Object.keys(this.players).length % 2 ? 0 : 1
    const sideLength = Object.keys(this.players).filter(key => this.players[key].side === side).length
    const [x, y] = positions[side][sideLength]
    this.players[id] = new Player(id, name, champion, side, x, y)

    client.emit('login_success', {
      ...this.players[id].serialize(),
      ...this.serialize(),
    });
    client.broadcast.emit('player_join', this.players[id].serialize());
  }

  this.removePlayer = (client, id) => {
    this.players = Object.keys(this.players).reduce((result, key) => {
      if (key !== id) result[key] = this.players[key]
      return result
    }, {})
    client.broadcast.emit('player_leave', { id: id });
  }

  this.playerDirectionChanged = (id, direction) => {
    if (this.players[id]) {
      this.players[id].updateDirection(direction);
    }
  }

  this.playerKeyPress = (id, code) => {
    switch (code) {
      case 'Space':
        if (this.players[id].isTouchingBall(this.ball.position)) {
          this.ball.shootBall(this.players[id])
        }
        break;
      default:
        this.players[id].keyPress(code)
        break;
    }
  }

  this._handlePlayersMoving = () => {
    let moving = false
    Object.keys(this.players).forEach(key => {
      if (this.players[key].isMoving()) {
        this.players[key].update(timeResolution)
        moving = true;
      }
    })
    return moving
  }

  this._handleCollideable = (collideable, collideables) => {
    if (collideable.position.x < 0) {
      if (collideable.willBounce) collideable.direction.dx = -1 * collideable.direction.dx
      collideable.position.x = 0
    }
    if (collideable.position.x > width) {
      if (collideable.willBounce) collideable.direction.dx = -1 * collideable.direction.dx
      collideable.position.x = width
    }

    if (collideable.position.y < 0) {
      if (collideable.willBounce) collideable.direction.dy = -1 * collideable.direction.dy
      collideable.position.y = 0
    }
    if (collideable.position.y > height) {
      if (collideable.willBounce) collideable.direction.dy = -1 * collideable.direction.dy
      collideable.position.y = height
    }

    const isCollisioning = (a, b) => {
      return round(Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2))) - (a.radius + b.radius) < 0
    }

    const distance = (a, b) => {
      return round(Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2)))
    }

    const fixCollision = (a, b) => {
      const x = a.position.x - b.position.x
      const y = a.position.y - b.position.y
      const angle = Math.atan(y / x)

      if (a.speed && b.speed) {
        //todo
      }
      else if(a.speed) {
        const overlap = a.radius - (distance(a, b) - b.radius)
        a.position.x -= overlap * Math.sign(x) * Math.cos(angle)
        a.position.y -= overlap * Math.sign(x) * Math.sin(angle)
      } else {
        const overlap = b.radius - (distance(a, b) - a.radius)
        b.position.x -= overlap * Math.sign(x) * Math.cos(angle)
        b.position.y -= overlap * Math.sign(x) * Math.sin(angle)
      }
    }

    collideables.forEach(x => {
      if (collideable.id !== x.id && isCollisioning(collideable, x)) {
        console.log("fixing collision")
        fixCollision(collideable, x)
      }
    })
  }

  this._handleCollisions = () => {
    let change = this.ball.update(timeResolution);
    this._handleCollideable(this.ball, [this.ball, ...this.getPlayerList()]);
    Object.keys(this.players).forEach(id => {
      // if (this.players[id].isTouchingBall(this.ball.position)) {
      //   this.ball.shootBall(this.players[id])
      //   change = true
      // }
      this._handleCollideable(this.players[id], [this.ball, ...this.getPlayerList()]);
    })
    return change
  }

  this._update = () => {
    const playersMoving = this._handlePlayersMoving()
    const collisionsChanged = this._handleCollisions()
    if (playersMoving || collisionsChanged) {
      this.socket.emit('update', this.serialize());
    }
  }

  this.interval = setInterval(() => {
    this._update()
  }, timeResolution * 1000);
}

function Player(_id, _name, _champion, _side, _x, _y) {
  this.willBounce = false;
  this.radius = playerRadius;

  this.id = _id;
  this.name = _name;
  this.weight = 50;
  this.acceleration = 15 * meterRatio;
  this.speed = 0; //9 should be realist... but its too slow
  this.max_speed = 15 * meterRatio;
  this.side = _side;
  this.champion = _champion;
  this.direction = { dx: 0, dy: 0 };
  this.position = { x: _x || 0, y: _y || 0 };
  this._evolve = (dt) => {
    this.speed += this.acceleration * dt
    if (this.speed > this.max_speed) this.speed = this.max_speed
  }
  this._updatePosition = (dt) => {
    this.position.x += round(this.direction.dx * this.speed * dt);
    this.position.y += round(this.direction.dy * this.speed * dt);
  }
  this.updateDirection = (_direction) => {
    this.direction = _direction;
  }
  this.update = (dt) => {
    this._evolve(dt)
    this._updatePosition(dt)
  };
  this.keyPress = (code) => {

  }
  this.serialize = () => {
    return {
      id: this.id,
      name: this.name,
      champion: this.champion,
      direction: this.direction,
      position: this.position
    }
  }
  this.isMoving = () => {
    return this.direction.dx || this.direction.dy ? true : false
  }
  this.isTouchingBall = (position) => {
    const distance = round(Math.sqrt(Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2)))
    return distance <= (ballRadius + playerRadius)
  }
  this.isTouchingPlayer = (position) => {
    const distance = round(Math.sqrt(Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2)))
    return distance <= (playerRadius + playerRadius)
  }
};

function Ball() {
  this.willBounce = true;
  this.radius = ballRadius;

  this.speed = 0;
  this.dampening = 3;
  this.weight = 1;
  this.direction = { dx: 0, dy: 0 };
  this.position = { x: width / 2, y: height / 2 };
  this.serialize = () => {
    return {
      position: this.position
    }
  }
  this.shootBall = (player) => {
    if (player.speed === 0) {//rebote
      this.direction = {
        dx: -1 * this.direction.dx,
        dy: -1 * this.direction.dy,
      }
    }
    else {
      const x = player.position.x - this.position.x
      const y = player.position.y - this.position.y
      const angle = Math.atan(y / x)
      this.speed = 0.07 * player.weight * player.speed / this.weight
      this.direction = {
        dx: round(Math.sign(x) * Math.cos(angle)),
        dy: round(Math.sign(x) * Math.sin(angle)),
      }
    }
  }
  this._evolve = (dt) => {
    const damp = -round(this.dampening * this.speed * dt)
    console.log(this.speed / meterRatio, this.speed, damp)
    this.speed = this.speed * dt < 1 || Math.abs(damp) > this.speed ? 0 : this.speed + damp
  }
  this._updatePosition = (dt) => {
    this.position.x -= round(this.direction.dx * this.speed * dt)
    this.position.y -= round(this.direction.dy * this.speed * dt)
  }
  this.update = (dt) => {
    if (this.speed) {
      this._evolve(dt);
      this._updatePosition(dt);
      return true
    }
    return false
  };
};

module.exports = {
  Match,
  Player,
  Ball,
}