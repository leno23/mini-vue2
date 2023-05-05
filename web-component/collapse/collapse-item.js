export default class CollapseItem extends HTMLElement {
    constructor() {
        super()
        let shadow = this.attachShadow({ mode: 'open' })
        let tmpl = document.getElementById('collapse_item_tmpl')
        let cloneTmpl = tmpl.content.cloneNode(true)
        let style = document.createElement('style')
        style.textContent = `
           :host{
                width:100%;
           }
           .title{
                background:#f1f1f1;
                line-height:35px;
                user-select:none;
                height:35px;
            }
            .content{
                font-size:16px;
            }
        `
        shadow.appendChild(style)
        shadow.appendChild(cloneTmpl)
        this.titleEl = shadow.querySelector('.title')

        this.titleEl.addEventListener('click', () => {
            document.querySelector('a-collapse').dispatchEvent(new CustomEvent('changeName', {
                detail: {
                    name: this.getAttribute('name'),
                    isShow: this.isShow
                }
            }))
        })
    }
    static get observedAttributes() {
        return ['active', 'title', 'name']
    }
    attributeChangedCallback(key, oldVal, newVal) {
        console.log(key, newVal);
        switch (key) {
            case 'active':
                this.activeList = JSON.parse(newVal)
                break
            case 'title':
                this.titleEl.innerHTML = newVal
                break
            case 'name':
                this.name = newVal
                break
            default:
                break
        }
        let name = this.name
        if (this.activeList && name) {
            let isShow = this.isShow = this.activeList.includes(name)
            this.shadowRoot.querySelector('.content').style.display = isShow ? 'block' : 'none'
        }
    }
}