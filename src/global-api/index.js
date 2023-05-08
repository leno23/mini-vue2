import { mergeOptions } from '../utils'

export function initGlobalApi(Vue) {
    Vue.options = {}
    Vue.mixin = function (options) {
        this.options = mergeOptions(this.options, options)
        return this
    }
    Vue.options._base = Vue
    Vue.options.components = {}
    Vue.component = function (id, definition) {
        // 保证组件 的隔离，每个组件会产生一个新类，去继承父类
        definition = this.options._base.extends(definition)
        // 将组件配置记录在Vue.options.components上面
        this.options.components[id] = definition
    }
    Vue.extends = function (opts) {
        const Super = this
        const Sub = function VueComponent(options) {
            this._init(options)
        }
        // 原型继承
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        // 合并Vue.options和opts
        Sub.options = mergeOptions(Super.options, opts)
        return Sub
    }
}
