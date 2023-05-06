const CACHE_NAME = 'cache_v' + 3
const CACHE_LIST = [
    '/',
    '/index.html',
    '/main.js',
    '/index.css',
    '/api/list'
]

// 当断网时  我需要拦截请求，会用缓存的结果
// 核心就是拦截请求
self.addEventListener('fetch', (e) => {
    // serviceWorker不支持ajax，但是支持fetch
    // 如果是静态资源  不做拦截
    let url = new URL(e.request.url)
    console.log(url.origin, self.origin);
    if (url.origin != self.origin) {
        return
    }
    // 对请求路径进行拦截
    e.respondWith(
        // 断网了请求报错，从缓存中找到数据返回
        fetch(e.request).catch(res => {
            return caches.match(e.request)
        })
    )
})

// 缓存完数据之后才跳过等待
async function preCache() {
    let cache = await caches.open(CACHE_NAME)
    cache.addAll(CACHE_LIST)
    await skipWaiting()
}

// serviceWorker安装时 需要跳过等待
self.addEventListener('install', (e) => {

    // 预先将缓存列表的数据缓存起来
    // e.waitUntil表示等待promise执行完成
    e.waitUntil(preCache())
})
async function clearCache() {
    let keys = await caches.keys()
    console.log(keys);
    return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
            return caches.delete(key)
        }
    }))
}

// serviceWorker 不是立即生效，需要在下一次访问的时候才生效
// 先清空之前缓存的数据，再激活serviceWorker
self.addEventListener('activate', (e) => {
    e.waitUntil(Promise.all([clearCache(), clints.claim()])) //激活后立刻让serviceWorker拥有控制权
})