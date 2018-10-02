'use strict';

var MAX_CATALOG_ITEMS = 26;

var goodsNames = [
  'Чесночные сливки',
  'Огуречный педант',
  'Молочная хрюша',
  'Грибной шейк',
  'Баклажановое безумие',
  'Паприколу итальяно',
  'Нинзя - удар васаби',
  'Хитрый баклажан',
  'Горчичный вызов',
  'Кедровая липучка',
  'Корманный портвейн',
  'Чилийский задира',
  'Беконовый взрыв',
  'Арахис vs виноград',
  'Сельдерейная душа',
  'Початок в бутылке',
  'Чернющий мистер чеснок',
  'Раша федераша',
  'Кислая мина',
  'Кукурузное утро',
  'Икорный фуршет',
  'Новогоднее настроение',
  'С пивком потянет',
  'Мисс креветка',
  'Бесконечный взрыв',
  'Невинные винные',
  'Бельгийское пенное',
  'Острый язычок'
];

var goodsImages = [
  'soda-russian.jpg',
  'soda-peanut-grapes.jpg',
  'soda-garlic.jpg',
  'soda-cob.jpg',
  'soda-celery.jpg',
  'soda-bacon.jpg',
  'marshmallow-wine.jpg',
  'marshmallow-spicy.jpg',
  'marshmallow-shrimp.jpg',
  'marshmallow-beer.jpg',
  'marshmallow-bacon.jpg',
  'marmalade-sour.jpg',
  'marmalade-new-year.jpg',
  'marmalade-corn.jpg',
  'marmalade-caviar.jpg',
  'marmalade-beer.jpg',
  'ice-pig.jpg',
  'ice-mushroom.jpg',
  'ice-italian.jpg',
  'ice-garlic.jpg',
  'ice-eggplant.jpg',
  'ice-cucumber.jpg',
  'gum-wasabi.jpg',
  'gum-portwine.jpg',
  'gum-mustard.jpg',
  'gum-eggplant.jpg',
  'gum-chile.jpg',
  'gum-cedar.jpg'
];

var goodsNutrients = [
  'молоко',
  'сливки',
  'вода',
  'пищевой краситель',
  'патока',
  'ароматизатор бекона',
  'ароматизатор свинца',
  'ароматизатор дуба, идентичный натуральному',
  'ароматизатор картофеля',
  'лимонная кислота',
  'загуститель',
  'эмульгатор',
  'консервант: сорбат калия',
  'посолочная смесь: соль, нитрит натрия',
  'ксилит',
  'карбамид',
  'вилларибо',
  'виллабаджо'
];

