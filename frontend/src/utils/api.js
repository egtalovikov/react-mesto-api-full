class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  _request(url, options) {
    return fetch(url, options).then(this._getResponseData)
  }

  loadUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: {...this._headers, authorization: `Bearer ${localStorage.getItem('jwt')}`}
    })
  }

  changeLikeCardStatus(id, state) {
    if (state) {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        method: 'PUT',
        headers: {...this._headers, authorization: `Bearer ${localStorage.getItem('jwt')}`}
      })
    } else {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        method: 'DELETE',
        headers: {...this._headers, authorization: `Bearer ${localStorage.getItem('jwt')}`}
      })
    }
  }
  
  deleteCard(idNumber) {
    return this._request(`${this._baseUrl}/cards/${idNumber}`, {
      method: 'DELETE',
      headers: {...this._headers, authorization: `Bearer ${localStorage.getItem('jwt')}`}
    })
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: {...this._headers, authorization: `Bearer ${localStorage.getItem('jwt')}`}
    })
  }

  addCard(inputValues) {
    return this._request(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {...this._headers, authorization: `Bearer ${localStorage.getItem('jwt')}`},
      body: JSON.stringify({
        name: inputValues.name,
        link: inputValues.link
      }),
    })
  }

  editProfile(inputValues) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {...this._headers, authorization: `Bearer ${localStorage.getItem('jwt')}`},
      body: JSON.stringify({
        name: inputValues.name,
        about: inputValues.about
      })
    })
  }

  changeAvatar(inputValues) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {...this._headers, authorization: `Bearer ${localStorage.getItem('jwt')}`},
      body: JSON.stringify({
        avatar: inputValues.avatar
      })
    })
  }
}

const api = new Api({
  baseUrl: 'https://api.mesto.egtalovikov.nomoredomainsclub.ru',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;