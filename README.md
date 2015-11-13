Castle.js
=========

Provides 2 immutable data structures – **Dictionary** and **Collection**. Each of them guarantees,
that containing data is always valid once created.

**Supports**: node.js, modern browsers, IE9+


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
```

otherwise just attach castle.js:

```html
<head>
    <script src="<path>/castle.js"></script>
</head>
```


Include type type-definition if using [TypeScript](http://www.typescriptlang.org/):

```javascript
///<reference path='./node_modules/castle/dist/Castle.d.ts'/>
```


Dictionary
==========

Dictionary is a key-value map, with pre-defined describing schema and (optionally) default values.

Any data, not described in schema will be filtered, if given data doesn't satisfy schema,
or if any property is missing and no default one provided, Error will occur.


**Methods**

* get(key)
* set(key, value)
* deepEqual(anotherDictionary)


```javascript
var Person = Castle.Dictionary.extend("Person", {
    schema: {                        // ^^^^ optional, for debugging
        name: Castle.PropTypes.string,
        age: Castle.PropTypes.number
    },
    defaults: {
        age: 18
    }
    // any additional static methods
}, {
    // any additional instance methods
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


**ES2015 stage-1 / TypeScript syntax** (Note, that Babel by default won't make it usable with IE < 11 due to [#2450](https://github.com/babel/babel/issues/2450))

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

```javascript
var jsonData = { name: "John", surname: "Lennon" }

// When calling constructor directly, errors are being thrown. That's great when using Promises:

window.fetch("/user.json")
    .then(response => response.json())
    .then(json => new Person(json))
    .catch(e => {
        // handle error
    })
    
// or:

try {
    var john = new Person(jsonData);
    console.log(john.name); // John
    console.log(john.age);  // 21
} catch (error) {
    // handle error
}

// or:

Person.serialize(
    jsonData,
    function(error) {
        // handle error
    },
    function(john) {
        console.log(john.name); // John
        console.log(john.age);  // 21
    }
);

// “serialize” returning value is instance of Dictionary or null:

var mayBeJohn = Person.serialize(jsonData, someErrorCallback);
if (mayBeJohn !== null) {
    console.log(mayBeJohn.name); // John
    console.log(mayBeJohn.age);  // 21
}
```


#### Use Dictionary

```js
console.log(john.age); // 21
console.log(john.get("age")); // 21
var newJohn = john.set("age", 45);
console.log(newJohn.age); // 45
console.log(john === newJohn); // false

// Properties are immutable:
newJohn.age = 99;
console.log(newJohn.age); // 45
```

It's impossible to set invalid value:

```javascript
var newJohn = john.set("age", ["I like arrays"]);
console.log(newJohn.get("age")); // 21
console.log(john === newJohn) // true

// Error can be handled (otherwise it'll be printed to console):
var newJohn = john.set("age", ["I like arrays"], function(error) {
    console.log(error); // Error: Invalid prop `age` of type `array` supplied to `Person`, expected `number`
});
```



Collection
==========

Collection is just a list of dictionaries of defined type.


**Methods**

* get(index)
* set(index, value)
* deepEqual(anotherCollection)
* forEach — like [Array.prototype.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
* map     — like [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
* filter  — like [Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
* sort    — like [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
* indexOf — like [Array.prototype.indexOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
* slice   — like [Array.prototype.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
* pop     — like [Array.prototype.pop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)
* reduce  — like [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)


```javascript

var People = Person.createCollection();

// or:

var People = Castle.Collection.extend("People", {
    type: Person
});

// or:

var People = Castle.Collection.extend("People")
    .setType(Person);
```


**ES2015 stage-1 / TypeScript syntax** (Again, note, that Babel by default won't make it usable with IE < 11 due to [#2450](https://github.com/babel/babel/issues/2450))

```javascript
class People extends Castle.Collection {
    static type = Person;
}
```


#### Serializing Collection data

```javascript
var jsonData = [
    { name: "John",   surname: "Lennon"    },
    { name: "Paul",   surname: "McCartney" },
    { name: "George", surname: "Harrison"  },
    { name: "Ringo",  surname: "Starr"     }
];


// When calling constructor directly, errors are being thrown. That's great when using Promises:

window.fetch("/band.json")
    .then(response => response.json())
    .then(json => new Person(json))
    .catch(e => {
        // handle error
    })

// or:

try {
    var band = new People(jsonData);
    console.log(band.length);  // 4
    console.log(band[0].name); // John
} catch (error) {
    // handle error
}

// or:

People.serialize(
    jsonData,
    function(error) {
        // handle error
    },
    function(band) {
        console.log(band.length);  // 4
        console.log(band[0].name); // John
    }
);

// “serialize” returning value is instance of Collection or null:

var mayBeBand = People.serialize(jsonData, someErrorCallback);
if (mayBeBand !== null) {
    console.log(mayBeBand.length);  // 4
    console.log(mayBeBand[0].name); // John
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

`npm build`


#### Running tests

* `npm test` — run unit tests with Karma & PhantomJS
* `npm run tests-all` — run tests in all browsers. Requirements:
    * Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
    * Install IE9: `curl -s https://raw.githubusercontent.com/xdissent/ievms/master/ievms.sh | env IEVMS_VERSIONS="9" bash`

