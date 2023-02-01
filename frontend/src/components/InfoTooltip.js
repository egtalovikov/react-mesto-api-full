function InfoTooltip({isOpen, name, onClose, image, message}) {
    return (
        <div onClick={(evt) => onClose(evt)} className={`popup popup_${name} ${isOpen ? 'popup_opened' : ''}`}>
          <div className="popup__container">
            <button type="button" aria-label="Закрытие попапа" className="popup__close-button buttons"></button>
            <div className="popup__info-image" style={{ backgroundImage: `url(${image})` }} ></div>
            <h2 className="popup__title popup__title_info">{message}</h2>
          </div>
        </div>
    )
  }
  
  export default InfoTooltip;