const http = require("http")
const express = require("express")
const socketio = require("socket.io") 
const FourInARowGame = require("./fourinarow-logic")
const Database = require("./database")
const app = express()
const clientPath = __dirname + "/../client"
app.use(express.static(clientPath))
const server = http.createServer(app)

server.on("error", (err) => {
    console.error("Server error:" + err)
})

const port = 8082
server.listen(port, () => {
    console.log("connect 4 started on " + port)
})

const io = socketio(server)
io.on("connection", (sock) => {
    sock.on("username-entered", (username) => enterQue(sock,username))
})

let waitingPlayer = null
let waitingPlayerUsername = null;
var games = []
function enterQue (sock,username) {
    console.log(username)
    games.forEach((game) => {
        if (game._gameEnded){
            games.pop(game)
            game = null
        }
    })
    
    if (waitingPlayer){
        waitingPlayer.emit("generate-scoreboard",waitingPlayerUsername,username,2,3,0)
        sock.emit("generate-scoreboard",username,waitingPlayerUsername,3,2,1)
        games.push(new FourInARowGame(waitingPlayer,sock))

        waitingPlayer.emit("generate-play-field",7,6)
        sock.emit("generate-play-field",7,6)
    
        waitingPlayer = null
    }
    else {
        waitingPlayer = sock
        waitingPlayerUsername = username
        waitingPlayer.emit("status", "waiting for opponent")
        waitingPlayer.on("disconnect", () => waitingPlayer = null)
    }
    console.log("Games running: " + games.length)
}