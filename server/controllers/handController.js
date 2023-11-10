const { Hand, Game, Tournament } = require('../models/models');
const APIError = require('../errors/APIError');
const jsonwebtoken = require('jsonwebtoken');

class HandController {
    async create(req, res, next) {
        try {
            const { contract, declarer, lead, tricks, number, gameId } = req.body;
            const hand = await Hand.create({ contract, declarer, lead, tricks, number, gameId });
            return res.json(hand);
        } catch (e) {
            return next(APIError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const hands = await Hand.findAll();
        return res.json(hands);
    }

    async delete(req, res, next) {
        const { id } = req.params;
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken.verify(token, process.env.SECRET_KEY);
            const userId = decoded.id;
            const role = decoded.role;
            const handToDelete = await Hand.findOne({ where: { id } });
            if (!handToDelete) {
                return next(APIError.badRequest("Такой сдачи не существует"));
            }
            const handGame = await Game.findOne({ where: { id: handToDelete.gameId } });
            const gameTournament = await Tournament.findOne({ where: { id: handGame.tournamentId } });
            if (gameTournament.userId !== userId && role !== "ADMIN") {
                return next(APIError.forbidden("Операция не разрешена"));
            }
            await Hand.destroy({ where: { id } });
            return res.json({ message: 'success' });
        } catch (e) {
            return next(APIError.notAuthorized(e.message));
        }
    }
}

module.exports = new HandController();