import { isObject } from '../utils';
import { arrayMethods } from './array';

class Observer {
    constructor(data) {
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false // 属性不可枚举
        })
        // data.__ob__ = this 
        // 每个响应式对应都有__ob__属性,导致observe死循环
        if (Array.isArray(data)) {
            data.__proto__ = arrayMethods
            this.observeArray(data)
        } else {
            this.walk(data)
        }
    }
    observeArray(data) {
        for (let val of data) {
            observe(val)
        }
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}

function defineReactive(data, key, value) {
    // 对value进行递归处理
    if (key === '__ob__') return
    observe(value)
    Object.defineProperty(data, key, {
        get() {
            return value
        },
        set(newVal) {
            // 赋的新值是对象
            observe(newVal)
            value = newVal
        }
    })
}
export function observe(data) {
    if (!isObject(data)) return;
    if (data.__ob__) return
    return new Observer(data)
}