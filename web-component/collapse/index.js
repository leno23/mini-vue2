import Collapse from './collapse.js'
import CollapseItem from './collapse-item.js'

window.customElements.define('a-collapse', Collapse)
window.customElements.define('a-collapse-item', CollapseItem)

let defaultActive = ['1', '2']
document.querySelector('a-collapse')
    .setAttribute('active', JSON.stringify(defaultActive))

document.querySelector('a-collapse').addEventListener('changeName', e => {
    const { isShow, name } = e.detail
    if (isShow) {

        defaultActive.splice(defaultActive.indexOf(name), 1)
    } else {
        defaultActive.push(name)
    }
    document.querySelector('a-collapse').setAttribute('active', JSON.stringify(defaultActive))
})