var getRandomInt = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomElement = function (array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

var getRandomNutrients = function () {
  var totalQuantatyOfNutrients = getRandomInt(1, goodsNutrients.length);
  var randomNutrients = [];
  var randomNuntrient;

  for (var i = 0; i < totalQuantatyOfNutrients; i++) {
    do {
      randomNuntrient = getRandomElement(goodsNutrients);
    } while (randomNutrients.indexOf(randomNuntrient) !== -1);
    randomNutrients.push(randomNuntrient);
  }
  return randomNutrients.join(', ');
};

var generateGoods = function (quantaty) {
  var items = [];
  for (var i = 0; i < quantaty; i++) {
    var item = {};
    // item.id = i;
    item.name = goodsNames[i];
    var pictureName = getRandomElement(goodsImages);
    item.picture = 'img/cards/' + pictureName;
    item.category = pictureName.split('-')[0];
    item.amount = getRandomInt(0, 20);
    item.price = getRandomInt(100, 300);
    item.weight = getRandomInt(30, 300);
    item.rating = {};
    item.rating.value = getRandomInt(1, 5);
    item.rating.number = getRandomInt(10, 900);
    item.nutritionFacts = {};
    item.nutritionFacts.sugar = Math.round(Math.random()) ? true : false;
    item.nutritionFacts.energy = getRandomInt(70, 500);
    item.nutritionFacts.contents = getRandomNutrients();
    items.push(item);
  }
  return items;
};

var goods = generateGoods(MAX_CATALOG_ITEMS);
var orders = [];

var orderCardsWrapper = document.querySelector('.goods__cards');

var createCatalogCard = function (item) {
  var card = catalogCardTemplate.cloneNode(true);
  // card.dataset.id = item.id;

  applyCatalogCardStyle(card, item.amount);

  card.querySelector('.card__title').textContent = item.name;
  card.querySelector('.card__img').src = item.picture;

  var cardPrice = card.querySelector('.card__price');
  var cardCurrency = card.querySelector('.card__currency');
  var cardWeight = card.querySelector('.card__weight');
  cardPrice.textContent = item.price;
  cardWeight.textContent = '/ ' + item.weight + '  Г';
  cardPrice.appendChild(cardCurrency);
  cardPrice.appendChild(cardWeight);

  var starsRating = card.querySelector('.stars__rating');
  starsRating.classList.remove('stars__rating--five');
  starsRating.textContent = 'Рейтинг: ' + item.rating.value;
  switch (item.rating.value) {
    case 1:
      starsRating.classList.add('stars__rating--one');
      break;
    case 2:
      starsRating.classList.add('stars__rating--two');
      break;
    case 3:
      starsRating.classList.add('stars__rating--three');
      break;
    case 4:
      starsRating.classList.add('stars__rating--four');
      break;
    case 5:
      starsRating.classList.add('stars__rating--five');
      break;
  }

  // card.querySelector('.star__count').textContent = '(' + item.rating.number + ')';
  card.querySelector('.star__count').textContent = '(' + item.amount + ')';

  card.querySelector('.card__characteristic').textContent =
    item.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';

  card.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;

  var cardFavoriteBtn = card.querySelector('.card__btn-favorite');
  var cardAddBtn = card.querySelector('.card__btn');
  var cardCompositionBtn = card.querySelector('.card__btn-composition');

  card.addEventListener('click', function (evt) {
    evt.preventDefault();
    switch (evt.target) {
      case cardAddBtn:
        addCardToOrder(evt.currentTarget);
        break;
      case cardFavoriteBtn:
        addToFavorites(cardFavoriteBtn);
        break;
      case cardCompositionBtn:
        toggleComposition(evt.currentTarget);
    }
  });

  return card;
};
var toggleComposition = function (card) {
  card.querySelector('.card__composition').classList.toggle('card__composition--hidden');
};

var addToFavorites = function (button) {
  button.classList.toggle('card__btn-favorite--selected');
};

var createOrderCard = function (item) {
  var card = orderCardTemplate.cloneNode(true);
  card.querySelector('.card-order__title').textContent = item.name;
  card.querySelector('.card-order__img').src = item.picture;
  card.querySelector('.card-order__price').textContent = item.price + ' ₽';
  card.querySelector('.card-order__count').value = 1;

  card.addEventListener('click', function (evt) {
    evt.preventDefault();

    var cardOrderClose = evt.currentTarget.querySelector('.card-order__close');
    var cardOrderDecrease = evt.currentTarget.querySelector('.card-order__btn--decrease');
    var cardOrderIncrease = evt.currentTarget.querySelector('.card-order__btn--increase');

    switch (evt.target) {
      case cardOrderClose:
        removeCardFromOrder(evt.currentTarget);
        break;
      case cardOrderDecrease:
        changeOrderCount(evt.currentTarget, -1);
        break;
      case cardOrderIncrease:
        changeOrderCount(evt.currentTarget, 1);
    }
  });

  return card;
};


var basket = document.querySelector('.main-header__basket');
var updateBasket = function () {
  if (orders.length) {
    // var basketTotalAmount = orders
    //   .map(function (it) {
    //     return it.orderedAmount;
    //   }).reduce(function (it, total) {
    //     return total + it;
    //   });
    var basketTotalAmount = orders.length;

    var basketTotalPrice = orders
      .map(function (it) {
        return it.price * it.orderedAmount;
      }).reduce(function (it, total) {
        return total + it;
      });
    basket.textContent = 'В корзине ' + basketTotalAmount + ' товара на сумму ' + basketTotalPrice + ' ₽';
  } else {
    basket.textContent = 'В корзине ничего нет';
  }
};

var removeCardFromOrder = function (card) {
  var cardTitle = card.querySelector('.card-order__title').textContent;
  var catalogItem = getObjByName(goods, cardTitle);

  var catalogCard = getCatalogCardByName(cardTitle);

  applyCatalogCardStyle(catalogCard, catalogItem.amount);

  for (i = 0; i < orders.length; i++) {
    if (orders[i].name === cardTitle) {
      orders.splice(i, 1);
      break;
    }
  }

  document.querySelector('.goods__cards').removeChild(card);

  if (orders.length === 0) {
    document.querySelector('.goods__card-empty').classList.remove('visually-hidden');
  }
  updateBasket();
};

var changeOrderCount = function (card, increment) {

  var cardTitle = card.querySelector('.card-order__title').textContent;
  var catalogItem = getObjByName(goods, cardTitle);
  var orderItem = getObjByName(orders, cardTitle);
  var catalogCard = getCatalogCardByName(cardTitle);

  orderItem.orderedAmount += increment;

  if (orderItem.orderedAmount > catalogItem.amount) {
    orderItem.orderedAmount = catalogItem.amount;
  }
  if (orderItem.orderedAmount === 0) {
    removeCardFromOrder(card);
  }
  card.querySelector('.card-order__count').value = orderItem.orderedAmount;
  applyCatalogCardStyle(catalogCard, catalogItem.amount - orderItem.orderedAmount);
  updateBasket();
};

var getCatalogCardByName = function (name) {
  var catalogCards = document.querySelectorAll('.catalog__card');
  for (var i = 0; i < catalogCards.length; i++) {
    var catalogCardTitle = catalogCards[i].querySelector('.card__title').textContent;
    if (catalogCardTitle === name) {
      var card = catalogCards[i];
      break;
    }
  }
  return card;
};

var applyCatalogCardStyle = function (card, amount) {

  card.classList.remove('card--in-stock');
  card.classList.remove('card--little');
  card.classList.remove('card--soon');

  if (amount > 5) {
    card.classList.add('card--in-stock');
  } else if (amount >= 1 && amount <= 5) {
    card.classList.add('card--little');
  } else if (amount === 0) {
    card.classList.add('card--soon');
  }
};

var addCardToOrder = function (card) {
  var cardTitle = card.querySelector('.card__title').textContent;

  var catalogItem = getObjByName(goods, cardTitle);
  var orderItem = getObjByName(orders, cardTitle);


  if (orderItem !== undefined) {
    if (orderItem.orderedAmount < catalogItem.amount) {
      orderItem.orderedAmount++;
      var cardAlredyInOrder = getOrderCardByName(cardTitle);
      cardAlredyInOrder.querySelector('.card-order__count').value = orderItem.orderedAmount;
    }
  } else {
    orderItem = Object.assign({}, catalogItem);
    orderItem.orderedAmount = 1;
    orders.push(orderItem);

    orderCardsWrapper.classList.remove('goods__cards--empty');
    orderCardsWrapper.querySelector('.goods__card-empty').classList.add('visually-hidden');
    orderCardsWrapper.appendChild(createOrderCard(orderItem));

  }
  applyCatalogCardStyle(card, catalogItem.amount - orderItem.orderedAmount);
  updateBasket();

};

var getObjByName = function (array, name) {
  return array.find(function (item) {
    return item.name === name;
  });
};

var getOrderCardByName = function (name) {
  var orderCards = orderCardsWrapper.querySelectorAll('.card-order');

  for (var i = 0; i < orderCards.length; i++) {
    var orderCardTitle = orderCards[i].querySelector('.card-order__title').textContent;
    if (orderCardTitle === name) {
      var card = orderCards[i];
      break;
    }
  }
  return card;
};


var addCards = function (createCard, goodsArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < goodsArray.length; i++) {
    fragment.appendChild(createCard(goodsArray[i]));
  }
  return fragment;
};

