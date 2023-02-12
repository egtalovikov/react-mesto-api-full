const ValidationError = require('mongoose/lib/error/validation');
const CastError = require('mongoose/lib/error/cast');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const MyValidationError = require('../errors/my-validation-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner likes')
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new MyValidationError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить карточку другого пользователя');
      }
      card.delete();
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new MyValidationError('Карточка с  указанным _id не найдена'));
        return;
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        likes: req.user._id,
      },
    },
    {
      new: true,
    },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new MyValidationError('Передан несуществующий _id карточки'));
        return;
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  }, { new: true })
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new MyValidationError('Передан несуществующий _id карточки'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
