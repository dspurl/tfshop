import Cookies from 'js-cookie'
const TokenPr = process.env.CACHE_PR

export function getToken(key) {
  return Cookies.get(TokenPr + key)
}

export function setToken(key, token, time = 0) {
  let expires = {}
  if (time) {
    expires = { expires: time }
  }
  if (key) {
    return Cookies.set(TokenPr + key, token, expires)
  } else {
    return Cookies.set(TokenPr, token, expires)
  }
}

export function removeToken(key) {
  return Cookies.remove(TokenPr + key)
}
