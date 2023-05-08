const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  // 标签名 abc  abc-tag
const qnameCapture = `((?:${ncname}\\:)?${ncname})`  // <tag:sub></tag:sub>  或者 <abc></abc>
// <div>
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

// a=b  a="b" a='b'
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<div>`]+)))?/;
//  />  标签的结束
const startTagClose = /^\s*(\/?)>/;


function createAstElement(tagName, attrs) {
    return {
        type: 1,
        tag: tagName,
        children: [],
        parent: null,
        attrs
    }
}
let root = null
const stack = []
function start(tagName, attrs) {
    let parent = stack[stack.length - 1]
    let element = createAstElement(tagName, attrs)
    if (!root) {
        root = element
    }
    element.parent = parent
    if (parent) {
        parent.children.push(element)
    }
    stack.push(element)
}
function end(tagName) {
    let last = stack.pop()
    if (last.tag !== tagName) {
        throw new Error('标签有误')
    }
    last.tag = tagName
}
function chars(text) {
    text = text.replace(/\s/g, '')
    let parent = stack[stack.length - 1]
    if (text) {

        parent.children.push({
            type: 3,
            text
        })
    }
}

export function parseHTML(html) {
    root = null
    stack.length = 0
    function advance(len) {
        html = html.slice(len)
    }
    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            let end;
            let attr;
            // 到结尾了，说明没有属性需要处理
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // console.log(attr);
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
                advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length)
            }
            return match
        }
        return false
    }
    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd == 0) {
            const startTagMatch = parseStartTag(html)
            if (startTagMatch) {
                const { tagName, attrs } = startTagMatch
                start(tagName, attrs)
                continue
            }
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
                continue
            }
        }
        let text;
        if (textEnd > 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            chars(text)
            advance(text.length)
        }

    }
    return root
}
