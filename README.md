# yii2-frontend
Frontend часть для проектов на ExtPoint Yii2 Boilerplate и yii2-core

## Что содержит

### Компоненты

* ClientStorageComponent - чтение/запись в cookie/session/local storage;
* HtmlComponent - очень удобная работа с именованиями классов по БЭМ;
* HttpComponent - отправка HTTP запросов на сервер, обертка над axios;
* LocaleComponent - компонент локализации, поддерживает plural.

### Webpack

Обертка над webpack-easy, предназначенная только для шаблонных проектов на ExtPoint Yii2 Boilerplate.

Если у вас встретилась задача, которую не может решить данный модуль - стоит отказаться от него в пользу webpack-easy или webpack.

Пример использования (по-умолчанию в boilerplate):

```js
require('extpoint-yii2/webpack')
    // Index js. Core module at first
    .base('./app/*/client.js')

    // Index css
    .styles('./app/*/style/index.less')

    // Admin css
    .styles('./app/*/admin/style/index.less', 'admin')

    // Other css
    .styles('./app/landing/style/index-*.less')

    // Widgets. Only widgets with php file. Filter /path/MY_WIDGET/MY_WIDGET.js
    .widgets('./app/*/widgets')
    .widgets('./app/*/admin/widgets');
```