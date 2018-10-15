'use strict';
(function () {

  var buyForm = document.querySelector('form[method=post]');
  var paymentTabs = [];
  var deliverTabs = [];

  var paymentSection = document.querySelector('.payment');
  var paymentToggle = paymentSection.querySelector('.payment__method');
  paymentTabs.push(paymentSection.querySelector('.payment__card-wrap'));
  paymentTabs.push(paymentSection.querySelector('.payment__cash-wrap'));

  var deliverSection = document.querySelector('.deliver');
  var deliverToggle = deliverSection.querySelector('.deliver__toggle');
  deliverTabs.push(deliverSection.querySelector('.deliver__store'));
  deliverTabs.push(deliverSection.querySelector('.deliver__courier'));

  var selectInputs = function (element) {
    var elementInputs = [];
    var htmlInputs = ['input', 'textarea', 'button'];

    htmlInputs.forEach(function (it) {
      if (element.querySelectorAll(it)) {
        element.querySelectorAll(it).forEach(function (jt) {
          elementInputs.push(jt);
        });
      }
    });
    return elementInputs;
  };

  var disabelElementInputs = function (element) {
    var formInputs = selectInputs(element);
    formInputs.forEach(function (it) {
      it.disabled = true;
    });
  };
  var disableBuyForm = function () {
    disabelElementInputs(buyForm);
  };

  disableBuyForm();

  var toggleElementInputs = function (element) {
    selectInputs(element).forEach(function (it) {
      it.disabled = !it.disabled;
    });
  };

  var enableBuyForm = function () {
    toggleElementInputs(document.querySelector('.contact-data__inputs'));

    paymentSection.querySelector('input[value=card]').checked = true;
    toggleElementInputs(paymentSection.querySelector('.payment__method'));
    paymentSection.querySelector('.payment__card-wrap').classList.remove('visually-hidden');
    paymentSection.querySelector('.payment__cash-wrap').classList.add('visually-hidden');
    toggleElementInputs(paymentSection.querySelector('.payment__card-wrap'));

    deliverSection.querySelector('input[value=store]').checked = true;
    toggleElementInputs(deliverSection.querySelector('.deliver__toggle'));
    deliverSection.querySelector('.deliver__store').classList.remove('visually-hidden');
    deliverSection.querySelector('.deliver__courier').classList.add('visually-hidden');
    toggleElementInputs(deliverSection.querySelector('.deliver__store'));

    buyForm.querySelector('.buy__submit-btn').disabled = false;

    paymentToggle.addEventListener('click', function (evt) {
      evt.preventDefault();
      toggleTabs(evt, paymentTabs);
    });

    deliverToggle.addEventListener('click', function (evt) {
      evt.preventDefault();
      toggleTabs(evt, deliverTabs);
    });
  };


  var toggleTabs = function (evt, tabs) {
    if (evt.target.tagName === 'LABEL') {
      var targetRadioBtn = document.querySelector('#' + evt.target.getAttribute('for'));
      if (!targetRadioBtn.checked && !targetRadioBtn.disabled) {
        tabs.forEach(function (it) {
          it.classList.toggle('visually-hidden');
          toggleElementInputs(it);
        });
        targetRadioBtn.checked = true;
      }
    }
  };


  var paymentCardNumberInput = document.querySelector('#payment__card-number');
  // 4916479015929426
  paymentCardNumberInput.addEventListener('input', function (evt) {
    checkPaymentCardValidity(evt);
  });

  var paymentCardInputs = document.querySelector('.payment__inputs');

  var luhnAlgorithm = function (value) {
    var nCheck = 0;
    var nDigit = 0;
    var bEven = false;

    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n);
      nDigit = parseInt(cDigit, 10);

      if (bEven && ((nDigit *= 2) > 9)) {
        nDigit -= 9;
      }

      nCheck += nDigit;
      bEven = !bEven;
    }
    return (nCheck % 10) === 0;
  };

  var checkPaymentCardValidity = function () {
    if (paymentCardNumberInput.validity.patternMismatch) {
      paymentCardNumberInput.setCustomValidity('Пожалуйста, введите 16 цифр вашей платежной карты');
    } else if (!luhnAlgorithm(paymentCardNumberInput.value)) {
      paymentCardNumberInput.setCustomValidity('Неправильный номер платежной карты');
    } else {
      paymentCardNumberInput.setCustomValidity('');
    }
  };


  var checkCardStatus = function () {
    var paymentCardStatus = paymentCardInputs.querySelector('.payment__card-status');
    var inputs = paymentCardInputs.querySelectorAll('input');
    var isPaymentCardValid = true;
    inputs.forEach(function (it) {
      if (!it.validity.valid) {
        isPaymentCardValid = false;
      }
    });
    if (isPaymentCardValid) {
      paymentCardStatus.textContent = 'Одобрен';
      paymentCardStatus.style.color = 'green';
    } else {
      paymentCardStatus.textContent = 'Не определён';
      paymentCardStatus.style.color = 'gray';
    }
  };

  paymentCardInputs.addEventListener('input', function () {
    checkCardStatus();
  });


  var deliverStoreList = document.querySelector('.deliver__store-list');
  var deliverStoreMap = document.querySelector('.deliver__store-map-img');
  var deliverStoreDescribe = document.querySelector('.deliver__store-describe');
  var deliverStoreDescriptons = {
    'academicheskaya': 'проспект Науки, д. 19, корп. 3, литер А, ТК «Платформа», 3-й этаж, секция 310',
    'vasileostrovskaya': 'Василеостровская',
    'rechka': 'Черная речка',
    'petrogradskaya': 'Петроградская',
    'proletarskaya': 'Пролетарская',
    'vostaniya': 'Площадь Восстания',
    'prosvesheniya': 'Проспект Просвещения',
    'frunzenskaya': 'Фрунзенская',
    'chernishevskaya': 'Чернышевская',
  };

  var selectStore = function (evt) {
    if (evt.target.tagName === 'LABEL') {
      var labelFor = evt.target.getAttribute('for');
      var correspondedButton = deliverStoreList.querySelector('#' + labelFor);
      if (!correspondedButton.disabled) {
        var mapFileName = evt.target.getAttribute('for').split('-')[1];
        deliverStoreMap.src = 'img/map/' + mapFileName + '.jpg';
        deliverStoreDescribe.textContent = deliverStoreDescriptons[mapFileName];
      }
    }
  };

  deliverStoreList.addEventListener('click', function (evt) {
    selectStore(evt);
  });


  buyForm.addEventListener('submit', function (evt) {
    window.order.data = new FormData(buyForm);
    window.backend('POST',
        function () {
          window.modal.showSuccessModal();
          window.catalog.emptyOrder();
          buyForm.reset();
          enableBuyForm();
          disableBuyForm();
        },
        function (error) {
          window.modal.showErrorModal(error);
        });
    evt.preventDefault();
  });

  window.order = {
    disableBuyForm: disableBuyForm,
    enableBuyForm: enableBuyForm
  };

})();
