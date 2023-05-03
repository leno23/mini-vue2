import { observe } from './observe/index'
import { isFunction } from './utils'

// 状态初始化
export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
}

function initData(vm) {
    let data = vm.$options.data
    data = vm._data = isFunction(data) ? data.call(vm) : data
    observe(data)
}