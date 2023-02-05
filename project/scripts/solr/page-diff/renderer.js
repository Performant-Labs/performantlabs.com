const { ipcRenderer } = require('electron');

const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
}

window.addEventListener('DOMContentLoaded', () => {
    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();   // stop the form from submitting
    let data = {
        src:document.getElementById("src").value,
        src_id:document.getElementById("src").attributes["name"].value,
        dest:document.getElementById("dest").value,
        dest_id:document.getElementById("dest").attributes["name"].value,
        region:document.getElementById("region").value,
        keywords:document.getElementById("keywords").value,
        link:document.getElementById("link").value
    }
    ipcRenderer.send('form:submit', data)

    document.getElementById("response").innerHTML = ""
});

ipcRenderer.on("search:data", (event, data) => {
    console.log(data)
    document.getElementById("src").value = data.src.url
    document.getElementById("src").attributes["name"].value = data.src.id;
    document.getElementById("dest").value = data.dest.url
    document.getElementById("dest").attributes["name"].value = data.dest.id
    let s = ""
    for (let i = 0; i < data.tests.length; i++) {
         s = s + '<li>' + '<a class="test-link" href="#" data-ga="' + data.tests[i] + '">' + data.tests[i][1] + '</a></li>'
    }
    document.getElementById('tests').innerHTML = s

    Array.from(document.getElementsByClassName("test-link")).forEach(function(el) {
        el.addEventListener('click', (event) => {
          let e = document.elementFromPoint(event.clientX, event.clientY)
          let ga = e.dataset.ga
          let parts = ga.split(",")
          document.getElementById("region").value = parts[0]
          document.getElementById("keywords").value = parts[1]
          document.getElementById("link").value = parts[2]
          document.getElementById("submit").click();
        })
      })
})

ipcRenderer.on("search:stats", (event, data) => {
    document.getElementById("response").innerHTML += '<pre>' + data + '</pre>'
})