'use strict';

var MAX_CATALOG_ITEMS = 26;
var MAX_ORDERS = 3;

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
    item.name = getRandomElement(goodsNames);
    item.picture = 'img/cards/' + getRandomElement(goodsImages);
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
var orders = generateGoods(MAX_ORDERS);

var createCatalogCard = function (item) {
  var card = catalogCardTemplate.cloneNode(true);

  card.classList.remove('card--in-stock');
  if (item.amount > 5) {
    card.classList.add('card--in-stock');
  } else if (item.amount >= 1 && item.amount <= 5) {
    card.classList.add('card--little');
  } else if (item.amount === 0) {
    card.classList.add('card--soon');
  }

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

  card.querySelector('.star__count').textContent = '(' + item.rating.number + ')';

  card.querySelector('.card__characteristic').textContent =
  item.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';

  card.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;

  return card;
};

var createOrderCard = function (item) {
  var card = orderCardTemplate.cloneNode(true);
  card.querySelector('.card-order__title').textContent = item.name;
  card.querySelector('.card-order__img').src = item.picture;
  card.querySelector('.card-order__price').textContent = item.price + ' ₽';
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

var catalogCardsFragment = addCards(createCatalogCard, goods);
var orderCardsFragment = addCards(createOrderCard, orders);

var catalogCards = document.querySelector('.catalog__cards');
var goodsCards = document.querySelector('.goods__cards');

catalogCards.classList.remove('catalog__cards--load');
catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
catalogCards.appendChild(catalogCardsFragment);

goodsCards.classList.remove('goods__cards--empty');
goodsCards.querySelector('.goods__card-empty').classList.add('visually-hidden');
goodsCards.appendChild(orderCardsFragment);
