import { useEffect, useState } from "react";
import {
  withRouter,
  useHistory,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utils/auth.js";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import Login from "./Login";
import successImage from "../images/info-success.svg";
import failImage from "../images/info-fail.svg";

function App() {
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlace] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatar] = useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [selectedCard, setCard] = useState({ name: "", link: "" });
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [headerLink, changeHeaderLink] = useState({
    link: "sign-up",
    title: "Регистрация",
  });
  const [infoTooltipImage, changeInfoTooltipImage] = useState("");
  const [infoTooltipMessage, changeInfoTooltipMessage] = useState("");
  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard.link ||
    isInfoPopupOpen;

  useEffect(() => {
    handleTokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      api
        .loadUserInfo()
        .then((res) => {
          setCurrentUser(res);
        })
        .catch((err) => {
          console.log(err);
        });

      api
        .getInitialCards()
        .then((values) => {
          setCards(values);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  function handleTokenCheck() {
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      auth.checkToken(jwt).then((res) => {
        if (res) {
          setEmail(res.email);
          setLoggedIn(true);
          history.push("/");
        }
      });
    }
  }

  function handleEditAvatarClick() {
    setEditAvatar(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlace(true);
  }

  function handleCardClick(card) {
    setCard(card);
  }

  function handlePopupClose(evt) {
    if (
      evt.target.classList.contains("popup") ||
      evt.target.classList.contains("popup__close-button")
    ) {
      closeAllPopups();
    }
  }

  function closeAllPopups() {
    setEditAvatar(false);
    setIsEditProfilePopupOpen(false);
    setAddPlace(false);
    setIsInfoPopupOpen(false);
    setCard({ name: "", link: "" });
  }

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", closeByEscape);
      return () => {
        document.removeEventListener("keydown", closeByEscape);
      };
    }
  }, [isOpen]);

  function handleUpdateUser(user) {
    setIsLoading(true);
    api
      .editProfile(user)
      .then((res) => {
        setCurrentUser(res);
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api
      .changeAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        setEditAvatar(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c !== card));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setAddPlace(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleLogin(email, password, setValues) {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setEmail(email);
          setValues({});
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch(() => {
        changeInfoTooltipImage(failImage);
        changeInfoTooltipMessage("Что-то пошло не так! Попробуйте ещё раз.");
        setIsInfoPopupOpen(true);
      });
  }

  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res.status !== 400) {
          history.push("/sign-in");
          changeInfoTooltipImage(successImage);
          changeInfoTooltipMessage("Вы успешно зарегистрировались!");
        }
      })
      .catch(() => {
        changeInfoTooltipImage(failImage);
        changeInfoTooltipMessage("Что-то пошло не так! Попробуйте ещё раз.");
      })
      .finally(() => {
        setIsInfoPopupOpen(true);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header
        headerLink={headerLink}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        email={email}
      />
      <Switch>
        <Route path="/sign-up">
          <main className="content">
            <Register
              handleChangeHeaderLink={changeHeaderLink}
              onRegister={handleRegister}
            />
          </main>
        </Route>
        <Route path="/sign-in">
          <main className="content">
            <Login
              handleChangeHeaderLink={changeHeaderLink}
              onLogin={handleLogin}
            />
          </main>
        </Route>
        <ProtectedRoute
          exact
          path="/"
          component={Main}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          loggedIn={loggedIn}
        >
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-up" />}
        </ProtectedRoute>
      </Switch>
      {loggedIn && <Footer />}
      <EditAvatarPopup
        isLoading={isLoading}
        isOpen={isEditAvatarPopupOpen}
        onClose={handlePopupClose}
        onUpdateAvatar={handleUpdateAvatar}
      />
      <AddPlacePopup
        isLoading={isLoading}
        isOpen={isAddPlacePopupOpen}
        onClose={handlePopupClose}
        onAddPlace={handleAddPlaceSubmit}
      />
      <PopupWithForm
        isLoading={isLoading}
        name={"confirmation"}
        title={"Вы уверены?"}
        buttonText={"Да"}
        onClose={handlePopupClose}
      />
      <EditProfilePopup
        isLoading={isLoading}
        isOpen={isEditProfilePopupOpen}
        onClose={handlePopupClose}
        onUpdateUser={handleUpdateUser}
      />
      <ImagePopup card={selectedCard} onClose={handlePopupClose} />
      <InfoTooltip
        image={infoTooltipImage}
        isOpen={isInfoPopupOpen}
        name={"info"}
        message={infoTooltipMessage}
        onClose={handlePopupClose}
      />
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
