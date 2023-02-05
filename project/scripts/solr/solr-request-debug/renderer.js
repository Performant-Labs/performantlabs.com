const {ipcRenderer, shell} = require('electron');
const fs = require('fs')
const path = require('path')
const os = require('os')
const hashes = require('jshashes');
const {debug} = require('console');

let queries = new Map()

const splitLines = str => str.split(/\r?\n/)
const nl2br = str => str.replace(/(?:\r\n|\r|\n)/g, '<br>')

// function nl2br(str){
//     return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
// }

const replaceText = (selector, text) => {
  const element = document.getElementById(selector)
  if (element) {
    element.innerText = text
  }
}

window.addEventListener('DOMContentLoaded', () => {
  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

document.querySelector('select').addEventListener('change', (event) => {
  // console.log(event)
  const v = document.getElementById("select").value;
  // console.log(v)
  let qr = queries.get(v)
  let s = ''; //'<span>q: ' + qr.query + '</span>'
  for (const param of qr.params) {
    //       if (param[0] == 'fq') {
    s += '<span>' + param[0] + ': ' + param[1] + '</span>'
    //       }
  }
  document.getElementById('query').innerHTML = s
  document.getElementById('request').value = qr.request
})

const toggle_pre = document.querySelector('#collapse-all')
toggle_pre.addEventListener('click', (event) => {
  let state = toggle_pre.dataset.state
  let visibility
  let text
  let content

  if (state == 'open') {
    visibility = 'none'
    state = 'close'
    text = "Expand all"
    content = "+"
  }
  else {
    visibility = 'block'
    state = 'open'
    text = 'Collapse all'
    content = "-"
  }
  toggle_pre.innerHTML = text
  toggle_pre.dataset.state = state

  for (let el of document.querySelectorAll('#response pre')) {
    el.style.display = visibility;
  }
  for (let el of document.querySelectorAll('span.pm')) {
    el.textContent = content
  }
})

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();   // stop the form from submitting
  let data = {
    host: document.getElementById("host").value,
    handler: "/select?",
    request: document.getElementById("request").value,
  }
  ipcRenderer.send('form:submit', data)
})

ipcRenderer.on("search:data", (event, data) => {
  console.log(data)

  let MD5 = new hashes.MD5()

  document.getElementById("host").value = data.solr_host
  document.getElementById("request").value = data.request

  const entries = fs.readFileSync(data.solr_request_log, 'utf-8')
  let lines = splitLines(entries)
  select = document.getElementById('select');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length == 0) {
      break
    }
    let req = JSON.parse(lines[i])
    let params = new URLSearchParams(req.request);
    params.append('debugQuery', 'yes')
    for (const param of params) {
      if (param[0] == 'q') {
        // console.log(param)
        let hash = MD5.hex(param[1])
        if (!queries.has(hash)) {
          queries.set(hash, {
            'query': param[1],
            'params': params,
            'request': params.toString()
          })
          let opt = document.createElement('option')
          opt.value = hash
          opt.innerHTML = param[1]
          select.appendChild(opt)
        }
        break;
      }
    }
  }
})

ipcRenderer.on("search:solrResponse", (event, data) => {
  console.log(data)
  let s = ""

  let stats = "<span>Num Found: " + data.response.numFound + "</span>"
  stats += "<span>Max Score: " + data.response.maxScore + "</span>"
  stats += "<span>Displaying: " + data.response.docs.length + "</span>"
  document.getElementById("stats").innerHTML = stats

  let explain = data.debug.explain
  let idx = 0

  for (const [key, value] of Object.entries(explain)) {
    s += "<div class='l'>"
    s += "<div class='f'>"
    s += "<span class='pm'>-</span>"
    for (const [k, v] of Object.entries(data.response.docs[idx])) {
      if (k === "ss_search_api_id") {
        s += "<span class='luke-id' data-id='" + v + "'>" + k + ": " + v + "</span>"
      } else {
        s += "<span>" + k + ': ' + v + '</span>'
      }
    }
    s += "</div>"
    s += "<pre>" + value + "</pre>"
    s += "</div>"

    idx++
  }
  document.getElementById("explain").innerHTML = s

  // Connect handlers to newly created elements
  Array.from(document.getElementsByClassName("pm")).forEach(function (el) {
    el.addEventListener('click', (event) => {
      console.log(el)
      let visibility, content
      if (el.textContent === "-") {
        visibility = "none"
        content = "+"
      }
      else {
        visibility = "block"
        content = "-"
      }
      el.parentNode.nextSibling.style.display = visibility
      el.textContent = content
    })
  })

  Array.from(document.getElementsByClassName("luke-id")).forEach(function (el) {
    el.addEventListener('click', (event) => {
      event.preventDefault();   // stop the form from submitting
      let data = {
        host: document.getElementById("host").value,
        handler: "/admin/luke",
        request: "?id=m4fqt8-opensolr_search_index-" + el.dataset.id,
      }
      console.log(el)
      ipcRenderer.send('luke:id', data)
    })
  })

})
