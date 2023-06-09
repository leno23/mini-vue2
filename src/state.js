import { Dep } from './observe/dep'
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
    if (opts.computed) {
        initComputed(vm, opts.computed)
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
    Vue.prototype.$watch = function (exprOrFn, cb, options = {}) {
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

function createWatcher(vm, key, handler) {
    return vm.$watch(key, handler)
}

function initComputed(vm, computed) {
    // computed和watcher的对应关系
    const watchers =  vm._computedWatchers = {}
    for (let key in computed) {
        let userDef = computed[key]
        let getter = typeof userDef === 'function' ? userDef : userDef.get
        // 每个计算属性本质也是一个watcher
        watchers[key] = new Watcher(vm, getter, () => { }, { lazy: true })
        defineComputed(vm, key, userDef)
    }
}

function createComputedGetter (key) {
    return function computedGetter(){
        let watcher = this._computedWatchers[key]
        // 如果watcher是dirty的，需要重新求值
        if(watcher.dirty){
            watcher.evaluate()
        }
        // 如果当前取值之后，
        if(Dep.target){
            watcher.depend()
        }
        return watcher.value
    }
}
function defineComputed (vm,key,userDef) {
    let sharedProperty = {}
    if(typeof userDef === 'function'){
        sharedProperty.get = createComputedGetter(key)
    }else{
        sharedProperty.get = createComputedGetter(key)
        sharedProperty.set = userDef.set
    }
    Object.defineProperty(vm,key,sharedProperty)
}