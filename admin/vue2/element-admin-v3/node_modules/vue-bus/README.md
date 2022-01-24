# vue-bus [![Build Status](https://img.shields.io/circleci/project/yangmingshan/vue-bus.svg)](https://circleci.com/gh/yangmingshan/vue-bus) [![Coverage Status](https://img.shields.io/codecov/c/github/yangmingshan/vue-bus.svg)](https://codecov.io/gh/yangmingshan/vue-bus) [![Downloads](https://img.shields.io/npm/dt/vue-bus.svg)](https://www.npmjs.com/package/vue-bus) [![Version](https://img.shields.io/npm/v/vue-bus.svg)](https://www.npmjs.com/package/vue-bus) [![License](https://img.shields.io/npm/l/vue-bus.svg)](https://www.npmjs.com/package/vue-bus)

A event bus for Vue.js, support both Vue 1.0 and 2.0. See Vue [documentation](https://vuejs.org/v2/guide/migration.html#Events) for more detail.

## Installation
You can install it via [yarn](https://yarnpkg.com) or [npm](https://npmjs.com).
```
$ yarn add vue-bus
$ npm install vue-bus --save
```
And it's available on [jsdelivr](https://cdn.jsdelivr.net/npm/vue-bus/dist/vue-bus.js) or [unpkg](https://unpkg.com/vue-bus/dist/vue-bus.js).
```html
<!-- development version -->
<script src="https://cdn.jsdelivr.net/npm/vue-bus/dist/vue-bus.js"></script>

<!-- production version -->
<script src="https://cdn.jsdelivr.net/npm/vue-bus/dist/vue-bus.min.js"></script>
```
When used with a module system, you must explicitly install the bus via Vue.use():
```js
import Vue from 'vue';
import VueBus from 'vue-bus';

Vue.use(VueBus);
```
You don't need to do this when using global script tags.

## Usage
#### Listen and clean
```js
// ...
created() {
  this.$bus.on('add-todo', this.addTodo);
  this.$bus.once('once', () => console.log('This listener will only fire once'));
},
beforeDestroy() {
  this.$bus.off('add-todo', this.addTodo);
},
methods: {
  addTodo(newTodo) {
    this.todos.push(newTodo);
  }
}
```
#### Trigger
```js
// ...
methods: {
  addTodo() {
    this.$bus.emit('add-todo', { text: this.newTodoText });
    this.$bus.emit('once');
    this.newTodoText = '';
  }
}
```
#### Another way to use vue-bus
```js
// xxx.js
import Vue from 'vue';

Vue.bus.emit('someEvent');
```
*Note: `on` `once` `off` `emit` are aliases for `$on` `$once` `$off` `$emit`. See the [API](https://vuejs.org/v2/api/#Instance-Methods-Events) for more detail.*

## License
[MIT](https://opensource.org/licenses/MIT)
