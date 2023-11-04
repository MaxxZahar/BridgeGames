const sequelize = require('../db');
const { DataTypes, Sequelize } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'USER' }
});

const Player = sequelize.define('player', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false }
});

const Tournament = sequelize.define('tournament', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Game = sequelize.define('game', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pbn: { type: DataTypes.STRING },
    date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW }
});

const Hand = sequelize.define('hand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    contract: { type: DataTypes.INTEGER, allowNull: false },
    declarer: { type: DataTypes.STRING },
    lead: { type: DataTypes.STRING },
    tricks: { type: DataTypes.INTEGER },
    number: { type: DataTypes.INTEGER, unique: true, allowNull: false }
});

const GamePlayer = sequelize.define('player_game', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});


User.hasMany(Tournament);
Tournament.belongsTo(User);

Tournament.hasMany(Game);
Game.belongsTo(Tournament);

Game.hasMany(Hand);
Hand.belongsTo(Game);

Player.belongsToMany(Game, { through: GamePlayer });
Game.belongsToMany(Player, { through: GamePlayer });

module.exports = {
    User, Player, Tournament, Game, Hand, GamePlayer
};