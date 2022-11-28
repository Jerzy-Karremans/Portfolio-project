function generateText(tag, text, article) {
    elm = document.createElement(tag)
    elm.className = "articleText"
    elm.innerHTML = text
    article.append(elm)
}

function generateArticles(inputCsv) {
    const articleWrapper = document.querySelector("#article-wrapper")
    if(articleWrapper.hasChildNodes()){
        while (articleWrapper.firstChild) {
            articleWrapper.removeChild(articleWrapper.lastChild);
        }
    }
    for (let i = 0; i < inputCsv.length; i++) {
        const today = new Date()
        const [day, month, year] = inputCsv[i][1].split('-')
        const date = new Date(+year, +month - 1, +day)
        if(today <= date){
            let article = document.createElement("article")
            articleWrapper.append(article)
            if(date == today){
                article.style.backgroundColor = "#5E81FF"
                generateText("h4", "Vandaag", article)
            }
            else{
                generateText("h4", inputCsv[i][0], article)
            }
            generateText("h5", inputCsv[i][2], article)
            generateText("h6", inputCsv[i][1], article)
            generateText("h6", inputCsv[i][3].replace(/[{()}]/g, ''), article)
        }
    }
    console.log("siteLoad")
}
//const sock = io()
var sock = io.connect('https://jerzykarremans.com', {path: "/socket.io2"});

sock.emit("connection", "")
sock.on("siteLoad", generateArticles) 