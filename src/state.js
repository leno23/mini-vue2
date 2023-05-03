import { observe } from './observe/index'
import { isFunction } from './utils'

// 状态初始化
export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
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