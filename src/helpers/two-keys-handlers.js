let enterKey;
let ctrlKey;
let submitFunction;

const onEnterKeyDown = (evt) => {
  if (evt.key === 'Enter' || evt.keyCode === 13) {
    return true;
  }
};

const onControlKeyDown = (evt) => {
  if (evt.key === 'Control' || evt.keyCode === 17) {
    return true;
  }
};

const enterKeyDownTrueHandler = (evt) => {
  if (onEnterKeyDown(evt)) {
    enterKey = true;
  }

};

const controlKeyDownTrueHandler = (evt) => {
  if (onControlKeyDown(evt)) {
    ctrlKey = true;
  }
};

const enterKeyDownFalseHandler = (evt) => {
  if (onEnterKeyDown(evt)) {
    enterKey = false;
  }
};

const controlKeyDownFalseHandler = (evt) => {
  if (onControlKeyDown(evt)) {
    ctrlKey = false;
  }
};

const checkPressingOfTwoKeysHandler = () => {
  if (enterKey && ctrlKey) {
    submitFunction();
  }
};

const addEnterOrControlKeyUpDownHandlers = () => {
  document.addEventListener('keydown', enterKeyDownTrueHandler);
  document.addEventListener('keydown', controlKeyDownTrueHandler);
  document.addEventListener('keyup', enterKeyDownFalseHandler);
  document.addEventListener('keyup', controlKeyDownFalseHandler);

  document.addEventListener('keydown', checkPressingOfTwoKeysHandler);
};

const removeEnterOrControlKeyUpDownHandlers = () => {
  document.removeEventListener('keydown', enterKeyDownTrueHandler);
  document.removeEventListener('keydown', controlKeyDownTrueHandler);
  document.removeEventListener('keyup', enterKeyDownFalseHandler);
  document.removeEventListener('keyup', controlKeyDownFalseHandler);

  document.addEventListener('keydown', checkPressingOfTwoKeysHandler);
};

const twoKeysPressFunction = (callback) => {
  submitFunction = callback;
  addEnterOrControlKeyUpDownHandlers();
};

export {addEnterOrControlKeyUpDownHandlers, removeEnterOrControlKeyUpDownHandlers, twoKeysPressFunction};
