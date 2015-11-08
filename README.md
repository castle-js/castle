Castle.js
=========

Provides 2 immutable data structures – **Dictionary** and **Collection**. Each of them guarantees,
that containing data is valid once created and until it's properties wasn't modified directly.

Immutable versions of those – **ImmutableDictionary** and **ImmutableCollection** cannot be broken at all.
Using them requires [Immutable.js](https://facebook.github.io/immutable-js/) to be accessible
(should be installed separetely in non-node.js environment)


Getting started
===============

Install Castle:

* `npm install castle --save`
* or `bower install castle --save`
* or download [latest release](https://github.com/castle-js/castle/releases)

If working in [node.js](https://nodejs.org/en/) environment or using module builder like
[browserify](http://browserify.org/), [webpack](https://webpack.github.io/) or [requirejs](http://requirejs.org/):

```javascript
// CommonJS
var Castle = require("castle");

// ES6 modules
import Castle from "castle";
// or
import { PropTypes, Dictionary, Collection } from "castle";
// or
import { PropTypes, ImmutableDictionary, ImmutableCollection } from "castle";
```

otherwise just attach castle.js:

```html
<head>
    <!-- #if you wish to use ImmutableDictionary/ImmutableCollection -->
    <script src="<path>/immutable.js"></script>
    <!-- #endif -->
    <script src="<path>/castle.js"></script>
</head>
```


Attach type type-definition file if using [TypeScript](http://www.typescriptlang.org/):

```javascript
///<reference path='./node_modules/castle/dist/Castle.d.ts'/>
```


Dictionary
==========

Dictionary is a key-value map, with pre-defined describing schema and (optionally) default values.

Any data, not described in schema will be filtered, if given data doesn't satisfy schema,
or if needed properties are missing and no default provided, Error will occur.


**ES5 syntax**

```javascript
var Person = Castle.Dictionary.extend("Person", {
    schema: {                        // ^^^^ optional, for debugging
        name: Castle.PropTypes.string,
        age: Castle.PropTypes.number
    },
    defaults: {
        age: 18
    }
});

// or:

var Person = Castle.Dictionary.extend("Person")
                .setSchema({
                    name: Castle.PropTypes.string,
                    age: Castle.PropTypes.number
                })
                .setDefaults({
                    age: 21
                });
```


**ES2015 syntax**

```javascript
class Person extends Castle.Dictionary {
    static schema = {
        name: Castle.PropTypes.string,
        surname: Castle.PropTypes.string,
        stageName: Castle.PropTypes.string.optional,
        age: Castle.PropTypes.number
    };
    static defaults = {
        age: 21
    };
}
```

#### Serializing Dictionary data

```
var jsonData = { name: "John", surname: "Lennon" }

Person.serialize(
    jsonData,
    function errorCallback(error) {
        // handle error
    },
    successCallback(john) {
        console.log(john.name); // John
        console.log(john.age);  // 21
    }
);


// “serialize” returning value is instance or null:

var mayBeJohn = Person.serialize(jsonData, someErrorCallback);
if (mayBeJohn !== null) {
    console.log(mayBeJohn.name); // John
    console.log(mayBeJohn.age);  // 21
}


// or use try-catch with direct calling constructor (may be slower):

try {
    var john = new Person(jsonData);
    console.log(john.name); // John
    console.log(john.age);  // 21
} catch (error) {
    // handle error
}
```


Collection
==========

Collection is just a list of dictionaries of defined type.


**ES5 syntax**

```javascript
var People = Castle.Collection.extend("People", {
    type:  Person.getTypeChecker();
});

// or:

var People = Castle.Collection.extend("People")
                .setType(Person.getTypeChecker());
```


**ES2015 syntax**

```javascript
class People extends Castle.Collection {
    static type = Person.getTypeChecker();
}
```


#### Serializing Collection data

```
var jsonData = [
    { name: "John",   surname: "Lennon"    },
    { name: "Paul",   surname: "McCartney" },
    { name: "George", surname: "Harrison"  },
    { name: "Ringo",  surname: "Starr"     }
];

People.serialize(
    jsonData,
    function errorCallback(error) {
        // handle error
    },
    successCallback(band) {
        console.log(band.length);  // 4
        console.log(band[0].name); // John
    }
);


// “serialize” returning value is instance or null:

var mayBeBand = People.serialize(jsonData, someErrorCallback);
if (mayBeBand !== null) {
    console.log(mayBeBand.length);  // 4
    console.log(mayBeBand[0].name); // John
}


// or use try-catch with direct calling constructor (may be slower):

try {
    var band = new People(jsonData);
    console.log(band.length);  // 4
    console.log(band[0].name); // John
} catch (error) {
    // handle error
}
```


PropTypes
=========

PropTypes provides validators in the same way as
[ReactPropTypes](https://facebook.github.io/react/docs/reusable-components.html)
(basically, it can be used in React.js components). Doesn't include loose validators, like “oneOfType” or “any”.

* `PropTypes.bool`
* `PropTypes.func`
* `PropTypes.number`
* `PropTypes.string`
* `PropTypes.instanceOf(MyClass)`
* `MyDictionary.getTypeChecker()` (shorthand for `PropTypes.dictionary(MyDictionary)`)
* `MyCollection.getTypeChecker()` (shorthand for `PropTypes.collection(MyCollection)`)

`MyDictionary.getTypeChecker()` and `MyCollection.getTypeChecker()` will serialize javascript objects and arrays
into corresponding MyPersonDictionary and MyPeopleCollection instances, so using them instead
of `PropTypes.instanceOf` for Dictionaries and Collections is preferred.

All validators are *required* by default. Optionals can be declared as `PropTypes.number.optional`,
`MyDictionary.getTypeChecker().optional` etc.


Source usage & building
=======================

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

