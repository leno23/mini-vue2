import { patch } from './vnode/patch';
import { Watcher } from './observe/watch';
import { nextTick } from './utils';

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        const preVnode = vm._vnode
        if(!preVnode){
            vm.$el = patch(vm.$el, vnode)
            vm._vnode = vnode
        }else{
            vm.$el = patch(preVnode, vnode)

        }
    }
    Vue.prototype.$nextTick = nextTick
}

export function mountCompoment(vm, el) {
    let updateComponent = () => {
        console.log(`%c组件${vm.$options.name}--update`, 'color:#f00');
        vm._update(vm._render())
    }
    callHook(vm,'beforeMount')
    // 每个组件渲染时对应一个watcher
    new Watcher(vm, updateComponent, () => {
        console.log('组件更新完成');
    }, true)
    if(!vm.isMounted){
        vm.isMounted = true
        callHook(vm,'mounted')
    }
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let cb of handlers) {
            cb.call(vm)
        }
    }
}