import {zoomImageUp, zoomImageDown, zoomImageDrop} from './zoom-image.js';
import {addEffect, dropEffect} from './add-effect.js';
import {sendData} from './api.js';

const MAX_HASHTAG_NUMBER = 5;
const MAX_COMMENT_LENGTH = 140;
const CORRECT_HASHTAG_REGEXP = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
const SPACES_REGEXP = /\s+/;
const UPLOAD_URL = 'https://23.javascript.pages.academy/kekstagram';
const BODY = document.querySelector('body');
const UPLOAD_INPUT = document.querySelector('.img-upload__input');
const IMG_UPLOAD_FORM = document.querySelector('.img-upload__form');
const UPLOAD_IMAGE_FORM = document.querySelector('.img-upload__overlay');
const UPLOAD_IMAGE_CLOSE_BUTTON = document.querySelector('.img-upload__cancel');
const HASTAGS_INPUT = document.querySelector('.text__hashtags');
const IMAGE_COMMENT = document.querySelector('.text__description');

const onUploadImageFormEsc = (evt) => {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    // eslint-disable-next-line no-use-before-define
    closeUploadImageForm();
  }
};

const onEscKey = (evt) => {
  if (evt.keyCode === 27) {
    evt.stopPropagation();
  }
};

HASTAGS_INPUT.addEventListener('keydown', onEscKey);
IMAGE_COMMENT.addEventListener('keydown', onEscKey);

const openUploadImageForm = () => {
  UPLOAD_IMAGE_FORM.classList.remove('hidden');
  BODY.classList.add('modal-open');
  document.querySelector('.scale__control--smaller').addEventListener('click', zoomImageDown);
  document.querySelector('.scale__control--bigger').addEventListener('click', zoomImageUp);
  document.addEventListener('keydown', onUploadImageFormEsc);
  document.querySelector('.effects__list').addEventListener('change', addEffect);
};

const closeUploadImageForm = () => {
  UPLOAD_IMAGE_FORM.classList.add('hidden');
  BODY.classList.remove('modal-open');
  UPLOAD_INPUT.value = null;
  HASTAGS_INPUT.value = '';
  IMAGE_COMMENT.value = '';
  zoomImageDrop();
  dropEffect();
  document.removeEventListener('keydown',onUploadImageFormEsc);
};

UPLOAD_INPUT.addEventListener('change', openUploadImageForm);

UPLOAD_IMAGE_CLOSE_BUTTON.addEventListener('click', closeUploadImageForm);

const onCheckHashtagValidity = () => {
  const array = HASTAGS_INPUT.value.toLowerCase().split(SPACES_REGEXP);
  const hashtagsSet = new Set(array);

  for (let index = 0; index < array.length; index++) {
    if (array.length > MAX_HASHTAG_NUMBER) {
      HASTAGS_INPUT.setCustomValidity(`Количество хэштэгов не может превышать ${MAX_HASHTAG_NUMBER}`);
    } else if (array.length !== hashtagsSet.size) {
      HASTAGS_INPUT.setCustomValidity('Нельзя использовать один хэш-тег дважды');
    } else if (!CORRECT_HASHTAG_REGEXP.test(array[index])) {
      HASTAGS_INPUT.setCustomValidity('Введён неправильный формат хэштега');
    } else {
      HASTAGS_INPUT.setCustomValidity('');
    }
  }
  HASTAGS_INPUT.reportValidity();
};

const onCheckCommentValidity = () => {
  const valueLength = IMAGE_COMMENT.value.length;

  const checkCommentsCount = valueLength > MAX_COMMENT_LENGTH ? `Удалите лишние ${  valueLength - MAX_COMMENT_LENGTH } симв.` : ('');
  IMAGE_COMMENT.setCustomValidity(checkCommentsCount);
  IMAGE_COMMENT.reportValidity();
};

IMAGE_COMMENT.addEventListener('input', onCheckCommentValidity);
HASTAGS_INPUT.addEventListener('input', onCheckHashtagValidity);

const setUserFormSubmit = (onSuccess, onFail) => {
  const onSendData = (evt) => {
    evt.preventDefault();

    sendData(

      onSuccess,
      onFail,
      new FormData(evt.target),
      UPLOAD_URL,
    );
  };
  IMG_UPLOAD_FORM.addEventListener('submit', onSendData);
};

export {openUploadImageForm, closeUploadImageForm, onCheckCommentValidity, onCheckHashtagValidity, setUserFormSubmit};
