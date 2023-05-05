const ul = document.querySelector('ul')
const res = await fetch('/api/list')
const list = await res.json()
console.log(list);
let html = ''
for(let {name,url} of list){

    html += `<li><img src='${url}'></li>`
}
ul.innerHTML = html
