export function isFunction(val) {
    return typeof val === 'function'
}

export function isObject(val) {
    return typeof val === 'object' && val !== null
}

let waiting = false
let callbacks = []
function flushCallbacks() {
    callbacks.forEach(cb => cb())
    waiting = false
}
let timerFn
// 兼容性   优雅降级
if (Promise) {
    timerFn = () => {
        Promise.resolve().then(flushCallbacks)
    }
} else if (MutationObserver) {
    let text = document.createTextNode(0)
    let observe = new MutationObserver(flushCallbacks)
    observe.observe(text, { characterData: true })
    timerFn = () => {
        text.textContent = (text.textContent + 1) % 2
    }
    // setImmediate  只有IE才认
} else if (setImmediate) {
    timerFn = () => {
        setImmediate(flushCallbacks)
    }
} else {
    // setTimeout在IOS有bug，有时会不执行
    timerFn = () => {
        setTimeout(flushCallbacks)
    }
}

// 组件更新 和用户手动调$nextTick 都会掉nextTick，按照调用循序依次执行
// 多次调用nextTick防抖处理 
export function nextTick(cb) {
    callbacks.push(cb)
    // 多次调用  防抖处理
    if (!waiting) {
        waiting = true
        console.log('%c【队列中需要处理的callbacks】', 'color:orange', callbacks)
        timerFn()
    }
}
let lifecycleHooks = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]
const strats = {}

function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            // {beforeCreate(){}} {beforeCreate(){}} 
            //  -> {beforeCreate:[function(){}, function(){}]}
            return parentVal.concat(childVal)
        } else {
            // {} {beforeCreate(){}} -> {beforeCreate:[function(){}]}
            return [childVal]
        }
    } else {
        return parentVal
    }
}
// 生命周期选项设置对应的处理策略
lifecycleHooks.forEach(hook => {
    strats[hook] = mergeHook
})
function isObject(val) {
    return typeof val === 'object' && val !== null
}
function mergeOptions(parent, child) {
    const options = {}
    // 处理parent原有的选项
    for (let key in parent) {
        mergeField(key)
    }
    // 处理child中可能多出来的选项
    for (let key in child) {
        if (parent.hasOwnProperty(key)) {
            continue
        }
        mergeField(key)
    }
    function mergeField(key) {
        let parentVal = parent[key]
        let childVal = child[key]
        // 策略模式，如果有对应的策略，调用对应的策略
        if (strats[key]) {
            options[key] = strats[key](parentVal, childVal)
        } else {

            if (isObject(parent[key]) && isObject(child[key])) {
                options[key] = { ...parentVal, ...childVal }
            } else {
                options[key] = child[key]
            }
        }
    }
    return options
}
console.log(mergeOptions(
    { a: 1, data: { a: 1 } },
    {
        data: { b: 2 }, a: 100, beforeCreate() {

        },
    }
));