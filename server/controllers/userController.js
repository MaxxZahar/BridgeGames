const APIError = require("../errors/APIError");

class UserController {
    async registration() {

    }

    async login() {

    }

    async check(req, res, next) {
        const { id } = req.query;
        if (!id) {
            return next(APIError.badRequest('No id'));
        }
        res.json(id);
    }
}

module.exports = new UserController();