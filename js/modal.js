'use strict';
(function () {
  var ESC_CODE = 27;

  var modals = document.querySelectorAll('.modal');
  var errorModal = modals[0];
  var successModal = modals[1];

  var closeModal = function (modal) {
    modal.classList.add('modal--hidden');
  };

  var showSuccessModal = function () {
    successModal.classList.remove('modal--hidden');

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_CODE) {
        closeModal(successModal);
      }
    });

    var modalCloseButton = successModal.querySelector('.modal__close');
    modalCloseButton.addEventListener('click', function () {
      closeModal(successModal);
    });
  };

  var showErrorModal = function (error) {
    errorModal.classList.remove('modal--hidden');
    var errorMessageElement = errorModal.querySelector('.modal__message');
    errorMessageElement.textContent = error;
    var modalCloseButton = errorModal.querySelector('.modal__close');

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_CODE) {
        closeModal(errorModal);
      }
    });
    modalCloseButton.addEventListener('click', function () {
      closeModal(errorModal);
    });
  };

  window.modal = {
    showSuccessModal: showSuccessModal,
    showErrorModal: showErrorModal
  };
})();


