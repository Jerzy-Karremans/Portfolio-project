function generateText(tag, text, article) {
    elm = document.createElement(tag)
    elm.className = "articleText"
    elm.innerHTML = text
    article.append(elm)
}

function generateArticles(inputCsv) {
    if(!inputCsv){
        return
    }
    const articleWrapper = document.querySelector("#article-wrapper")
    if(articleWrapper.hasChildNodes()){
        while (articleWrapper.firstChild) {
            articleWrapper.removeChild(articleWrapper.lastChild);
        }
    }
    for (let i = 0; i < inputCsv.length; i++) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const [day, month, year] = inputCsv[i][1].split('-')
        const date = new Date(+year, +month - 1, +day)
        if(today <= date){
            let article = document.createElement("article")
            articleWrapper.append(article)
            if(date.getDate() == today.getDate() 
            && date.getMonth() == today.getMonth()
            && today.getFullYear() == date.getFullYear()){
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

function courseNamesLoad(names){
    if(!names){
        return
    }
    console.log(names)
}

const sock = io()
//var sock = io.connect('https://jerzykarremans.com', {path: "/socket.io2"});

sock.emit("connection", "")
let courseChosen = "VWO Wiskunde B - Najaarscursus 2022 (ma/wo/za) (hybride)"
if(courseChosen){
    sock.emit("courseChosen",courseChosen)
}

sock.on("dateLoad", generateArticles) 
sock.on("courseNamesLoad",courseNamesLoad)