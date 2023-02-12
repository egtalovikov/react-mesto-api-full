const { NODE_ENV, JWT_SECRET, PORT = 3000 } = process.env;

module.exports = { PORT, JWT_SECRET, NODE_ENV };
