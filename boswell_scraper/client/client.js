function clearChildren(element){
    if(element.hasChildNodes()){
        while (element.firstChild) {
            element.removeChild(element.lastChild);
        }
    }
}

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
    clearChildren(articleWrapper)
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
    console.log("hi")
}

function addOption(name,dropdown){
    courseTitleElm = document.createElement("option")
    courseTitleElm.innerHTML = name
    if(name == courseChosen){
        courseTitleElm.selected = "selected"
    }
    dropdown.append(courseTitleElm)
}

function courseNamesLoad(names){
    if(!names){
        return
    }
    dropdown = document.querySelector("#courseDropdown")
    clearChildren(dropdown)
    addOption("Select Course",dropdown)
    names.forEach(name => addOption(name,dropdown))
    
}

function selectedCourseSwapped(){
    const e = document.querySelector("#courseDropdown")
    let text = e.options[e.selectedIndex].text
    sock.emit("courseChosen",text)
    courseChosen = text
    document.cookie = courseChosen
}

const sock = io()
//var sock = io.connect('https://jerzykarremans.com', {path: "/socket.io2"});

sock.emit("connection", "")
let courseChosen;
if(document.cookie){
    courseChosen = document.cookie
    sock.emit("courseChosen",courseChosen)
    courseNamesLoad([courseChosen])
}

sock.on("dateLoad", generateArticles) 
sock.on("courseNamesLoad",courseNamesLoad)
sock.on("refreshDataRequest",() => {
    if(courseChosen){
        sock.emit("courseChosen",courseChosen)
    }
    else{
        sock.emit("getCourses")
    }
})