// I don't know why it's not in javascript
// I which javascript were in python

// From https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
export const range = (end) => [...Array(end).keys()]

// From https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
export const matrixMap = (width, height, callback) =>
  range(width).map((_, x) => range(height).map((_, y) => callback(x, y)))

export const choose = (choices) => {
  var index = Math.floor(Math.random() * choices.length)
  return choices[index]
}

// https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
/**
 * Doesn't work if some elements have absolute css
 **/
export const getRelativeCoordinates = (event, referenceElement) => {
  const position = {
    x: event.pageX,
    y: event.pageY,
  }

  const offset = {
    left: referenceElement.offsetLeft,
    top: referenceElement.offsetTop,
  }

  let reference = referenceElement.offsetParent

  while (reference) {
    offset.left += reference.offsetLeft
    offset.top += reference.offsetTop
    reference = reference.offsetParent
  }

  return {
    x: position.x - offset.left,
    y: position.y - offset.top,
  }
}

export const getElementBox = (referenceElement) => {
  const offset = {
    left: referenceElement.offsetLeft,
    top: referenceElement.offsetTop,
  }

  let reference = referenceElement.offsetParent

  while (reference) {
    offset.left += reference.offsetLeft
    offset.top += reference.offsetTop
    reference = reference.offsetParent
  }

  return {
    left: offset.left,
    top: offset.top,
    width: referenceElement.offsetWidth,
    height: referenceElement.offsetHeight,
  }
}

// eslint-disable-next-line no-undef
const setTimeout = window.setTimeout

export const postphoneAsync = (f) => setTimeout(f, 1)

export const postphoneAsyncWithTime = (timeout, ...callbacks) =>
  // eslint-disable-next-line no-undef
  callbacks.map((callback, i) => setTimeout(callback, (i + 1) * timeout))

export const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

export const throttle = (func, limit) => {
  let inThrottle
  return function () {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
