import Player from "./collideables/player"
import Ball from "./collideables/ball"
import { Vector } from "./math"
import { ChampionName } from "../league/classes"
import { timeConstant, mapSize, mapInnerSize, goalSize, playerPositions } from "../globals"
import { Engine, World, Events, Body } from 'matter-js'
import { RectCollideable, Collideable, CircleCollideable, CompoundCollideable, PolygonCollideable } from "./collideables/physics"
import Wall from "./collideables/wall"
import Goal from "./collideables/goal"
import { TeamSide, RoomSensors, ResetType, ICollideableEventCollision } from "../types"
import TurnWall from "./collideables/turnwall"
import { Score } from "./score"
import { BallCategory, AbilityStunCategory, AbilityEffectCategory } from "./collideables/categories"
import Ring from "./collideables/ring"

export class Field {
    _id: string
    _name: string
    _players: { [x: string]: Player }
    _effectCollideables: Collideable[] = []
    _ball: Ball = new Ball(mapSize.center);
    _interval: NodeJS.Timeout
    _contdownTimeout: NodeJS.Timeout
    _engine: Engine
    _world: World
    _score: Score = new Score()
    _startTime: Date
    _victorySide: TeamSide = 'LEFT'
    _gameEnded: boolean = false

    _goal: boolean = false
    _sideTurn: TeamSide = 'LEFT' // this is the side that will start with control of the ball

    _walls: RectCollideable[] = [
        new Wall(new Vector(0, -100), mapSize.width, 100),
        new Wall(new Vector(0, mapSize.max.y), mapSize.width, 100),
        new Wall(new Vector(-100, 0), 100, mapSize.max.y),
        new Wall(new Vector(mapSize.max.x, 0), 100, mapSize.max.y),


        new Wall(new Vector(0, -100 + (mapSize.height - mapInnerSize.height) / 2), mapSize.width, 100, { collisionFilter: { mask: BallCategory } }),
        new Wall(new Vector(0, mapSize.max.y - (mapSize.height - mapInnerSize.height) / 2), mapSize.width, 100, { collisionFilter: { mask: BallCategory } }),

        new Wall(new Vector(-100 + (mapSize.width - mapInnerSize.width) / 2, 0), 100, (mapSize.height - goalSize.height) / 2, { collisionFilter: { mask: BallCategory } }),
        new Wall(new Vector(-100 + (mapSize.width - mapInnerSize.width) / 2, (mapSize.height + goalSize.height) / 2), 100, (mapSize.height - goalSize.height) / 2, { collisionFilter: { mask: BallCategory } }),

        new Wall(new Vector(mapSize.max.x - (mapSize.width - mapInnerSize.width) / 2, 0), 100, (mapSize.height - goalSize.height) / 2, { collisionFilter: { mask: BallCategory } }),
        new Wall(new Vector(mapSize.max.x - (mapSize.width - mapInnerSize.width) / 2, (mapSize.height + goalSize.height) / 2), 100, (mapSize.height - goalSize.height) / 2, { collisionFilter: { mask: BallCategory } }),
    ]

    _startWalls: { [side in TeamSide]: Collideable } = {
        'LEFT': new TurnWall('LEFT'),
        'RIGHT': new TurnWall('RIGHT')
    }

    _sensors: { [key in RoomSensors]: Goal } = {
        LEFT_GOAL: new Goal(mapSize.center.setX(0), 'LEFT'),
        RIGHT_GOAL: new Goal(new Vector(mapSize.max.x - (mapSize.width - mapInnerSize.width) / 2, mapSize.center.y), 'RIGHT')
    }

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this._players = {};

