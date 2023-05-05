export default class Collapse extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const tmpl = document.getElementById('collapse_tmpl')
        let cloneTemplate = tmpl.content.cloneNode(true)
        let style = document.createElement('style')
        // :host shadow的根元素
        style.textContent = `
            :host{
                display:flex;
                border:1px solid #ebebeb;
                width:100%;
            }
            .a-collapse{
                width:100%;
            }
        `
        shadow.appendChild(style)
        shadow.appendChild(cloneTemplate)


        let slot = shadow.querySelector('slot')
        slot.addEventListener('slotchange', (e) => {
            console.log(e);
            this.slotList = e.target.assignedElements()
            console.log(this.slotList);
            this.render()
        })
    }
    static get observedAttributes() {
        return ['active','title','name']
    }
    // connectedCallback() {

    // }
    // disconnectedCallback() {

    // }
    // adoptedCallback() {
    //     console.log('将组件移动到iframe中');
    // }
    attributeChangedCallback(key, oldVal, newVal) {
       
        if (key === 'active') {
            this.activeList = JSON.parse(newVal)
            this.render()
        }
    }
    render() {
        if (this.slotList && this.activeList) {
            [...this.slotList].forEach(child => {
                child.setAttribute('active', JSON.stringify(this.activeList))
            })
        }
    }
}