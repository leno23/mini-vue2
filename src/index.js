import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
import { stateMixin } from './state'

function Vue(options){
    this._init(options)
    
}
// 增加原型上面的方法
initMixin(Vue)
renderMixin(Vue)  // _update
lifecycleMixin(Vue)  //_
stateMixin(Vue)
export default Vue