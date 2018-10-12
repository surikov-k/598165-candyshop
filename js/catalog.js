'use strict';
(function () {

  var orders = [];
  var goods = [];
  window.backend.load(
      function (data) {
        for (var i = 0; i < data.length; i++) {
          goods.push(data[i]);
          goods[i].picture = 'img/cards/' + data[i].picture;
          showCatalog();
        }
      },
      function (error) {
        window.modal.showErrorModal(error);
      });

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

    card.querySelector('.star__count').textContent = '(' + item.rating.number + ')';

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
    window.basket.updateBasket();
  };


  var removeCardFromOrder = function (card) {

    var cardTitle = card.querySelector('.card-order__title').textContent;
    var catalogItem = getObjByName(goods, cardTitle);
    var catalogCard = getCatalogCardByName(cardTitle);

    applyCatalogCardStyle(catalogCard, catalogItem.amount);

    for (var i = 0; i < orders.length; i++) {
      if (orders[i].name === cardTitle) {
        orders.splice(i, 1);
        break;
      }
    }

    document.querySelector('.goods__cards').removeChild(card);

    if (orders.length === 0) {
      document.querySelector('.goods__card-empty').classList.remove('visually-hidden');
      window.order.disableBuyForm();
    }
    window.basket.updateBasket();
  };

  var emptyOrder = function () {
    var goodsCards = document.querySelector('.goods__cards');
    var cardsInOrder = orderCardsWrapper.querySelectorAll('.card-order');
    cardsInOrder.forEach(function (it) {
      goodsCards.removeChild(it);
    });
    orders.length = 0;
    window.basket.updateBasket();
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

      window.order.enableBuyForm();

    }
    applyCatalogCardStyle(card, catalogItem.amount - orderItem.orderedAmount);
    window.basket.updateBasket();

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


  var catalogCards = document.querySelector('.catalog__cards');

  var clearCatalog = function () {
    while (catalogCards.firstChild) {
      catalogCards.removeChild(catalogCards.firstChild);
    }
  };

  var showCatalog = function () {
    clearCatalog();
    var goodsFiltered = [];

    for (var i = 0; i < goods.length; i++) {
      goodsFiltered.push(goods[i]);
    }

    var catalogCardsFragment = addCards(createCatalogCard, goodsFiltered);
    catalogCards.appendChild(catalogCardsFragment);
  };


  window.catalog = {
    orders: orders,
    emptyOrder: emptyOrder
  };
})();
