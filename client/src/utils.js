
// I don't know why it's not in javascript
// I which javascript were in python


// From https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
export const range = (end) => [...Array(end).keys()];

export const choose = (choices) => {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
};


// https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
/**
* Doesn't work if some elements have absolute css
**/
export const getRelativeCoordinates = (event, referenceElement) => {

  const position = {
    x: event.pageX,
    y: event.pageY
  };

  const offset = {
    left: referenceElement.offsetLeft,
    top: referenceElement.offsetTop
  };

  let reference = referenceElement.offsetParent;

  while(reference){
    offset.left += reference.offsetLeft;
    offset.top += reference.offsetTop;
    reference = reference.offsetParent;
  }

  return {
    x: position.x - offset.left,
    y: position.y - offset.top,
  };

};

export const postphoneAsync = (f) => setTimeout(f, 1);
