// 每个属性分配一个dep，dep中存放对应的watchers，watcher中也要存放dep
let id = 0
export class Dep {
    constructor() {
        this.id = id++
        this.subs = []
    }
    // 收集依赖
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}

https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e5e9befda7048869f50a8733a34ed03~tplv-k3u1fbpfcp-watermark.image
Dep.target = null
// 使用栈结构 render watcher和computed watcher的层级结构
let stack = []
export function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(watcher)
}
export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}