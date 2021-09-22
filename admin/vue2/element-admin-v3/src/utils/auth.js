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

export function setToken(key, token, time = 0) {
  let expires = {}
  if (time) {
    expires = { expires: time }
  }
  if (key) {
    return Cookies.set(TokenPr + key, token, expires)
  } else {
    return Cookies.set(TokenKey, token, expires)
  }
}

export function removeToken(key) {
  if (key) {
    return Cookies.remove(TokenPr + key)
  } else {
    return Cookies.remove(TokenKey)
  }
}
