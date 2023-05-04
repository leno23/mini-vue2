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
    notify(){
        this.subs.forEach(watcher => watcher.update())
    }
}
Dep.target = null
export function pushTarget(watcher) {
    Dep.target = watcher
}
export function popTarget() {
    Dep.target = null
}