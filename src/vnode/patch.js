export function patch(oldVnode, vnode) {
    if (oldVnode.nodeType == 1) {
        const parentEl = oldVnode.parentNode
        let el = createEl(vnode)
        parentEl.insertBefore(el, oldVnode.nextSibling)
        parentEl.removeChild(oldVnode)
        return el
    }
}

function createEl(vnode) {
    let { tag, data, children, text, vm } = vnode
    if (typeof tag == 'string') {
        vnode.el = document.createElement(tag)
        children.forEach(child => {
            vnode.el.appendChild(createEl(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}