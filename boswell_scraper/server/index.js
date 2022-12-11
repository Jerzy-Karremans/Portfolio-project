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
function refreshDatesForUrl(url,courseChosen,sock = null){
    const python_process = spawner(pythonVer, ['./webscraper.py', url])
    python_process.stdout.on('data', (data) => {
        console.log("site Load Completed")
        datesJson = JSON.parse(data)
        if(sock){
            sock.emit("dateLoad",datesJson[courseChosen])
        }
    })
}  

refreshDatesForUrl(url)
io.on("connection", (sock) => 
{
    console.log("client connected")
    sock.on("courseChosen",(courseNameChosen) =>{
        console.log(`client chose ${courseNameChosen}`)
        if(datesJson){
            sock.emit("dateLoad",datesJson[courseNameChosen])
            sock.emit("courseNamesLoad",Object.keys(datesJson))
        }
        refreshDatesForUrl(url,sock)
    })
})