const APIError = require('../errors/APIError');
const { Tournament } = require('../models/models');
const jsonwebtoken = require('jsonwebtoken');

class TournamentController {
    async create(req, res, next) {
        const { name } = req.body;
        if (!name) {
            return next(APIError.badRequest('Некорректное название матча'));
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken.verify(token, process.env.SECRET_KEY);
            const userId = decoded.id;
            const tournament = await Tournament.create({ name: name, userId: userId });
            return res.json(tournament);
        } catch (e) {
            return next(APIError.notAuthorized(e.message));
        }
    }

    async getAll(req, res) {
        const tournaments = await Tournament.findAll();
        res.json(tournaments);
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const tournament = await Tournament.findOne({ where: { id } });
            return res.json(tournament);
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
            const tournamentToDelete = await Tournament.findOne({ where: { id } });
            if (!tournamentToDelete) {
                return next(APIError.badRequest("Такой турнир не существует"));
            }
            if (tournamentToDelete.userId !== userId && role !== "ADMIN") {
                return next(APIError.forbidden("Операция не разрешена"));
            }
            await Tournament.destroy({ where: { id } });
            return res.json({ message: 'success' });
        } catch (e) {
            return next(APIError.notAuthorized(e.message));
        }
    }
}

module.exports = new TournamentController();