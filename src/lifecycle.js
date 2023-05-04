import { patch } from './vnode/patch';

export function lifecycleMixin (Vue) {
    Vue.prototype._update =function(vnode){
        console.log('update');
    }
}

export function mountCompoment(vm, el) {
    let updateComponent = () => {
        patch(vm.$el,vm._render())
    }
    updateComponent()
}