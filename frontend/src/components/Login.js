import React from "react";
import { withRouter } from "react-router-dom";
import { useForm } from "../hooks/useForm";

function Login({
  handleChangeHeaderLink,
  onLogin,
}) {
  React.useEffect(() => {
    handleChangeHeaderLink({ link: "sign-up", title: "Регистрация" });
  }, []);

  const { values, handleChange, setValues } = useForm({});

  function handleSubmit(e) {
    e.preventDefault();
    if (!values.email || !values.password) {
      return;
    }
    onLogin(values.email, values.password, setValues)
  }

  return (
    <section className="login">
      <p className="login__title">Вход</p>
      <form onSubmit={handleSubmit} className="login__form">
        <input
          className="login__input"
          required
          id="email"
          name="email"
          type="email"
          value={values.email || ""}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="login__input"
          required
          id="password"
          name="password"
          type="password"
          value={values.password || ""}
          onChange={handleChange}
          placeholder="Пароль"
        />
        <button
          type="submit"
          onSubmit={handleSubmit}
          className="login__button buttons"
        >
          Войти
        </button>
      </form>
    </section>
  );
}

export default withRouter(Login);
