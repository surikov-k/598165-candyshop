'use strict';

(function () {

  var minPrice;
  var maxPrice;
  var RANGE_LENGTH = 245;
  var BUTTON_WIDTH = 10;

  var catalogSidebar = document.querySelector('.catalog__sidebar');
  var rangePriceMin = catalogSidebar.querySelector('.range__price--min');
  var rangePriceMax = catalogSidebar.querySelector('.range__price--max');
  var rangeBtnLeft = catalogSidebar.querySelector('.range__btn--left');
  var rangeBtnRight = catalogSidebar.querySelector('.range__btn--right');
  var rangeFillLine = catalogSidebar.querySelector('.range__fill-line');

  var foodTypeCheckboxes = catalogSidebar.querySelectorAll('input[name="food-type"]~label');
  var foodPropertyCheckboxes = catalogSidebar.querySelectorAll('input[name="food-property"]~label');
  var onlyFavoritesCheckbox = catalogSidebar.querySelector('label[for="filter-favorite"]');
  var availabilityCheckbox = catalogSidebar.querySelector('label[for="filter-availability"]');
  var sortingButtons = catalogSidebar.querySelectorAll('input[name="sort"]~label');

  var catalogSubmitButton = catalogSidebar.querySelector('.catalog__submit');

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

  var foodTypeFlags = {
    'Мороженое': Math.pow(2, 0),
    'Газировка': Math.pow(2, 1),
    'Жевательная резинка': Math.pow(2, 2),
    'Мармелад': Math.pow(2, 3),
    'Зефир': Math.pow(2, 4)
  };

  var defaultFilterState;
  var filterState;


  var sortingMethod = {
    'Сначала популярные': function () {
      return;
    },
    'Сначала дорогие': function (a, b) {
      return b.price - a.price;
    },
    'Сначала дешёвые': function (a, b) {
      return (a.price - b.price);
    },
    'По рейтингу': function (a, b) {
      if (a.rating.value === b.rating.value) {
        return b.rating.number - a.rating.number;
      }
      return b.rating.value - a.rating.value;
    }
  };

  var resetCounters = function () {
    var counters = catalogSidebar.querySelectorAll('.input-btn__item-count');
    counters.forEach(function (it) {
      it.textContent = '(0)';
    });
    catalogSidebar.querySelector('.range__count').textContent = '(0)';
    rangeBtnLeft.style.left = -BUTTON_WIDTH / 2 + 'px';
    rangeBtnRight.style.left = RANGE_LENGTH - BUTTON_WIDTH / 2 + 'px';
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
      if (it.price >= filterState.price.min && it.price <= filterState.price.max) {
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


  var initFilters = function () {
    var prices = window.catalog.goods.map(function (it) {
      return it.price;
    });
    minPrice = prices.reduce(function (a, b) {
      return Math.min(a, b);
    });
    maxPrice = prices.reduce(function (a, b) {
      return Math.max(a, b);
    });

    defaultFilterState = {
      foodType: 0,
      foodProperty: {
        'Без сахара': false,
        'Вегетарианское': false,
        'Безглютеновое': false
      },
      price: {
        min: minPrice,
        max: maxPrice
      },
      onlyFavorites: false,
      inStock: false,
      sorting: 'Сначала популярные'
    };

    filterState = JSON.parse(JSON.stringify(defaultFilterState));

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
    });
  };


  var applyRangeBtnStyle = function () {
    var priceRange = maxPrice - minPrice;
    var leftX = rangeBtnLeft.offsetLeft + BUTTON_WIDTH / 2;
    var rightX = rangeBtnRight.offsetLeft + BUTTON_WIDTH / 2;

    rangeFillLine.style.left = rangeBtnLeft.offsetLeft + 'px';
    rangeFillLine.style.right = RANGE_LENGTH - rangeBtnRight.offsetLeft + 'px';
    filterState.price.min = Math.round(priceRange / RANGE_LENGTH * leftX) + minPrice;
    filterState.price.max = Math.round(priceRange / RANGE_LENGTH * rightX) + minPrice;

    rangePriceMin.textContent = filterState.price.min;
    rangePriceMax.textContent = filterState.price.max;
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
      updatePriceCounter();
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      window.catalog.showCatalog();
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

  var foodTypeHandler = function (evt) {
    var kind = evt.target.textContent;
    filterState.foodType = filterState.foodType ^ foodTypeFlags[kind];
    window.catalog.showCatalog();
  };

  var foodPropertyHandler = function (evt) {
    var property = evt.target.textContent;
    filterState.foodProperty[property] = !filterState.foodProperty[property];
    window.catalog.showCatalog();
  };

  foodTypeCheckboxes.forEach(function (it) {
    it.addEventListener('click', function (evt) {
      foodTypeHandler(evt);
    });
  });

  foodPropertyCheckboxes.forEach(function (it) {
    it.addEventListener('click', function (evt) {
      foodPropertyHandler(evt);
    });
  });

  onlyFavoritesCheckbox.addEventListener('click', function () {
    filterState.onlyFavorites = !filterState.onlyFavorites;
    filterState.availability = false;
    catalogSidebar.querySelector('#filter-availability').checked = false;
    window.catalog.showCatalog();
  });

  availabilityCheckbox.addEventListener('click', function () {
    filterState.availability = !filterState.availability;
    filterState.favorites = false;
    catalogSidebar.querySelector('#filter-favorite').checked = false;
    window.catalog.showCatalog();
  });

  sortingButtons.forEach(function (it) {
    it.addEventListener('click', function (evt) {
      filterState.sorting = evt.target.textContent;
      window.catalog.showCatalog();
    });
  });

  catalogSubmitButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    filterState = JSON.parse(JSON.stringify(defaultFilterState));

    rangeBtnLeft.style.left = -BUTTON_WIDTH / 2 + 'px';
    rangeBtnRight.style.left = RANGE_LENGTH - BUTTON_WIDTH / 2 + 'px';
    updatePriceCounter();
    applyRangeBtnStyle();

    catalogSidebar.querySelectorAll('.input-btn__input--checkbox').forEach(function (it) {
      it.checked = false;
    });
    catalogSidebar.querySelector('#filter-popular').checked = true;

    window.catalog.showCatalog();
  });

  var applyFilter = function (goods) {

    if (filterState.onlyFavorites) {
      var filtered = goods.filter(function (it) {
        return it.favorites;
      });
      return filtered.sort(sortingMethod[filterState.sorting]);
    }

    if (filterState.availability) {
      filtered = goods.filter(function (it) {
        return it.amount > 0;
      });
      return filtered.sort(sortingMethod[filterState.sorting]);
    }

    filtered = goods.filter(function (it) {
      return filterState.foodType & foodTypeFlags[it.kind] || !filterState.foodType;
    });

    if (filterState.foodProperty['Без сахара']) {
      filtered = filtered.filter(function (it) {
        return !it.nutritionFacts.sugar;
      });
    }
    if (filterState.foodProperty['Вегетарианское']) {
      filtered = filtered.filter(function (it) {
        return it.nutritionFacts.vegetarian;
      });
    }
    if (filterState.foodProperty['Безглютеновое']) {
      filtered = filtered.filter(function (it) {
        return !it.nutritionFacts.gluten;
      });
    }

    filtered = filtered.filter(function (it) {
      return it.price >= filterState.price.min && it.price <= filterState.price.max;
    });

    return filtered.sort(sortingMethod[filterState.sorting]);
  };


  window.filter = {
    resetCounters: resetCounters,
    initFilters: initFilters,
    updateFavoritesCounter: updateFavoritesCounter,
    applyFilter: applyFilter
  };

})();