        this._engine = Engine.create();
        this._world = this._engine.world;
        this._world.bounds = mapSize;
        this._world.gravity.x = 0;
        this._world.gravity.y = 0;
        this._mountWalls()
    }

    __leave_countdown = 10
    __countdown = 5
    __seconds_limit = 600 + this.__countdown
    __seconds = 0

    _emit = () => {

    }

    _startGame = () => {
        console.log('_startGame')

        this._score = new Score()
        this._connectedPlayers().forEach(player => player.materialize(this._world))
        this._mountStartWalls();
        this._gameEnded = false
        this._victorySide = 'LEFT'
        this._effectCollideables = []

        this._contdownTimeout = setTimeout(() => {
            this._mountSensors()
            this._mountBall()
            Events.on(this._engine, 'collisionStart', this._handleCollisionsStart);
            Events.on(this._engine, 'collisionEnd', this._handleCollisionsEnd);
        }, this.__countdown * 1000);

        this._startTime = new Date();
        clearInterval(this._interval)
        this._interval = setInterval(() => {
            if (this.update() || this.__seconds !== this.getSeconds()) {
                this.__seconds = this.getSeconds()
                if (this.__seconds_limit - this.__seconds <= 0) {
                    this._endGame()
                    this._emit()
                }
                else
                    this._emit()
            }
        }, timeConstant)
    }

    _endGame() {
        console.log('_endGame')
        clearInterval(this._interval);
        this._victorySide = this._score.getWinner()
        this._gameEnded = true
        this.__seconds = 0;
        this._startTime = null;
        this._goal = false;
        this._sideTurn = 'LEFT'
        this._score.reset()
        this._unmountBall()
        this._unmountStartWalls()
        this._ball.clearKickers()
    }

    _reset(type: ResetType) {
        if (type === 'GOAL') {
            setTimeout(() => {
                this._goal = false
                this._unmountBall()
                this._mountBall()
                this._mountStartWalls()
                this._connectedPlayers().forEach(player => player.resetPosition(this._world))
                this._emit()
            }, 2900);
        }
        else if (type === 'RESET') {
            clearInterval(this._interval);
            clearTimeout(this._contdownTimeout);
            console.log('reset game')
            this._ball.clearKickers();
            this._victorySide = 'LEFT'
            this._sideTurn = 'LEFT'
            this._gameEnded = false
            this.__seconds = 0;
            this._startTime = null;
            this._goal = false;
            this._score.reset()
            this._unmountBall()
            this._unmountStartWalls()
        }
    }

    _mountWalls = () => {
        this._walls.forEach(wall => wall.materialize(this._world))
    }

    _mountStartWalls = () => {
        switch (this._score.lastGoalSide()) {
            case 'LEFT':
                this._sideTurn = 'RIGHT'
                break;
            case 'RIGHT':
                this._sideTurn = 'LEFT'
                break;
            default:
                break;
        }
        this._startWalls[this._sideTurn].materialize(this._world)
        this._startWalls[this._sideTurn === 'LEFT' ? 'RIGHT' : 'LEFT'].dematerialize()
    }

    _unmountStartWalls = () => {
        this._startWalls['LEFT'].dematerialize()
        this._startWalls['RIGHT'].dematerialize()
    }

    _mountBall = () => {
        this._ball.resetPosition();
        this._ball.setVelocity(new Vector(0, 0), 0);
        this._ball.materialize(this._world);
    }

    _unmountBall = () => {
        if (this._ball) {
            this._ball.dematerialize();
        }
    }

    _mountSensors = () => {
        Object.keys(this._sensors).forEach(key => this._sensors[key] ? this._sensors[key].materialize(this._world) : null)
    }

    addPlayer(id: string, name: string, champion: ChampionName): boolean {
        const players = this._connectedPlayers()
        const side: TeamSide = players.length % 2 ? 'RIGHT' : 'LEFT'

        if (players.length < 10) {
            this._players[id] = new Player(id, name, champion, playerPositions[side][players.filter(x => x._side === side).length], side);
        }

        return true
    }

    removePlayer(id: string) {
        if (this._players[id]) this._players[id].dematerialize();
        this._players = Object.keys(this._players).reduce((result, key) => {
            if (key !== id) result[key] = this._players[key]
            return result
        }, {})
    }

    playerDirectionChanged(id: string, { x, y }: { x: number, y: number }) {
        if (this._players[id]) this._players[id].changeDirection(new Vector(x, y));
    }

    playerKeyPress(id: string, code: string) {
        switch (code) {
            case 'Space':
                this._players[id].kick(this._ball)
                break;
            case 'KeyQ':
                const qResult = this._players[id].requestAbility('Q')
                if (qResult) this._addEffect(qResult)
                break
            case 'KeyW':
                const wResult = this._players[id].requestAbility('W')
                if (wResult) this._addEffect(wResult)
                break
            default:
                break;
        }
    }

    _connectedPlayers(): Player[] {
        return Object.keys(this._players).reduce((r, key) => {
            r.push(this._players[key])
            return r;
        }, [])
    }

    _resetPlayers() {
        Object.keys(this._players).forEach(id => {
            this._players[id].dematerialize()
            this._players[id] = new Player(id, this._players[id]._name, null, this._players[id]._startPosition, this._players[id]._side)
        })
    }

    _handleBallInsideGoal(sensor: Goal): void {
        if (this._goal) return // this avoids double goal in one turn

        const lastKicker = this._ball.getLastKicker()
        if (this._sensors.LEFT_GOAL === sensor) {
            //if the ball gets inside the Left side, the goal is for the right team
            this._goal = true
            this._score.addGoal('RIGHT', lastKicker.player, this.__seconds)
            this._reset('GOAL')
        } else if (this._sensors.RIGHT_GOAL === sensor) {
            //if the ball gets inside the right side,  the goal is for the left team
            this._goal = true
            this._score.addGoal('LEFT', lastKicker.player, this.__seconds)
            this._reset('GOAL')
        }
    }

    _handlePlayerBallProximity(player: Player, closeToBall: boolean): void {
        console.log('_handlePlayerBallProximity', player._name, closeToBall)
        player.allowPlayerToKick(closeToBall)
    }

    _handleCollisionsStart = (e: ICollideableEventCollision): void => {
        let pairs = e.pairs;

        for (let i = 0, j = pairs.length; i != j; ++i) {
            const pair = pairs[i];

            if (pair.bodyA.plugin.owner instanceof Player || !pair.bodyA.isSensor) {
                pair.bodyA.plugin.owner.handleCollision(pair.bodyB.plugin.owner)
            }
            if (pair.bodyB.plugin.owner instanceof Player || !pair.bodyB.isSensor) {
                pair.bodyB.plugin.owner.handleCollision(pair.bodyA.plugin.owner)
            }


            //Anything collides with an AbilityEffectCategory
            if (pair.bodyA.collisionFilter.category === AbilityEffectCategory
                && pair.bodyA.plugin.owner._id !== pair.bodyB.plugin.owner._id
            ) {
                console.log("collision with effect", pair.bodyA.plugin.owner._id, pair.bodyB.plugin.owner._id)
                if (pair.bodyA.plugin.handleCollision) pair.bodyA.plugin.handleCollision(pair.bodyB.plugin.owner)
                continue;
            }
            else if (pair.bodyB.collisionFilter.category === AbilityEffectCategory
                && pair.bodyA.plugin.owner._id !== pair.bodyB.plugin.owner._id
            ) {
                console.log("collision with effect", pair.bodyA.plugin.owner._id, pair.bodyB.plugin.owner._id)
                if (pair.bodyB.plugin.handleCollision) pair.bodyB.plugin.handleCollision(pair.bodyA.plugin.owner)
                continue;
            }

            //Anything collides with an AbilityStunCategory
            // A | B is AbilityStunCategory
            // A | B is anything
            if (pair.bodyA.collisionFilter.category === AbilityStunCategory
                && pair.bodyA.plugin.owner._id !== pair.bodyB.plugin.owner._id
                && !pair.bodyA.plugin.drawer.hasAlreadyCollided(pair.bodyB.plugin.owner._id)
            ) {
                console.log("collision with stun", pair.bodyA.plugin.owner._id, pair.bodyB.plugin.owner._id)
                pair.bodyA.plugin.drawer.addCollision(pair.bodyB.plugin.owner._id)
                if (pair.bodyA.plugin.handleCollision) pair.bodyA.plugin.handleCollision()
                pair.bodyB.plugin.owner.setVelocity(new Vector(0, 0), 0)
                pair.bodyB.plugin.owner.setStun(pair.bodyA.plugin.effectDuration)
                continue;
            }
            else if (pair.bodyB.collisionFilter.category === AbilityStunCategory
                && pair.bodyA.plugin.owner._id !== pair.bodyB.plugin.owner._id
                && !pair.bodyB.plugin.drawer.hasAlreadyCollided(pair.bodyA.plugin.owner._id)
            ) {
                console.log("collision with stun", pair.bodyA.plugin.owner._id, pair.bodyB.plugin.owner._id)
                pair.bodyB.plugin.drawer.addCollision(pair.bodyA.plugin.owner._id)
                if (pair.bodyB.plugin.handleCollision) pair.bodyB.plugin.handleCollision()
                pair.bodyA.plugin.owner.setVelocity(new Vector(0, 0), 0)
                pair.bodyA.plugin.owner.setStun(pair.bodyB.plugin.effectDuration)
                continue;
            }

            //Ball collides with Goals
            // A | B is ball
            // A | B is Goal SENSOR
            if (pair.bodyA.isSensor && pair.bodyA.plugin.owner instanceof Goal && pair.bodyB === this._ball._body) {
                this._handleBallInsideGoal(pair.bodyA.plugin.owner)
                continue;
            }
            else if (pair.bodyB.isSensor && pair.bodyB.plugin.owner instanceof Goal && pair.bodyA === this._ball._body) {
                this._handleBallInsideGoal(pair.bodyB.plugin.owner)
                continue;
            }

            //Player physical body collides with Ball
            //Player ability collides with Ball
            // A | B is ball
            // A | B is physical part of player
            if (!pair.bodyA.isSensor && pair.bodyA.plugin.owner instanceof Player && pair.bodyB.plugin.owner === this._ball) {
                this._ball.addKicker(this.__seconds, pair.bodyA.plugin.owner)
                continue;
            }
            else if (!pair.bodyB.isSensor && pair.bodyB.plugin.owner instanceof Player && pair.bodyA.plugin.owner === this._ball) {
                this._ball.addKicker(this.__seconds, pair.bodyB.plugin.owner)
                continue;
            }

            //Player sensor portion is overlaping with Ball
            // A | B is ball
            // A | B is SENSOR part of player
            if (pair.bodyA.isSensor && pair.bodyA.plugin.owner instanceof Player && pair.bodyB.plugin.owner === this._ball) {
                this._handlePlayerBallProximity(pair.bodyA.plugin.owner, true)
                continue;
            }
            else if (pair.bodyB.isSensor && pair.bodyB.plugin.owner instanceof Player && pair.bodyA.plugin.owner === this._ball) {
                this._handlePlayerBallProximity(pair.bodyB.plugin.owner, true)
                continue;
            }

        }
    }

    _handleCollisionsEnd = (e: ICollideableEventCollision): void => {
        const pairs = e.pairs;

        for (let i = 0, j = pairs.length; i != j; ++i) {
            const pair = pairs[i];

            if (pair.bodyA.collisionFilter.category === AbilityEffectCategory || pair.bodyB.collisionFilter.category === AbilityEffectCategory) {
                continue;
            }
            if (pair.bodyA.collisionFilter.category === AbilityStunCategory || pair.bodyB.collisionFilter.category === AbilityStunCategory) {
                continue;
            }

            //Player sensor portion is overlaping with Ball
            // A | B is ball
            // A | B is SENSOR part of player
            if (pair.bodyA.isSensor && pair.bodyA.plugin.owner instanceof Player && pair.bodyB.plugin.owner === this._ball) {
                this._handlePlayerBallProximity(pair.bodyA.plugin.owner, false)
                continue;
            }
            else if (pair.bodyB.isSensor && pair.bodyB.plugin.owner instanceof Player && pair.bodyA.plugin.owner === this._ball) {
                this._handlePlayerBallProximity(pair.bodyB.plugin.owner, false)
                continue;
            }
        }
    }

    _addEffect(collideable: Collideable) {
        this._effectCollideables.push(collideable)
    }

    _updateEffects() {
        this._effectCollideables = this._effectCollideables.reduce((result, collideable) => {
            if (collideable._expired) return result;

            if (collideable._mounted && collideable._body.plugin.duration <= collideable.getLife()) {
                collideable.dematerialize()
            } else {
                if (!collideable._mounted) {
                    if (collideable._body.plugin.velocity)
                        collideable.setVelocity((collideable._body.plugin.owner as Player)
                            ._facingVector.normalize()
                            .multiply(collideable._body.plugin.velocity + collideable._body.plugin.owner.getVelocity().module()))
                    collideable.setPosition(collideable._body.plugin.owner.getPosition())
                    collideable.materialize(this._world)
                }
                collideable.update(timeConstant)
                result.push(collideable)
            }
            return result
        }, [])
    }

    _serializeEffects() {
        return this._effectCollideables
            .filter(row => row._mounted)
            .map(effect => {
                return {
                    id: effect._body.plugin.id,
                    ...effect.serialize(),
                }
            })
    }

    update(): boolean {
        Engine.update(this._engine);

        this._updateEffects()
        this._connectedPlayers().forEach(player => player.update(timeConstant));
        if (this._ball) {
            this._ball.update(timeConstant);
            if (this._ball._body.speed > 0) this._unmountStartWalls()
        }

        return this._world.bodies.some(x => x.speed > 0)
    }

    getSeconds(): number {
        if (this._startTime)
            return Math.trunc((new Date().getTime() - this._startTime.getTime()) / 1000)
        return 0
    }


    _getAllObjects() {
        return this._world.bodies.map(body => {
            const type = (() => {
                if (body.plugin.owner instanceof CircleCollideable)
                    return 'circle'
                else if (body.plugin.owner instanceof RectCollideable)
                    return 'rect'
                else if (body.plugin.owner instanceof PolygonCollideable)
                    return 'polygon'
                else
                    return 'circle'
            })()
            return {
                type,
                position: Vector.fromMatter(body.position).serialize(),
                radius: body.circleRadius,
                width: body.bounds.max.x - body.bounds.min.x,
                height: body.bounds.max.y - body.bounds.min.y,
                points: (() => {
                    if (body.parts.length > 1)
                        return body.parts.map(x => [x.position.x, x.position.y])
                    return body.vertices.map(x => [x.x, x.y])
                })(),
                angle: body.angle,
            }
        })
    }

    serialize() {
        const seconds = this.getSeconds()
        return {
            players: Object.keys(this._players).reduce((r, key) => {
                r[key] = this._players[key].serialize()
                return r;
            }, {}),
            ball: this._ball._mounted ? this._ball.serialize() : null,
            score: this._score ? this._score.serialize() : null,
            time: this.__seconds_limit - seconds,
            countdown: this.__countdown > seconds ? this.__countdown - seconds : 0,
            victory: this._gameEnded ? this._victorySide : null,
            effects: this._serializeEffects()
        }
    }
}