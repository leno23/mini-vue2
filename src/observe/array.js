let oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(oldArrayPrototype)
let methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort']

methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        oldArrayPrototype[method].call(this, ...args)
        let inserted;
        let ob = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
            default:
                break;
        }
        if (inserted) ob.observeArray(inserted)
        ob.dep.notify()
    }
})