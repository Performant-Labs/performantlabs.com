const { ipcRenderer } = require('electron');

ipcRenderer.on("find:link", (event, data) => {
    const link = data.find.replace('link:', '')
    console.log("Find link: " + link);
    const matches = document.querySelectorAll("a[href='"+link+"']")
    console.log(matches)
    for(let i = 0; i < matches.length; i++) {
        matches[i].style.backgroundColor = "#f8ff00"
    }
    ipcRenderer.send("search:response", `${data.target} : Found ${matches.length} matches`)
})

ipcRenderer.on("find:node", (event, data) => {
    const node = data.find.replace('node:', '')
    console.log("Find node: " + node);
    const matches = document.querySelectorAll(".view-content .views-row h3[data-nid='"+node+"']")
    console.log(matches)
    for(let i = 0; i < matches.length; i++) {
        matches[i].style.backgroundColor = "#f8ff00"
    }
    ipcRenderer.send("search:response", `${data.target} : Found ${matches.length} matches`)
})

ipcRenderer.on("find:text", (event, data) => {
    const txt = data.find.replace('text:', '')
    console.log("Find text: " + txt);
    const matches = document.querySelectorAll("a[href='"+data.link+"']")
    console.log(matches)
    for(let i = 0; i < matches.length; i++) {
        matches[i].style.backgroundColor = "#f8ff00"
    }
    ipcRenderer.send("search:response", `${data.target} : Found ${matches.length} matches`)
})
