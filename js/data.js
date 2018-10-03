'use strict';
(function () {
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

  window.goods = generateGoods(MAX_CATALOG_ITEMS);
})();
