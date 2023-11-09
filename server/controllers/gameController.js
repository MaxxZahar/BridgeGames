const uuid = require('uuid');
const path = require('path');
const APIError = require('../errors/APIError');
const { Game, Tournament } = require('../models/models');
const jsonwebtoken = require('jsonwebtoken');

class GameController {
    async create(req, res, next) {
        console.log(req.body);
        try {
            const { date, tournamentId, westId, southId, eastId, northId } = req.body;
            const { pbn } = req.files;
            let fileName = uuid.v4() + ".pbn";
            pbn.mv(path.resolve(__dirname, '..', 'static', fileName));
            const game = await Game.create({ date, pbn: fileName, tournamentId, westId, southId, eastId, northId });
            return res.json(game);
        } catch (e) {
            return next(APIError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const games = await Game.findAll();
        res.json(games);
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const game = await Game.findOne({ where: { id } });
            return res.json(game);
        } catch (e) {
            return next(APIError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken.verify(token, process.env.SECRET_KEY);
            const userId = decoded.id;
            const role = decoded.role;
            const gameToDelete = await Game.findOne({ where: { id } });
            if (!gameToDelete) {
                return next(APIError.badRequest("Такой турнир не существует"));
            }
            const gameTournament = await Tournament.findOne({ where: { id: gameToDelete.tournamentId } });
            if (gameTournament.userId !== userId && role !== "ADMIN") {
                return next(APIError.forbidden("Операция не разрешена"));
            }
            await Game.destroy({ where: { id } });
            return res.json({ message: 'success' });
        } catch (e) {
            return next(APIError.notAuthorized(e.message));
        }
    }
}

module.exports = new GameController();