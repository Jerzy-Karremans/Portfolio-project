const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const spawner = require("child_process").spawn
const app = express()
app.use(express.static(__dirname + "/../client"))
const server = http.createServer(app)
const port = 3000
server.on("error", (err) => console.error(err))
server.listen(port, () => console.log(`serving ${port}`))
const io = socketIO(server)

const pythonVer = "python"
const url = "https://www.boswell-beta.nl/vwo/wiskunde-b"

let datesJson
function refreshDatesForUrl(url){
    const python_process = spawner(pythonVer, ['./webscraper.py', url])
    python_process.stdout.on('data', (data) => {
        console.log(`\n\n\n${getTime()}       SITE LOADED!!!!\n\n\n`)
        datesJson = JSON.parse(data)
        io.emit("refreshDataRequest")
    })
}  

var lastTime = 0;
function getInfo(sock) {
    if (!(Math.round(new Date() - lastTime)/60000 < 10) ) {
        refreshDatesForUrl(url,sock)
        lastTime =  new Date();
    }
}

function getTime(){
    return new Date().toJSON().slice(11,19)
}

io.on("connection", (sock) => 
{
    console.log(`${getTime()}       client connected`)
    if(datesJson){
        sock.emit("courseNamesLoad",Object.keys(datesJson))
    }

    getInfo(sock)
    sock.on("courseChosen",(courseNameChosen) =>{
        console.log(`${getTime()}       client chose <${courseNameChosen}>`)
        if(datesJson){
            sock.emit("dateLoad",datesJson[courseNameChosen])
        }
    })

    sock.on("getCourses",() =>{
        sock.emit("courseNamesLoad",Object.keys(datesJson))
    })
})