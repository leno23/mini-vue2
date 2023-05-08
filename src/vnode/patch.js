
export function patch(oldVnode, vnode) {
    debugger
    if (!oldVnode) {
        return createEl(vnode)
    }
    if (oldVnode.nodeType == 1) {
        const parentEl = oldVnode.parentNode
        let el = createEl(vnode)
        parentEl.insertBefore(el, oldVnode.nextSibling)
        parentEl.removeChild(oldVnode)
        return el
    } else {
        if (oldVnode.tag != vnode.tag) {
            return oldVnode.el.parentNode.replaceChild(createEl(vnode), oldVnode.el)
        }
        let el = vnode.el = oldVnode.el
        // 文本更新
        if (vnode.tag == undefined) {
            if (oldVnode.text != vnode.text) {
                el.textContent = vnode.text
            }
        }
        patchProps(vnode, oldVnode.data)

        let oldChilren = oldVnode.children || []
        let newChildren = vnode.children || []
        // 都有
        if (oldChilren.length && newChildren.length) {
            pathChildren(el, oldChilren, newChildren)
        } else if (newChildren.length) {
            // 新的有老的没有 创建
            for (let child of newChildren) {
                el.appendChild(createEl(child))
            }

        } else if (oldChilren.length) {
            el.innerHTML = ''
        }
    }
}

function pathChildren(el, oldChilren, newChildren) {
    let oldStartIndex = 0
    let oldStartVnode = oldChilren[0]
    let oldEndIndex = oldChilren.length - 1
    let oldEndVnode = oldChilren[oldEndIndex]
    let newStartIndex = 0
    let newStartVnode = newChildren[0]
    let newEndIndex = newChildren.length - 1
    let newEndVnode = newChildren[newEndIndex]
    function makeIndexByKey(children) {
        let map = {}
        children.forEach((item, index) => {
            map[item.key] = index
        })
        return map
    }
    function isSameVnode(n1, n2) {
        return n1.type == n2.type && n1.key == n2.key
    }
    let keysMap = makeIndexByKey(oldChilren)
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        // 头头比较 尾尾比较 头尾比较  尾头比较
        // 优化了 向后添加 向前添加 尾部移动到头部  头部移动到尾部 反转
        if (!oldStartVnode) {
            oldStartVnode = oldChilren[++oldStartIndex]
        }
        if (!oldEndVnode) {
            oldEndIndex = oldChilren[--oldEndIndex]
        }
        if (isSameVnode(oldStartVnode, newStartVnode)) {
            // 尾部有新增，头部一一对比
            patch(oldStartVnode, newStartVnode)
            oldStartVnode = oldChilren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            // 头部有新增，尾部一一对比
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChilren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            // 头尾对比 reverse
            patch(oldStartVnode, newEndVnode)
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
            oldStartVnode = oldChilren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode)
            el.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChilren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else {
            // 乱序对比
            // 1、需要根据key和对应的索引内容将老的内容生成映射表
            // 找到新节点在老children中的下标
            let moveIndex = keysMap[newStartVnode.key]
            if (moveIndex == undefined) {
                // 如果不能复用直接创建新的插入到老的节点开头处
                el.insertBefore(createEl(newStartVnode), oldStartVnode.el)
            } else {
                let moveNode = oldChilren[moveIndex]
                // 标记此节点已经被移动走了
                oldChilren[moveIndex] = null
                el.insertBefore(moveNode.el, oldStartVnode.el)
                // 比较两个节点的属性
                patch(moveNode, newStartVnode)
            }
            newStartVnode = newChildren[++newStartIndex]
        }

    }
    // 新的比老的多
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            // 看一下新children的尾部有没有下一个元素，如果有就是插入到它的前面，如果没有就是插入到最后 
            let anchor = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null
            el.insertBefore(createEl(newChildren[i]), anchor)
        }
    }
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            if (oldChilren[i] != null) {
                el.removeChild(oldChilren[i].el)
            }
        }
    }

}
// 比对属性
function patchProps(vnode, oldProps = {}) {
    let newProps = vnode.data || {}
    let el = vnode.el

    // 比对style
    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }
    // 老的有，新的没有，删除
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }
    for (let key in newProps) {
        if (key == 'style') {

            for (let styleName in newProps.style) {

                el.style[styleName] = newProps.style[styleName]
            }
        } else {

            el.setAttribute(key, newProps[key])
        }
    }
}

function createComponent(vnode) {
    let i = vnode.data
    if ((i = i.hook) && (i = i.init)) {
        i(vnode)
    }
    // 有这个属性说明是组件new完毕了
    if (vnode.componentInstance) {
        return true
    }
}
// 根据vnode生成真实节点
export function createEl(vnode) {
    let { tag, data, children, text, vm } = vnode
    if (typeof tag == 'string') {
        if (createComponent(vnode)) {
            // 返回组件对应的真实节点
            return vnode.componentInstance.$el
        }
        vnode.el = document.createElement(tag)
        patchProps(vnode)
        children.forEach(child => {
            vnode.el.appendChild(createEl(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}