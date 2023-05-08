import { compileToFunction } from './compiler/parse'
import { callHook, mountCompoment } from './lifecycle'
import { initState } from './state'
import { mergeOptions } from './utils'
import { createEl, patch } from './vnode/patch'

export function initMixin(Vue) {

    Vue.prototype._init = function (options) {
        const vm = this
        // this.constructor 获取构造函数上面的options，通过Vue.mixin混入的
        vm.$options = mergeOptions(this.constructor.options, options)
        callHook(vm,'beforeCreate')
        initState(vm)
        callHook(vm,'created')
        // console.log(vm.$options);
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.compile = compileToFunction
    Vue.createEl = createEl
    Vue.patch = patch
    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        vm.$el = el
        if (!options.render) {
            let template = options.template
            // 用户没有传递el,把el的内容作为模板
            if (!template && el) {
                template = el.outerHTML
            }
            let render = compileToFunction(template)
            options.render = render
        }

        mountCompoment(vm, el)
    }

}
