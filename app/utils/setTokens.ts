export function setToken(data: string) {
  sessionStorage.setItem('diatonicToken', data)
}

export function removeToken() {
  sessionStorage.removeItem('diatonicToken')
}

export function isauthenticated() {
  const isauth = sessionStorage.getItem('diatonicToken') !== ''
  return isauth
}
