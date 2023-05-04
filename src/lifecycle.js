import { patch } from './vnode/patch';
import { Watcher } from './observe/watch';
import { nextTick } from './utils';

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        vm.$el = patch(vm.$el, vnode)
    }
    Vue.prototype.$nextTick = nextTick
}

export function mountCompoment(vm, el) {
    let updateComponent = () => {
        console.log('update');
        vm._update(vm._render())
    }
    // 每个组件渲染时对应一个watcher
    new Watcher(vm, updateComponent, () => {
        console.log('组件更新完成');
    }, true)
}