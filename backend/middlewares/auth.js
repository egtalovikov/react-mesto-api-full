const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { email } = req.body;

  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      next(new AuthError('Необходима авторизация'));
      return;
    }

    const token = extractBearerToken(authorization);
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

    User.findOne({ email }).select('+password')
      .then((user) => {
        if (!user) {
          next();
          return;
        }
        req.user = payload;
      })
      .catch(next);
  } catch (err) {
    next(new AuthError('Что-то пошло не так при авторизации'));
    return;
  }

  next();
};
