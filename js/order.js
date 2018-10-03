'use strict';
(function () {

  var toggleFormInputs = function (tab) {
    var inputs = tab.querySelectorAll('input');
    var textarea = tab.querySelector('textarea');
    if (textarea) {
      textarea.disabled = !textarea.disabled;
    }
    inputs.forEach(function (it) {
      it.disabled = !it.disabled;
    });
  };

  var toggleTabs = function (evt, tabs) {
    if (evt.target.tagName === 'LABEL') {
      var targetRadioBtn = document.querySelector('#' + evt.target.getAttribute('for'));
      if (!targetRadioBtn.checked) {
        tabs.forEach(function (it) {
          it.classList.toggle('visually-hidden');
          toggleFormInputs(it);
        });
        targetRadioBtn.checked = true;
      }
    }
  };

  var deliverSection = document.querySelector('.deliver');
  var deliverToggle = deliverSection.querySelector('.deliver__toggle');
  var deliverTabs = [];
  deliverTabs.push(deliverSection.querySelector('.deliver__store'));
  deliverTabs.push(deliverSection.querySelector('.deliver__courier'));

  deliverToggle.addEventListener('click', function (evt) {
    evt.preventDefault();
    toggleTabs(evt, deliverTabs);
  });


  var paymentSection = document.querySelector('.payment');
  var paymentToggle = paymentSection.querySelector('.payment__method');
  var paymentTabs = [];
  paymentTabs.push(paymentSection.querySelector('.payment__card-wrap'));
  paymentTabs.push(paymentSection.querySelector('.payment__cash-wrap'));

  toggleFormInputs(deliverSection.querySelector('.deliver__courier'));

  paymentToggle.addEventListener('click', function (evt) {
    evt.preventDefault();
    toggleTabs(evt, paymentTabs);
  });

  var paymentCardNumberInput = document.querySelector('#payment__card-number');

  var luhnAlgorithm = function (value) {
    var nCheck = 0;
    var nDigit = 0;
    var bEven = false;
    // value = value.replace(/\D/g, '');
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
      paymentCardNumberInput.setCustomValidity('Номер платежной карты состоит из 16 цифр');
    } else if (!luhnAlgorithm(paymentCardNumberInput.value)) {
      paymentCardNumberInput.setCustomValidity('Неправильный номер платежной карты');
    } else {
      paymentCardNumberInput.setCustomValidity('');
    }
  };
  // 4916479015929426
  paymentCardNumberInput.addEventListener('input', function (evt) {
    checkPaymentCardValidity(evt);
  });

  var paymentCardInputs = document.querySelector('.payment__inputs');

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
    'tehinstitute': 'Технологический институт'
  };

  var selectStore = function (evt) {
    if (evt.target.tagName === 'LABEL') {
      var mapFileName = evt.target.getAttribute('for').split('-')[1];
      deliverStoreMap.src = 'img/map/' + mapFileName + '.jpg';
      deliverStoreDescribe.textContent = deliverStoreDescriptons[mapFileName];
    }
  };

  deliverStoreList.addEventListener('click', function (evt) {
    selectStore(evt);
  });

})();