var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
var orderCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');


var catalogSidebar = document.querySelector('.catalog__sidebar');

var sidebarState = {};

var resetToDefaultSibarState = function () {
  sidebarState.price = {};
  sidebarState.price.min = 0;
  sidebarState.price.max = 300;
};

resetToDefaultSibarState();

var catalogCards = document.querySelector('.catalog__cards');

var clearCatalog = function () {
  while (catalogCards.firstChild) {
    catalogCards.removeChild(catalogCards.firstChild);
  }
};

var showCatalog = function () {
  clearCatalog();
  var goodsFiltered = [];

  for (i = 0; i < goods.length; i++) {
    goodsFiltered.push(goods[i]);
  }

  var catalogCardsFragment = addCards(createCatalogCard, goodsFiltered);
  catalogCards.appendChild(catalogCardsFragment);
};


var sidebarRangeButtons = catalogSidebar.querySelectorAll('.range__btn');
for (var i = 0; i < sidebarRangeButtons.length; i++) {
  sidebarRangeButtons[i].addEventListener('mouseup', function () {
    sidebarState.price.min = 60;
    sidebarState.price.max = 230;
    showCatalog();
  });
}

var resetSidebar = function () {

  resetToDefaultSibarState();

  var sidebarFoodTypes = catalogSidebar.querySelectorAll('.input-btn__input--checkbox[name="food-type"]');

  for (var j = 0; j < sidebarFoodTypes.length; j++) {
    sidebarFoodTypes[j].checked = true;
  }
  catalogSidebar.querySelector('.input-btn__input--radio[value="popular"]').checked = true;
};

var toggleFormInputs = function (tab) {
  var inputs = tab.querySelectorAll('input');
  var textarea = tab.querySelector('textarea');
  if (textarea) {
    textarea.disabled = !textarea.disabled;
  }
  inputs.forEach(function (it) {
    it.disabled = !it.disabled;
  });
  // for (i = 0; i < inputs.length; i++) {
  //   inputs[i].disabled = !inputs[i].disabled;
  // }
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


catalogSidebar.querySelector('.catalog__submit').addEventListener('click', function (evt) {

  evt.preventDefault();
  resetSidebar();
});

showCatalog();

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
    deliverStoreMap.src = '/img/map/' + mapFileName + '.jpg';
    deliverStoreDescribe.textContent = deliverStoreDescriptons[mapFileName];
  }
};

deliverStoreList.addEventListener('click', function (evt) {
  // evt.preventDefault();
  selectStore(evt);
});
