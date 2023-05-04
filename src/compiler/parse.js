import { parseHTML } from './index';
import { generate } from './generate';

export function compileToFunction(template) {
    let ast = parseHTML(template)
    
    // html -> ast 只能描述语法 语法不存在的属性无法描述，不知道节点属于那个vue实例 -> render函数 -> vnode 增加额外属性 描述的模板，属于哪个实例  ->真实dom
    console.log(ast);
    let code = generate(ast)
    console.log(code);
}