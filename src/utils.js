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
    timerFn = setTimeout(flushCallbacks)
}

// 组件更新 和用户手动调$nextTick 都会掉nextTick，按照调用循序依次执行
// 多次调用nextTick防抖处理 
export function nextTick(cb) {
    callbacks.push(cb)
    // 多次调用  防抖处理
    if (!waiting) {
        waiting = true
        timerFn()
    }
}   