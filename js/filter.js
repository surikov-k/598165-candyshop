'use strict';

(function () {

  var minPrice = 15;
  var maxPrice = 275;
  var RANGE_LENGTH = 245;
  var BUTTON_WIDTH = 10;

  var catalogSidebar = document.querySelector('.catalog__sidebar');
  var rangePriceMin = catalogSidebar.querySelector('.range__price--min');
  var rangePriceMax = catalogSidebar.querySelector('.range__price--max');
  var rangeBtnLeft = catalogSidebar.querySelector('.range__btn--left');
  var rangeBtnRight = catalogSidebar.querySelector('.range__btn--right');
  var rangeFillLine = catalogSidebar.querySelector('.range__fill-line');

  var currentMinPrice = parseInt(rangePriceMin.textContent, 10);
  var currentMaxPrice = parseInt(rangePriceMax.textContent, 10);

  var kindToForAttributeMap = {
    'Мороженое': 'filter-icecream',
    'Жевательная резинка': 'filter-gum',
    'Мармелад': 'filter-marmalade',
    'Зефир': 'filter-marshmallows',
    'Газировка': 'filter-soda',
    'sugar-free': 'filter-sugar-free',
    'vegetarian': 'filter-vegetarian',
    'gluten-free': 'filter-gluten-free',
    'favorites': 'filter-favorite',
    'availability': 'filter-availability'
  };

  var filterInitialState = function () {
    var typeFilters = catalogSidebar.querySelectorAll('[name="food-type"]');
    typeFilters.forEach(function (it) {
      it.checked = true;
    });
  };

  var filterButtons = catalogSidebar.querySelectorAll('label[for^="filter-"]');

  var filterStates = {
    'Мороженое': Math.pow(2, 0),
    'Газировка': Math.pow(2, 1),
    'Жевательная резинка': Math.pow(2, 2),
    'Мармелад': Math.pow(2, 3),
    'Зефир': Math.pow(2, 4),
    'Без сахара': Math.pow(2, 5),
    'Вегетарианское': Math.pow(2, 6),
    'Безглютеновое': Math.pow(2, 7),
    'Только избранное': Math.pow(2, 8),
    'В наличии': Math.pow(2, 9),
    'Сначала популярные': Math.pow(2, 10),
    'Сначала дорогие': Math.pow(2, 11),
    'Сначала дешёвые': Math.pow(2, 12),
    'По рейтингу': Math.pow(2, 13)
  };

  var filterState = filterStates['Мороженое'] |
      filterStates['Газировка'] |
      filterStates['Жевательная резинка'] |
      filterStates['Мармелад'] |
      filterStates['Зефир'] |
      filterStates['Сначала популярные'];

  // console.log(window.catalog.goods);

  var resetCounters = function () {
    var counters = catalogSidebar.querySelectorAll('.input-btn__item-count');
    counters.forEach(function (it) {
      it.textContent = '(0)';
    });
    catalogSidebar.querySelector('.range__count').textContent = '(0)';
  };

  var updateCounter = function (kind) {

    var counter = catalogSidebar.querySelector('label[for="' + kindToForAttributeMap[kind] + '"]').nextElementSibling;
    var counterNumber = counter.textContent.slice(1, -1);
    counterNumber = parseInt(counterNumber, 10);
    counter.textContent = '(' + (++counterNumber) + ')';
  };

  var updatePriceCounter = function () {
    var rangeCount = catalogSidebar.querySelector('.range__count');
    var counterNumber = 0;
    window.catalog.goods.forEach(function (it) {
      if (it.price >= currentMinPrice && it.price <= currentMaxPrice) {
        counterNumber++;
      }
    });
    rangeCount.textContent = '(' + counterNumber + ')';
  };

  var updateFavoritesCounter = function (increment) {
    var counter = catalogSidebar.querySelector('label[for="filter-favorite"]').nextElementSibling;
    var counterNumber = counter.textContent.slice(1, -1);
    counterNumber = parseInt(counterNumber, 10);
    counter.textContent = '(' + (counterNumber + increment) + ')';
  };


  var updateCounters = function () {
    var prices = window.catalog.goods.map(function (it) {
      return it.price;
    });
    minPrice = prices.reduce(function (a, b) {
      return Math.min(a, b);
    });
    maxPrice = prices.reduce(function (a, b) {
      return Math.max(a, b);
    });

    applyRangeBtnStyle();

    window.catalog.goods.forEach(function (it) {

      updateCounter(it.kind);

      if (!it.nutritionFacts.sugar) {
        updateCounter('sugar-free');
      }
      if (it.nutritionFacts.vegetarian) {
        updateCounter('vegetarian');
      }
      if (!it.nutritionFacts.gluten) {
        updateCounter('gluten-free');
      }
      if (it.amount > 0) {
        updateCounter('availability');
      }
      updatePriceCounter();
      filterInitialState();
    });
  };


  var applyRangeBtnStyle = function () {
    var priceRange = maxPrice - minPrice;
    var leftX = rangeBtnLeft.offsetLeft + BUTTON_WIDTH / 2;
    var rightX = rangeBtnRight.offsetLeft + BUTTON_WIDTH / 2;

    rangeFillLine.style.left = rangeBtnLeft.offsetLeft + 'px';
    rangeFillLine.style.right = RANGE_LENGTH - rangeBtnRight.offsetLeft + 'px';
    currentMinPrice = Math.round(priceRange / RANGE_LENGTH * leftX) + minPrice;
    currentMaxPrice = Math.round(priceRange / RANGE_LENGTH * rightX) + minPrice;

    rangePriceMin.textContent = currentMinPrice;
    rangePriceMax.textContent = currentMaxPrice;
  };


  var moveRangeBtn = function (evt, min, max) {
    evt.preventDefault();

    var startCoordinate = evt.clientX;

    var mouseMoveHandler = function (moveEvt) {
      var shift = startCoordinate - moveEvt.clientX;

      startCoordinate = moveEvt.clientX;
      var x = evt.target.offsetLeft - shift;
      if (x <= min) {
        x = min;
      } else if (x >= max) {
        x = max;
      }
      evt.target.style.left = x + 'px';
      applyRangeBtnStyle();
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      updatePriceCounter();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  rangeBtnLeft.addEventListener('mousedown', function (evt) {
    moveRangeBtn(evt, -BUTTON_WIDTH / 2, rangeBtnRight.offsetLeft);
  });
  rangeBtnRight.addEventListener('mousedown', function (evt) {
    moveRangeBtn(evt, rangeBtnLeft.offsetLeft, RANGE_LENGTH - BUTTON_WIDTH / 2);
  });

  var filterHandler = function (evt) {
    var kind = evt.target.textContent;
    filterState = filterState ^ filterStates[kind];
    if (kind === 'Только избранное') {
      filterState = filterState & ~filterStates['В наличии'];
    }
    if (kind === 'В наличии') {
      filterState = filterState & ~filterStates['Только избранное'];
    }
    if (kind === 'Сначала популярные') {
      filterState = filterState | filterStates['Сначала популярные'];
      filterState = filterState & ~filterStates['Сначала дорогие'];

    }
    if (kind === 'Сначала дорогие') {
      filterState = filterState | filterStates['Сначала дорогие'];
      filterState = filterState & ~filterStates['Сначала популярные'];
    }
    window.catalog.showCatalog(filterState);
  };

  filterButtons.forEach(function (it) {
    it.addEventListener('click', function (evt) {
      filterHandler(evt);
    });
  });


  window.filter = {
    resetCounters: resetCounters,
    updateCounters: updateCounters,
    updateFavoritesCounter: updateFavoritesCounter,
    filterStates: filterStates,
    filterState: filterState
  };

})();
