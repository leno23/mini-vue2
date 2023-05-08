import { isObject, isReservedTag } from '../utils'

// h函数  渲染一个虚拟节点  保留标签直接渲染，非保留标签渲染组件，需要额外操作
export function createElement(vm, tag, data = {}, ...children) {
    if (isReservedTag(tag)) {

        return vnode(vm, tag, data, data.key, children, undefined)
    } else {
        const Ctor = vm.$options.components[tag]
        return createComponent(vm, tag, data, data.key, children, Ctor)
    }
}

export function createComponent(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
        Ctor = vm.$options._base.extends(Ctor)
    }
    // 渲染组件时，需要调用
    data.hook = {
        init(vnode) {
            // 创建组件实例，并且挂载在组件vnode上面，
            // 便于在patch自定义组件时通过createEl创建真实节点时从vnode上面获取vnode真实节点
            // 会用此选项与组件的选项进行合并
            let vm = vnode.componentInstance = new Ctor({ _isComponent: true })
            // 自定义组件没有el，需要手动挂载
            vm.$mount()
        }
    }
    return vnode(vm, `vue-component-${tag}`, data, key, undefined, undefined, { Ctor, children })
}

export function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
    return {
        vm, tag, data, key, children, text, componentOptions
    }
}