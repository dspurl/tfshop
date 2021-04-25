import Cookies from 'js-cookie'
const TokenPr = process.env.CACHE_PR

export function getToken(key) {
  return Cookies.get(TokenPr + key)
}

export function setToken(key, token) {
  return Cookies.set(TokenPr + key, token)
}

export function setExpiresToken(key, token ,time) {
  return Cookies.set(TokenPr + key, token, { expires: time})
}

export function removeToken(key) {
  return Cookies.remove(TokenPr + key)
}
