const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');
const { NODE_ENV, JWT_SECRET } = require('../config');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      next(new AuthError('Необходима авторизация'));
      return;
    }

    const token = extractBearerToken(authorization);
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

    req.user = payload;
  } catch (err) {
    next(new AuthError('Что-то пошло не так при авторизации'));
    return;
  }

  next();
};
