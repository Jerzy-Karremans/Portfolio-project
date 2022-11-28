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

function ReadCsv(inputCSV){
    lines = inputCSV.split("\n").slice(1,-2)
    for(let i = 0; i < lines.length; i++){
        line = lines[i].slice(0,-1).split(",")
        lines[i] = line
    }   
    return lines
}

const pythonVer = "python3"
const url = "https://www.boswell-beta.nl/vwo/wiskunde-b"
const courseName = "Basis B + VWO Wiskunde B - Voorjaar 2023 (di/do/za)"
let datesCsv;
const python_process = spawner(pythonVer, ['./webscraper.py',"fetch", url, courseName])
python_process.stdout.on('data', (data) => {
    console.log("loaded site")
    datesCsv = ReadCsv(data.toString())
})

io.on("connection", (sock) => 
{
    sock.emit("siteLoad",datesCsv)
    console.log("client connected")
    const python_process = spawner(pythonVer, ['./webscraper.py',"fetch", url, courseName])
    python_process.stdout.on('data', (data) => {
        console.log("loaded site")
        datesCsv = ReadCsv(data.toString())
        sock.emit("siteLoad", datesCsv)
    })
})