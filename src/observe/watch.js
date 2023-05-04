import { popTarget, pushTarget } from './dep'

let id = 0
export class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm
        // this.exprOrFn = exprOrFn  // updateComponent ->render() 从vm上获取最新的值，所以命名为getter
        this.cb = cb
        this.options = options
        this.id = id++
        this.getters = exprOrFn
        this.deps = []
        this.depsId = new Set()

        // 初始化取一次值
        this.get()
    }
    get() {
        // 一个属性在不同个组件中使用，一个组件包含多个属性
        // 一个属性对应多个watcher，同时一个watcher可以对应多个属性
        pushTarget(this)
        this.getters() // get vm.name
        popTarget()
    }
    addDep(dep) {
        let id = dep.id
        // 一个组件中存放两个相同的变量，两个变量只需要存一个watcher，变量相同watcher的id相同
        // 如果读取相同的变量，不进行以来收集
        if (this.depsId.has(id)) return
        this.depsId.add(id)
        this.deps.push(dep)
        dep.addSub(this)
    }
    update(){
        this.get()
    }
}