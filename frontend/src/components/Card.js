import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = card.owner === currentUser._id;

  const cardDeleteButtonClassName = (
    `post__delete-button post__delete-button_visible ${isOwn ? 'post__delete-button_visible' : ''}`
  );

  const isLiked = card.likes.some(i => i === currentUser._id);

  const cardLikeButtonClassName = (
    `post__like ${isLiked ? 'post__like_active' : ''}`
  );

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <article className="post">
      <img onClick={handleClick} src={card.link} alt={card.name} className="post__photo" />
      <button onClick={handleDeleteClick} type="button" aria-label="Удаление карточки" className={cardDeleteButtonClassName}></button>
      <div className="post__bottom">
        <h2 className="post__title">{card.name}</h2>
        <div className="post__like-block">
          <button type="button" onClick={handleLikeClick} aria-label="Лайк" className={cardLikeButtonClassName}></button>
          <p className="post__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </article>
  )
}

export default Card;