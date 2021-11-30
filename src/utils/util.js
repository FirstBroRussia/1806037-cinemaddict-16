const getRandomNumber = (min, max, fixed) => {
  if (fixed) {
    const randomFractionalNumber = (Math.random() * (max + 1 - min) + min).toFixed(1);
    return randomFractionalNumber >= 10 ? '10' : randomFractionalNumber;
  }
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

const getConvertedString = (string, specifiedLength) => string.length > specifiedLength ? `${string.slice(0, specifiedLength - 1)}...` : string;


function switchForRenderHtmlElement (container, position, element) {
  switch (position) {
    case position.BEFORE_BEGIN: return container.before(element);
    case position.AFTER_BEGIN: return container.prepend(element);
    case position.BEFORE_END: return container.append(element);
    case position.AFTER_END: return container.after(element);
  }
}


export {getRandomNumber, getConvertedString, switchForRenderHtmlElement};
