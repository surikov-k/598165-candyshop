'use strict';

(function () {

  var MIN_PRICE = 15;
  var MAX_PRICE = 275;
  var RANGE_LENGTH = 245;
  var BUTTON_WIDTH = 10;

  var catalogSidebar = document.querySelector('.catalog__sidebar');
  var rangePriceMin = catalogSidebar.querySelector('.range__price--min');
  var rangePriceMax = catalogSidebar.querySelector('.range__price--max');
  var rangeBtnLeft = catalogSidebar.querySelector('.range__btn--left');
  var rangeBtnRight = catalogSidebar.querySelector('.range__btn--right');
  var rangeFillLine = catalogSidebar.querySelector('.range__fill-line');

  var applyRangeBtnStyle = function () {
    var priceRange = MAX_PRICE - MIN_PRICE;
    var leftX = rangeBtnLeft.offsetLeft + BUTTON_WIDTH / 2;
    var rightX = rangeBtnRight.offsetLeft + BUTTON_WIDTH / 2;

    rangeFillLine.style.left = rangeBtnLeft.offsetLeft + 'px';
    rangeFillLine.style.right = RANGE_LENGTH - rangeBtnRight.offsetLeft + 'px';
    rangePriceMin.textContent = Math.round(priceRange / RANGE_LENGTH * leftX) + MIN_PRICE;
    rangePriceMax.textContent = Math.round(priceRange / RANGE_LENGTH * rightX) + MIN_PRICE;
  };

  applyRangeBtnStyle();

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

})();
