function setGameStatus (text,winningComboIndexes) {
    document.querySelector("#game-status").innerHTML = text

    // display's the winning combo if somone won
    if (winningComboIndexes){
        gameEnded = true
        Array.from(document.getElementsByClassName("fake-piece")).forEach((indicator) => {
                indicator.style.outline = ""
        })
        removePieceOutline()
        winningComboIndexes.forEach((index) => {
            Array.from(document.getElementsByClassName("piece"))[index].style.outline = bordercss
        })
        
    }
}
var gameEnded = false

// used in UpdateGameBoardOnScreen and setGameStatus
function removePieceOutline () {
    Array.from(document.getElementsByClassName("piece")).forEach((piece) => {
        piece.style.outline = ""
    })
    
}

const pieceColors = ["#F2CB05","#F27405"]
function UpdateGameBoardOnScreen (index,newPiece) {
    removePieceOutline()
    // gets the pieces from the board wrapper
    const pieceUpdated =  document.getElementsByClassName("boardWrapper")[0].childNodes[index]
    
    // filles in the piece with the right color
    pieceUpdated.style.backgroundColor = pieceColors[newPiece]
    pieceUpdated.style.outline = "0.2em solid black"

    pieceUpdated.setAttribute("isFilled","true")
}

function generatePlayField(width,height){
    if(playingFieldGenerated){
        return
    }
    playingFieldGenerated = true

    // sets the ammount of columns in ../styles/main.css
    document.documentElement.style.setProperty("--AmountOfColumns", width)

    // the parent object for the play field
    const playfieldWrapper = document.getElementsByClassName("playfieldWrapper")[0]

    const generateBannerDiv = () => {
        var bannerDiv = document.createElement("div")
        bannerDiv.className = "banner-wrapper"
        playfieldWrapper.appendChild(bannerDiv)
    }

    generateBannerDiv()

    // generates the board
    // makes the wrapper object
    var boardWrapper = document.createElement("div")
    boardWrapper.className = "boardWrapper"
    playfieldWrapper.appendChild(boardWrapper)

    for(var pieceInx = 0; pieceInx < width*height; pieceInx++){
        // generates a single piece
        var newPiece = document.createElement("button")
        newPiece.setAttribute("id",pieceInx%width)
        newPiece.setAttribute("onclick","sock.emit('move',this.id)")
        newPiece.className = "piece"
        newPiece.setAttribute("isFilled","false")
        boardWrapper.appendChild(newPiece)
    }
    generateBannerDiv()
}

document.addEventListener("mousemove", e => {
    // check if its the players turn
    if(!thisPlayersTurn){
        return
    }
    // get the element the players mouse is over decide if its a piece
    var ElementHovering = document.elementFromPoint(e.clientX,e.clientY)
    // loops over all pieces
    Array.from(document.getElementsByClassName("piece")).forEach((piece) => {
        // makes sure not to change any of the filled pieces
        if(piece.getAttribute("isFilled") === "true"){
            return
        }

        // if the user is hovering something that isnt a piece or isnt overing the row draw it as background
        if (ElementHovering.className != "piece" || piece.id != ElementHovering.id) {
            piece.style.backgroundColor = "#014040"
            return
        }
        // else draw the piece highlighted
        piece.style.backgroundColor = "#043333"
    })
}, {passive: true})

// lets the user know its thier turn
function askForInput(message){
    document.querySelector("#turnNotifier").innerHTML = message

    var turnIndicator = Array.from(document.getElementsByClassName("fake-piece"))

    // extra functionality remove if possible
    // using thitPlayerTurn to display the hovering or not
    if(message != ""){
        thisPlayersTurn = true
        turnIndicator.forEach((indicator,index) => {
            if(index != 1){
                indicator.style.outline = bordercss
            }
            else{
                indicator.style.outline = ""
            }
        })
    } else {
        if(!gameEnded){
            turnIndicator.forEach((indicator,index) => {
                if(index == 1){
                    indicator.style.outline = bordercss
                }
                else{
                    indicator.style.outline = ""
                }
            })
        }
        
        // wipes all hovering discoleration if its no longer the players turn (bad code)
        Array.from(document.getElementsByClassName("piece")).forEach((piece) => {
            if (piece.getAttribute("isFilled") == "false" && piece.style.backgroundColor != "#014040"){
                piece.style.backgroundColor = "#014040"
            }
        })
        thisPlayersTurn = false
    }
}

const onUsernameSubmitted = (e) => {
    e.preventDefault()
    const text = document.querySelector("#input-box").value
    sock.emit("username-entered",text)
    document.querySelector("#input-name-form").remove()
    document.cookie = text
}

const bordercss = "0.2em solid black"
var thisPlayersTurn = false
var playingFieldGenerated = false

function generateScoreboard(player1Name,player2Name,player1Wins,player2Wins,colorindex){
    const scoreboardWrapper = document.querySelector("#scoreboard-wrapper")
    var div
    for(var i = 0; i < 5; i++){
        div = document.createElement("div")
        scoreboardWrapper.appendChild(div)
        if(i % 2 == 0){
            var newName = document.createElement("h3")
            div.appendChild(newName)
            if(i==2){
                newName.innerHTML = " - "
                continue
            }
            newName.innerHTML = [player1Name,player2Name][i == 0? 0 : 1]
            div.style.width = "20vw"
            div.style.textAlign = i != 0? "start" : "end"
        } else {
            div.className = "fake-piece"
            
            if(i==1){
                div.style.backgroundColor = pieceColors[colorindex == 0 && i==1 ? 0 : 1]
            } else{
                div.style.backgroundColor = pieceColors[colorindex == 0 ? 1 : 0]
            }
        }
    }
}

// these handle messages from the server
const sock = io()
sock.on("message",console.log)
sock.on("status", setGameStatus)
sock.on("board-update", UpdateGameBoardOnScreen)
sock.on("ask-for-input", askForInput)
sock.on("disconnect", () => askForInput(""))
sock.on("generate-play-field",(width,height) => generatePlayField(width,height)) 
sock.on("generate-scoreboard",(name1,name2,score1,score2,colorindex) => generateScoreboard(name1,name2,score1,score2,colorindex))

if(document.cookie == ""){
    document.querySelector("#input-name-form").addEventListener("submit",onUsernameSubmitted)
}
else{
    sock.emit("username-entered",document.cookie)
    document.querySelector("#input-name-form").remove()
}