import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../logo.svg';

function Header({ headerLink, email, loggedIn, setLoggedIn, setCurrentUser }) {
  const history = useHistory();
  function signOut() {
    localStorage.removeItem('jwt');
    history.push('/sign-in');
    setLoggedIn(false);
    setCurrentUser({});
  }

  const [isMenuButtonClick, setIsMenuButtonClick] = React.useState(false);

  function handleMenuButtonClick() {
    setIsMenuButtonClick(!isMenuButtonClick);
  }

  return (
    <header className="header">
      {loggedIn ? (
        <div className={`header__menu ${isMenuButtonClick ? 'header__menu_active' : ''}`}>
          <p className="header__email">{email}</p>
          <button onClick={signOut} className='header__signout-button buttons'>Выйти</button>
        </div>
      ) : ''}
      <div className="header__container">
        <img src={logo} alt="Логотип Mesto Russia" className="header__logo" />
        {loggedIn ? (
          <>
            <div onClick={handleMenuButtonClick} className="header__menu-button">
              <span className={`header__burger-line ${isMenuButtonClick ? 'header__burger-line_active' : ''}`}></span>
              <span className={`header__burger-line ${isMenuButtonClick ? 'header__burger-line_active' : ''}`}></span>
              <span className={`header__burger-line ${isMenuButtonClick ? 'header__burger-line_active' : ''}`}></span>
            </div>
            <div className="header__signout">
              <p className="header__email">{email}</p>
              <button onClick={signOut} className='header__signout-button buttons'>Выйти</button>
            </div>
          </>
        ) : (
          <Link to={headerLink.link} className="header__link">{headerLink.title}</Link>
        )}
      </div>
    </header>
  )
}

export default Header; 