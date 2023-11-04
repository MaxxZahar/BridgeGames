const APIError = require("../errors/APIError");
const bcrypt = require("bcrypt");
const jsonwebtoken = require('jsonwebtoken');
const { User } = require("../models/models");

const generateJWT = (id, email, name, role) => {
    return jsonwebtoken.sign({ id, email, name, role }, process.env.SECRET_KEY, { expiresIn: '24h' });
}

class UserController {
    async registration(req, res, next) {
        const { email, name, password, role } = req.body;
        if (!email || !name || !password) {
            return next(APIError.badRequest('Некорректные данные пользователя'));
        }
        const candidateEmail = await User.findOne({ where: { email } });
        const candidateName = await User.findOne({ where: { name } });
        if (candidateEmail) {
            return next(APIError.badRequest('Пользователь с таким адресом уже существует'));
        }
        if (candidateName) {
            return next(APIError.badRequest('Пользователь с таким именем уже существует'));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ email, name, role, password: hashPassword });
        const jwt = generateJWT(user.id, user.email, user.name, user.role);
        return res.json({ jwt });
    }

    async login(req, res, next) {
        const { name, password } = req.body;
        const user = await User.findOne({ where: { name } });
        if (!user) {
            return next(APIError.badRequest('Такой пользователь не существует'));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(APIError.badRequest('Неверный пароль'));
        }
        const jwt = generateJWT(user.id, user.email, user.name, user.role);
        return res.json({ jwt });
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