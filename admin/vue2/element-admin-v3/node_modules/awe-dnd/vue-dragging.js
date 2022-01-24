class DragData {
    constructor () {
        this.data = {}
    }

    new (key) {
        if (!this.data[key]) {
            this.data[key] = {
                className: '',
                List: [],
                KEY_MAP: {}
            }
        }
        return this.data[key]
    }

    get (key) {
        return this.data[key]
    }
}

const $dragging = {
    listeners: {
    },
    $on (event, func) {
        const events = this.listeners[event]
        if (!events) {
            this.listeners[event] = []
        }
        this.listeners[event].push(func)
    },
    $once (event, func) {
        const vm = this
        function on (...args) {
            vm.$off(event, on)
            func.apply(vm, args)
        }
        this.$on(event, on)
    },
    $off (event, func) {
        const events = this.listeners[event]
        if (!func || !events) {
            this.listeners[event] = []
            return
        }
        this.listeners[event] = this.listeners[event].filter(i => i !== func)
    },
    $emit (event, context) {
        const events = this.listeners[event]
        if (events && events.length > 0) {
            events.forEach(func => {
                func(context)
            })
        }
    }
}
const _ = {
    on (el, type, fn) {
        el.addEventListener(type, fn)
    },
    off (el, type, fn) {
        el.removeEventListener(type, fn)
    },
    addClass (el, cls) {
        if(arguments.length < 2) {
            el.classList.add(cls)
        } else {
            for (let i = 1, len = arguments.length; i < len; i++) {
                el.classList.add(arguments[i])
            }
        }
    },
    removeClass (el, cls) {
        if(arguments.length < 2) {
            el.classList.remove(cls)
        } else {
            for (let i = 1, len = arguments.length; i < len; i++) {
                el.classList.remove(arguments[i])
            }
        }
    }
}

