import { isObject } from '../utils';
import { arrayMethods } from './array';
import { Dep } from './dep';

class Observer {
    constructor(data) {
        this.dep = new Dep()
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

//  对数组中的数组或者对象进行依赖收集
function dependArray (value) {
    for(let i = 0; i < value.length; i++){
        let current = value[i]
        current.__ob__ && current.__ob__.dep.depend()
        if(Array.isArray(current)){
            dependArray(current)
        }
    }
}

// 数组的监听针对整个数组  对象的监听对每个属性添加getter setter,都有一个dep,dep中存放watcher
function defineReactive(data, key, value) {
    // 对value进行递归处理
    if (key === '__ob__') return
    let dep = new Dep()
    let childOb = observe(value)
    Object.defineProperty(data, key, {
        get() {
            if(Dep.target){
                dep.depend()
                // 如果value是数组或者对象，也要让数组和对象收集watcher
                if(childOb){
                    // 数组或者对象也记录watcher
                    childOb.dep.depend()
                    if(Array.isArray(value)){
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newVal) {
            // NaN===NaN false
            if(!Object.is(newVal,value)){
                // 赋的新值是对象
                observe(newVal)
                value = newVal
                dep.notify()
            }
        }
    })
}
export function observe(data) {
    if (!isObject(data)) return;
    if (data.__ob__) return data.__ob__
    return new Observer(data)
}