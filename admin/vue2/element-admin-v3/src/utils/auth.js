import Cookies from 'js-cookie'

const TokenKey = 'DsTifaweb-Admin-Token'
const TokenPr = 'DsTifaweb-Admin-'

export function getToken(key) {
  if (key) {
    return Cookies.get(TokenPr + key)
  } else {
    return Cookies.get(TokenKey)
  }
}

export function setToken(key, token) {
  if (key) {
    return Cookies.set(TokenPr + key, token)
  } else {
    return Cookies.set(TokenKey, token)
  }
}

export function removeToken(key) {
  if (key) {
    return Cookies.remove(TokenPr + key)
  } else {
    return Cookies.remove(TokenKey)
  }
}
