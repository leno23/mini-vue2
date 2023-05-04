import { compileToFunction } from './compiler/index'
import { initState } from './state'

export function initMixin(Vue) {

    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options
        initState(vm)

        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                let template = el.outerHTML
                console.log(template);
                let render = compileToFunction(template)
                options.render = render
            }
        }
    }

}
