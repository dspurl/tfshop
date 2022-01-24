/*!
 * Awe-dnd v0.3.2
 * (c) 2018 Awe <hilongjw@gmail.com>
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueDragging = factory());
}(this, (function () { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragData = function () {
    function DragData() {
        _classCallCheck(this, DragData);

        this.data = {};
    }

    _createClass(DragData, [{
        key: 'new',
        value: function _new(key) {
            if (!this.data[key]) {
                this.data[key] = {
                    className: '',
                    List: [],
                    KEY_MAP: {}
                };
            }
            return this.data[key];
        }
    }, {
        key: 'get',
        value: function get(key) {
            return this.data[key];
        }
    }]);

    return DragData;
}();

var $dragging = {
    listeners: {},
    $on: function $on(event, func) {
        var events = this.listeners[event];
        if (!events) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(func);
    },
    $once: function $once(event, func) {
        var vm = this;
        function on() {
            vm.$off(event, on);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            func.apply(vm, args);
        }
        this.$on(event, on);
    },
    $off: function $off(event, func) {
        var events = this.listeners[event];
        if (!func || !events) {
            this.listeners[event] = [];
            return;
        }
        this.listeners[event] = this.listeners[event].filter(function (i) {
            return i !== func;
        });
    },
    $emit: function $emit(event, context) {
        var events = this.listeners[event];
        if (events && events.length > 0) {
            events.forEach(function (func) {
                func(context);
            });
        }
    }
};
var _ = {
    on: function on(el, type, fn) {
        el.addEventListener(type, fn);
    },
    off: function off(el, type, fn) {
        el.removeEventListener(type, fn);
    },
    addClass: function addClass(el, cls) {
        if (arguments.length < 2) {
            el.classList.add(cls);
        } else {
            for (var i = 1, len = arguments.length; i < len; i++) {
                el.classList.add(arguments[i]);
            }
        }
    },
    removeClass: function removeClass(el, cls) {
        if (arguments.length < 2) {
            el.classList.remove(cls);
        } else {
            for (var i = 1, len = arguments.length; i < len; i++) {
                el.classList.remove(arguments[i]);
            }
        }
    }
};

var vueDragging = function (Vue, options) {
    var isPreVue = Vue.version.split('.')[0] === '1';
    var dragData = new DragData();
    var isSwap = false;
    var Current = null;

    function handleDragStart(e) {
        var el = getBlockEl(e.target);
        var key = el.getAttribute('drag_group');
        var drag_key = el.getAttribute('drag_key');
        var comb = el.getAttribute('comb');
        var DDD = dragData.new(key);
        var item = DDD.KEY_MAP[drag_key];
        var index = DDD.List.indexOf(item);
        var groupArr = DDD.List.filter(function (item) {
            return item[comb];
        });
        _.addClass(el, 'dragging');

        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text', JSON.stringify(item));
        }

        Current = {
            index: index,
            item: item,
            el: el,
            group: key,
            groupArr: groupArr
        };
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    function handleDragEnter(e) {
        var el = void 0;
        if (e.type === 'touchmove') {
            e.stopPropagation();
            e.preventDefault();
            el = getOverElementFromTouch(e);
            el = getBlockEl(el);
        } else {
            el = getBlockEl(e.target);
        }

        if (!el || !Current) return;

        var key = el.getAttribute('drag_group');
        if (key !== Current.group || !Current.el || !Current.item || el === Current.el) return;
        var drag_key = el.getAttribute('drag_key');
        var DDD = dragData.new(key);
        var item = DDD.KEY_MAP[drag_key];

        if (item === Current.item) return;

        var indexTo = DDD.List.indexOf(item);
        var indexFrom = DDD.List.indexOf(Current.item);

        swapArrayElements(DDD.List, indexFrom, indexTo);

        Current.groupArr.forEach(function (item) {
            if (item != Current.item) {
                DDD.List.splice(DDD.List.indexOf(item), 1);
            }
        });

        var targetIndex = DDD.List.indexOf(Current.item);
        if (Current.groupArr.length) {
            var _DDD$List;

            (_DDD$List = DDD.List).splice.apply(_DDD$List, [targetIndex, 1].concat(_toConsumableArray(Current.groupArr)));
        }

        Current.index = indexTo;
        isSwap = true;
        $dragging.$emit('dragged', {
            draged: Current.item,
            to: item,
            value: DDD.value,
            group: key
        });
    }

    function handleDragLeave(e) {
        _.removeClass(getBlockEl(e.target), 'drag-over', 'drag-enter');
    }

    function handleDrag(e) {}

    function handleDragEnd(e) {
        var el = getBlockEl(e.target);
        _.removeClass(el, 'dragging', 'drag-over', 'drag-enter');
        Current = null;
        // if (isSwap) {
        isSwap = false;
        var group = el.getAttribute('drag_group');
        $dragging.$emit('dragend', { group: group });
        // }
    }

    function handleDrop(e) {
        e.preventDefault();
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        return false;
    }

    function getBlockEl(el) {
        if (!el) return;
        while (el.parentNode) {
            if (el.getAttribute && el.getAttribute('drag_block')) {
                return el;
                break;
            } else {
                el = el.parentNode;
            }
        }
    }

    function swapArrayElements(items, indexFrom, indexTo) {
        var item = items[indexTo];
        if (isPreVue) {
            items.$set(indexTo, items[indexFrom]);
            items.$set(indexFrom, item);
        } else {
            Vue.set(items, indexTo, items[indexFrom]);
            Vue.set(items, indexFrom, item);
        }
        return items;
    }

    function getOverElementFromTouch(e) {
        var touch = e.touches[0];
        var el = document.elementFromPoint(touch.clientX, touch.clientY);
        return el;
    }

    function addDragItem(el, binding, vnode) {
        var item = binding.value.item;
        var list = binding.value.list;
        var DDD = dragData.new(binding.value.group);

        var drag_key = isPreVue ? binding.value.key : vnode.key;
        DDD.value = binding.value;
        DDD.className = binding.value.className;
        DDD.KEY_MAP[drag_key] = item;
        if (list && DDD.List !== list) {
            DDD.List = list;
        }
        el.setAttribute('draggable', 'true');
        el.setAttribute('drag_group', binding.value.group);
        el.setAttribute('drag_block', binding.value.group);
        el.setAttribute('drag_key', drag_key);
        el.setAttribute('comb', binding.value.comb);

        _.on(el, 'dragstart', handleDragStart);
        _.on(el, 'dragenter', handleDragEnter);
        _.on(el, 'dragover', handleDragOver);
        _.on(el, 'drag', handleDrag);
        _.on(el, 'dragleave', handleDragLeave);
        _.on(el, 'dragend', handleDragEnd);
        _.on(el, 'drop', handleDrop);

        _.on(el, 'touchstart', handleDragStart);
        _.on(el, 'touchmove', handleDragEnter);
        _.on(el, 'touchend', handleDragEnd);
    }

    function removeDragItem(el, binding, vnode) {
        var DDD = dragData.new(binding.value.group);
        var drag_key = isPreVue ? binding.value.key : vnode.key;
        DDD.KEY_MAP[drag_key] = undefined;
        _.off(el, 'dragstart', handleDragStart);
        _.off(el, 'dragenter', handleDragEnter);
        _.off(el, 'dragover', handleDragOver);
        _.off(el, 'drag', handleDrag);
        _.off(el, 'dragleave', handleDragLeave);
        _.off(el, 'dragend', handleDragEnd);
        _.off(el, 'drop', handleDrop);

        _.off(el, 'touchstart', handleDragStart);
        _.off(el, 'touchmove', handleDragEnter);
        _.off(el, 'touchend', handleDragEnd);
    }

    Vue.prototype.$dragging = $dragging;
    if (!isPreVue) {
        Vue.directive('dragging', {
            bind: addDragItem,
            update: function update(el, binding, vnode) {
                var DDD = dragData.new(binding.value.group);
                var item = binding.value.item;
                var list = binding.value.list;

                var drag_key = vnode.key;
                var old_item = DDD.KEY_MAP[drag_key];
                if (item && old_item !== item) {
                    DDD.KEY_MAP[drag_key] = item;
                }
                if (list && DDD.List !== list) {
                    DDD.List = list;
                }
            },

            unbind: removeDragItem
        });
    } else {
        Vue.directive('dragging', {
            update: function update(newValue, oldValue) {
                addDragItem(this.el, {
                    modifiers: this.modifiers,
                    arg: this.arg,
                    value: newValue,
                    oldValue: oldValue
                });
            },
            unbind: function unbind(newValue, oldValue) {
                removeDragItem(this.el, {
                    modifiers: this.modifiers,
                    arg: this.arg,
                    value: newValue ? newValue : { group: this.el.getAttribute('drag_group') },
                    oldValue: oldValue
                });
            }
        });
    }
};

return vueDragging;

})));
