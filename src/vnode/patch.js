
export function patch(oldVnode, vnode) {
    if (!oldVnode) {
        return createEl(vnode)
    }
    if (oldVnode.nodeType == 1) {
        const parentEl = oldVnode.parentNode
        let el = createEl(vnode)
        parentEl.insertBefore(el, oldVnode.nextSibling)
        parentEl.removeChild(oldVnode)
        return el
    }
}

function createComponent(vnode) {
    let i = vnode.data
    if ((i = i.hook) && (i = i.init)) {
        i(vnode)
    }
    // 有这个属性说明是组件new完毕了
    if(vnode.componentInstance){
        return true
    }
}
// 根据vnode生成真实节点
function createEl(vnode) {
    let { tag, data, children, text, vm } = vnode
    if (typeof tag == 'string') {
        if (createComponent(vnode)) {
            // 返回组件对应的真实节点
            return vnode.componentInstance.$el
        }
        vnode.el = document.createElement(tag)
        children.forEach(child => {
            vnode.el.appendChild(createEl(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}