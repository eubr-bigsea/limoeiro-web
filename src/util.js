import { toRaw, isRef, isReactive, isProxy } from 'vue'

export function debounce(fn, delay) {
  var timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    var args = arguments
    var that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}
export function deepToRaw(sourceObj) {
  const objectIterator = (input) => {
    if (Array.isArray(input)) {
      return input.map((item) => objectIterator(item))
    }
    if (isRef(input) || isReactive(input) || isProxy(input)) {
      return objectIterator(toRaw(input))
    }
    if (input && typeof input === 'object') {
      return Object.keys(input).reduce((acc, key) => {
        acc[key] = objectIterator(input[key])
        return acc
      }, {})
    }
    return input
  }

  return objectIterator(sourceObj)
}
let count = 0

export function newId(prefix = 'id-') {
  return `${prefix}${++count}`
}
export function createQueryString(obj) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v))
    } else if (typeof value === 'object' && value !== null) {
      for (const [innerKey, innerValue] of Object.entries(value)) {
        params.append(`${key}[${innerKey}]`, innerValue)
      }
    } else {
      params.append(key, value)
    }
  }

  return params.toString()
}

export function createRandomId(len = 4) {
  const array = new Uint8Array(len)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => ('0' + (byte % 36).toString(36)).slice(-1)).join('')
}

export function jsonReplacer(key, value) {
  return value === null ? undefined : value
}