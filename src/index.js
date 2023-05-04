import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'

function Vue(options){
    this._init(options)
    
}
// 增加原型上面的方法
initMixin(Vue)
renderMixin(Vue)  // _update
lifecycleMixin(Vue)  //_update
export default Vue