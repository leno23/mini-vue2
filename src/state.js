import { observe } from './observe/index'
import { Watcher } from './observe/watch'
import { isFunction } from './utils'

// 状态初始化
export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
    if (opts.watch) {
        initWatch(vm, opts.watch)
    }
}


function proxy(data, source, key) {
    Object.defineProperty(data, key, {
        get() {
            return data[source][key]
        },
        set(newVal) {
            data[source][key] = newVal
        }
    })
}
function initData(vm) {
    let data = vm.$options.data
    data = vm._data = isFunction(data) ? data.call(vm) : data
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    observe(data)
}
export function stateMixin(Vue) {
    Vue.prototype.$watch = function (exprOrFn, cb, options={}) {
        let vm = this
        // 用户watcher 和 渲染watcher 区分
        options.user = true
        new Watcher(vm, exprOrFn, cb, options)
    }
}

function initWatch(vm, watch) {
    for (let key in watch) {
        console.log(key);
        let handler = watch[key]
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}

function createWatcher (vm,key,handler) {
    return vm.$watch(key,handler)
}