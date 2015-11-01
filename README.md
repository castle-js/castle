# Castle.js

Provides 2 immutable data structures – **Dictionary** and **Collection**. Each of them guarantees, that containing data
is always valid.

Uses [Immutable.js](https://facebook.github.io/immutable-js/), most corresponding methods of Map and List
that make sense are available.


## Dictionary

...

## Collection

...


# Getting started

Install Castle:

* `npm install castle --save`
* or `bower install castle --save`
* or download [latest release](https://github.com/castle-js/castle/releases)

If working in [node](https://nodejs.org/en/) environment or using module builder like [browserify](http://browserify.org/), [webpack](https://webpack.github.io/) or [requirejs](http://requirejs.org/):

```javascript
// CommonJS
var Castle = require("castle");

// ES6 modules
import Castle from "castle";
// or
import { PropTypes, Dictionary, Collection, Immutable } from "castle";
```

otherwise just attach castle.js:

```html
<script src="<path>/castle.js"></script>
```



# Develop

```sh
git clone https://github.com/castle-js/castle.git
cd castle
npm install
```

#### Start webpack-dev-server

`npm start` or `host=localhost port=8887 npm start`


#### Build

`npm dist`


#### Running tests

* `npm test` — run unit tests with Karma & PhantomJS
* `npm run tests-all` — run tests in all browsers. Requirements:
    * Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
    * `npm install -g iectrl`
    * `iectrl install "IE9 - Win7"`

