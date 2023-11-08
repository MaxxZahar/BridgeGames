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
            return next(APIError.notAuthorized('Хм авторизован'));
        }
    }

    async getAll() {

    }

    async getOne() {

    }

    async delete() {

    }
}

module.exports = new TournamentController();