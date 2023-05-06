const CACHE_NAME = 'cache_v' + 3
const CACHE_LIST = [
    '/',
    '/index.html',
    '/manifest.json',
    '/main.js',
    '/icon.png',
    '/index.css',
    '/api/list'
]

// 当断网时  我需要拦截请求，会用缓存的结果

async function fetchAndSave(request) {
    let res = await fetch(request)  // 返回的数据流，本次消费的内容下次就没有了
    // 为了保证不破坏原有的响应结果
    let cloneRes = res.clone()
    let cache = await caches.open(CACHE_NAME)
    await cache.put(request, cloneRes)
    return res
}

// 核心就是拦截请求
self.addEventListener('fetch', (e) => {
    // serviceWorker不支持ajax，但是支持fetch
    // 如果是静态资源  不做拦截
    let url = new URL(e.request.url)
    console.log(url.origin, self.origin);
    if (url.origin != self.origin) {
        return
    }
    // 接口请求后立即进行缓存
    if (e.request.url.includes('/api')) {

        return e.respondWith(
            // 断网了请求报错，从缓存中找到数据返回
            fetchAndSave(e.request).catch(res => {
                return caches.match(e.request)
            })
        )
    }
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