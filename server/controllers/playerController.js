const { Player } = require('../models/models');
const APIError = require('../errors/APIError');

class PlayerController {
    async create(req, res) {
        const { firstName, lastName } = req.body;
        const player = await Player.create({ first_name: firstName, last_name: lastName });
        return res.json(player);
    }

    async getAll(req, res) {
        const players = await Player.findAll();
        return res.json(players);
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const player = await Player.findOne({ where: { id } });
            return res.json(player);
        } catch (e) {
            next(APIError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        try {
            await Player.destroy({ where: { id } });
            return res.json({ message: 'success' });
        } catch (e) {
            next(APIError.badRequest(e.message));
        }
    }
}

module.exports = new PlayerController();