export default function (Vue, options) {
    const isPreVue = Vue.version.split('.')[0] === '1'
    const dragData = new DragData()
    let isSwap = false
    let Current = null

    function handleDragStart(e) {
        const el = getBlockEl(e.target)
        const key = el.getAttribute('drag_group')
        const drag_key = el.getAttribute('drag_key')
        const comb = el.getAttribute('comb')
        const DDD = dragData.new(key)
        const item = DDD.KEY_MAP[drag_key]
        const index = DDD.List.indexOf(item)
        const groupArr = DDD.List.filter(item => item[comb])
        _.addClass(el, 'dragging')

        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move'
            e.dataTransfer.setData('text', JSON.stringify(item))
        }

        Current = {
            index,
            item,
            el,
            group: key,
            groupArr
        }
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault()
        }
        return false
    }

    function handleDragEnter(e) {
        let el
        if (e.type === 'touchmove') {
            e.stopPropagation()
            e.preventDefault()
            el = getOverElementFromTouch(e)
            el = getBlockEl(el)
        } else {
            el = getBlockEl(e.target)
        }

        if (!el || !Current) return

        const key = el.getAttribute('drag_group')
        if (key !== Current.group || !Current.el || !Current.item || el === Current.el) return
        const drag_key = el.getAttribute('drag_key')
        const DDD = dragData.new(key)
        const item = DDD.KEY_MAP[drag_key]

        if (item === Current.item) return

        const indexTo = DDD.List.indexOf(item)
        const indexFrom = DDD.List.indexOf(Current.item)

        swapArrayElements(DDD.List, indexFrom, indexTo)

        Current.groupArr.forEach(item => {
            if (item != Current.item) {
                DDD.List.splice(DDD.List.indexOf(item), 1)
            }
        })

        let targetIndex = DDD.List.indexOf(Current.item)
        if (Current.groupArr.length) {
            DDD.List.splice(targetIndex, 1, ...Current.groupArr)
        }

        Current.index = indexTo
        isSwap = true
        $dragging.$emit('dragged', {
            draged: Current.item,
            to: item,
            value: DDD.value,
            group: key
        })
    }

    function handleDragLeave(e) {
        _.removeClass(getBlockEl(e.target), 'drag-over', 'drag-enter')
    }

    function handleDrag (e) {
    }

    function handleDragEnd (e) {
        const el = getBlockEl(e.target)
        _.removeClass(el, 'dragging', 'drag-over', 'drag-enter')
        Current = null
        // if (isSwap) {
        isSwap = false
        const group = el.getAttribute('drag_group')
        $dragging.$emit('dragend', { group })
        // }
    }

    function handleDrop(e) {
        e.preventDefault()
        if (e.stopPropagation) {
            e.stopPropagation()
        }
        return false
    }

    function getBlockEl (el) {
        if (!el) return
        while (el.parentNode) {
            if (el.getAttribute && el.getAttribute('drag_block')) {
                return el
                break
            } else {
                el = el.parentNode
            }
        }
    }

    function swapArrayElements (items, indexFrom, indexTo) {
        let item = items[indexTo]
        if (isPreVue) {
            items.$set(indexTo, items[indexFrom])
            items.$set(indexFrom, item)
        } else {
            Vue.set(items, indexTo, items[indexFrom])
            Vue.set(items, indexFrom, item)
        }
        return items
    }

    function getOverElementFromTouch (e) {
        const touch = e.touches[0]
        const el = document.elementFromPoint(touch.clientX, touch.clientY)
        return el
    }

    function addDragItem (el, binding, vnode) {
        const item = binding.value.item
        const list = binding.value.list
        const DDD = dragData.new(binding.value.group)

        const drag_key = isPreVue? binding.value.key : vnode.key
        DDD.value = binding.value
        DDD.className = binding.value.className
        DDD.KEY_MAP[drag_key] = item
        if (list && DDD.List !== list) {
            DDD.List = list
        }
        el.setAttribute('draggable', 'true')
        el.setAttribute('drag_group', binding.value.group)
        el.setAttribute('drag_block', binding.value.group)
        el.setAttribute('drag_key', drag_key)
        el.setAttribute('comb', binding.value.comb)

        _.on(el, 'dragstart', handleDragStart)
        _.on(el, 'dragenter', handleDragEnter)
        _.on(el, 'dragover', handleDragOver)
        _.on(el, 'drag', handleDrag)
        _.on(el, 'dragleave', handleDragLeave)
        _.on(el, 'dragend', handleDragEnd)
        _.on(el, 'drop', handleDrop)

        _.on(el, 'touchstart', handleDragStart)
        _.on(el, 'touchmove', handleDragEnter)
        _.on(el, 'touchend', handleDragEnd)
    }

    function removeDragItem (el, binding, vnode) {
        const DDD = dragData.new(binding.value.group)
        const drag_key = isPreVue? binding.value.key : vnode.key
        DDD.KEY_MAP[drag_key] = undefined
        _.off(el, 'dragstart', handleDragStart)
        _.off(el, 'dragenter', handleDragEnter)
        _.off(el, 'dragover', handleDragOver)
        _.off(el, 'drag', handleDrag)
        _.off(el, 'dragleave', handleDragLeave)
        _.off(el, 'dragend', handleDragEnd)
        _.off(el, 'drop', handleDrop)

        _.off(el, 'touchstart', handleDragStart)
        _.off(el, 'touchmove', handleDragEnter)
        _.off(el, 'touchend', handleDragEnd)
    }

    Vue.prototype.$dragging = $dragging
    if (!isPreVue) {
        Vue.directive('dragging', {
            bind: addDragItem,
            update(el, binding, vnode) {
                const DDD = dragData.new(binding.value.group)
                const item = binding.value.item
                const list = binding.value.list

                const drag_key = vnode.key
                const old_item = DDD.KEY_MAP[drag_key]
                if (item && old_item !== item) {
                    DDD.KEY_MAP[drag_key] = item
                }
                if (list && DDD.List !== list) {
                    DDD.List = list
                }
            },
            unbind : removeDragItem
        })
    } else {
        Vue.directive('dragging', {
            update (newValue, oldValue) {
                addDragItem(this.el, {
                    modifiers: this.modifiers,
                    arg: this.arg,
                    value: newValue,
                    oldValue: oldValue
                })
            },
            unbind (newValue, oldValue) {
                removeDragItem(this.el, {
                    modifiers: this.modifiers,
                    arg: this.arg,
                    value: newValue?newValue:{group: this.el.getAttribute('drag_group')},
                    oldValue: oldValue
                })
            }
        })
    }
}
