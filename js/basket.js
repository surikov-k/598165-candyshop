'use strict';
(function () {
  var mainHeaderBasket = document.querySelector('.main-header__basket');

  var updateBasket = function () {
    if (window.catalog.orders.length) {

      var basketTotalAmount = window.catalog.orders.length;

      var basketTotalPrice = window.catalog.orders
          .map(function (it) {
            return it.price * it.orderedAmount;
          }).reduce(function (it, total) {
            return total + it;
          });
      mainHeaderBasket.textContent = 'В корзине ' + basketTotalAmount + ' товара на сумму ' + basketTotalPrice + ' ₽';
    } else {
      mainHeaderBasket.textContent = 'В корзине ничего нет';
    }
  };

  window.basket.updateBasket = updateBasket;

})();
