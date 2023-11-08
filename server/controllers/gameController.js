const uuid = require('uuid');
const path = require('path');
const APIError = require('../errors/APIError');
const { Game } = require('../models/models');

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

    async getAll() {

    }

    async getOne() {

    }

    async delete() {

    }
}

module.exports = new GameController();