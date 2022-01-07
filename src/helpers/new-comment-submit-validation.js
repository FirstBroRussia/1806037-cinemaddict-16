const ZERO_VALUE = 0;

const setNewCommentElementValid = (inputElement, currentCheckedEmotionButton) => {
  if (inputElement.value.length === ZERO_VALUE) {
    inputElement.setCustomValidity('Нельзя отправить пустое поле!\nВведите комментарий');
    inputElement.reportValidity();
    return;
  }
  if (currentCheckedEmotionButton === null) {
    inputElement.setCustomValidity('Выберите эмоцию!');
    inputElement.reportValidity();
    return;
  }
  inputElement.setCustomValidity('');
  //inputElement.reportValidity();
};


export {setNewCommentElementValid};
