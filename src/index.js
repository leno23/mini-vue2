import { initMixin } from './init'

function Vue(options){
    this._init(options)
    
}
// 增加原型上面的方法
initMixin(Vue)
export default Vue