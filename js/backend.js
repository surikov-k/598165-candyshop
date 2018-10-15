'use strict';
(function () {
  var POST_URL = 'https://js.dump.academy/candyshop';
  var GET_URL = 'https://js.dump.academy/candyshop/data';
  var TIMEOUT = 10000;


  var backend = function (method, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;

        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    xhr.timeout = TIMEOUT;
    if (method === 'GET') {
      xhr.open('GET', GET_URL);
      xhr.send();
    }
    if (method === 'POST') {
      xhr.open('POST', POST_URL);
      xhr.send(window.order.data);
    }
  };


  window.backend = backend;
})();
