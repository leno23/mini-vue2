import { popTarget, pushTarget } from './dep'
import { queueWatcher } from './scheduler'

let id = 0
export class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm
        // this.exprOrFn = exprOrFn  // updateComponent ->render() 从vm上获取最新的值，所以命名为getter
        this.cb = cb
        this.options = options
        this.id = id++
        this.getters = exprOrFn
        this.exprOrFn = exprOrFn
        this.user = !!options.user
        this.lazy = !!options.lazy
        this.deps = []
        this.value = undefined
        this.depsId = new Set()

        if (typeof exprOrFn === 'string') {
            this.getters = function () {
                let path = exprOrFn.split('.')
                let obj = vm
                // watch('obj.name',() => {})
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj
            }
        } else {

            this.getters = exprOrFn
        }

        // 初始化取一次值
        this.value = this.lazy ? undefined : this.get()
    }
    // 组件状态变化时触发
    get() {
        // 一个属性在不同个组件中使用，一个组件包含多个属性
        // 一个属性对应多个watcher，同时一个watcher可以对应多个属性
        // 状态变化是，标记当前状态对应的watcher
        pushTarget(this)
        // get vm.name

        // 读取值，触发getter，进行依赖收集
        const value = this.getters.call(this.vm)
        popTarget()
        return value
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
    // 不同类型的watch走不同的类型
    run() {
        // 记录老值和新值
        let newVal = this.get()
        let oldVal = this.value
        // 更新老值
        this.value = newVal
        // 如果是用户watcher，执行回调,传入新值和老值
        if (this.user) {
            this.cb.call(this.vm, oldVal, newVal)
        }
    }
    update() {
        queueWatcher(this)
    }
}