import { isObject } from '../utils';

class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}

function defineReactive(data, key, value) {
    // 对value进行递归处理
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
    return new Observer(data)
}