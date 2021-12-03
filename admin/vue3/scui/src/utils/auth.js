import Cookies from 'js-cookie'

const TokenKey = process.env.VUE_APP_NAME_HEAD + '_Token'
const TokenPr = process.env.VUE_APP_NAME_HEAD + '_'

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
