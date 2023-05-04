import { createElement, createTextElement } from './vnode/index'

export function renderMixin(Vue) {
    Vue.prototype._c = function (tag, data, ...children) {
        return createElement(this, tag, data, ...children)
    }
    Vue.prototype._v = function (text) {
        return createTextElement(this, text)
    }
    Vue.prototype._s = function (val) {
        if (typeof val == 'object') {
            return JSON.stringify(val)
        } else {
            return val
        }
    }
    Vue.prototype._render = function () {
        const vm = this
        let render = vm.$options.render
        let vnode = render.call(vm)
        console.log(vnode);
        return vnode
    }
}