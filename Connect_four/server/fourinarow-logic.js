class FourInARowGame {
    constructor(p1,p2){
        this._players = [p1,p2]
        this._gameEnded = false
        this._currentPlayerPlaying = 0
        this._boardHeight = 6
        this._boardWidth = 7
        this._players.forEach((player,index) => {
            player.emit("status","Game Started!") 
            player.on("move",(move) => this._validateMove(move,player))
            player.on("disconnect", () => this._playerDisconectEvent(index))
        })
        // makes an empty board
        this._board = []
        for(var i = 0; i < this._boardHeight*this._boardWidth; i++){
            this._board.push(-1)
        }
        this._askUserInput()
    }

    _playerDisconectEvent(disconnectedPlayerIndex){
        if(this._gameEnded){
            return
        }
        this._players[(disconnectedPlayerIndex+1)%2].emit("status","Other player disconnected. Press f5 to find another game.")
        this._deleteGame(disconnectedPlayerIndex)
    }

    _askUserInput(addision = ""){
        this._players.forEach((player,inx) => {
            var message = this._currentPlayerPlaying == inx? addision + "It's your turn" : ""
            player.emit("ask-for-input",message)
        })
    }

    _validateMove(move,player){
        // check if its the player playing sending the move to avoid somone editing the js
        if (player != this._players[this._currentPlayerPlaying]){
            return
        }

        var parsedInput = parseInt(move)
        if(isNaN(parsedInput) || parsedInput <= -1 || parsedInput > this._boardWidth){
            console.log("uh oh")
            return
        }
        if(this._board[parsedInput] != -1){
            this._askUserInput("Colum filled pick another. ")
            return
        }
        this._proccesMove(parsedInput)
    }

    _deleteGame(disconnectedPlayerIndex = -1){
        this._gameEnded = true
        if (disconnectedPlayerIndex != -1){
            this._players[(disconnectedPlayerIndex+1)%2].disconnect()
            return
        }
        this._players.forEach((player) => player.disconnect())
    }

    // here to make the move that was selected happen in the game logic
    _proccesMove(columSelected){
        // puts the move into the game state
        var pieceIndex = this._getHeightOfColum(columSelected)*this._boardWidth+columSelected
        this._board[pieceIndex] = this._currentPlayerPlaying
        this._updatePiece(pieceIndex)


        if (this._checkIfGameWon()){
            this._updateGameStatus("You Won!","You lost.",this._checkIfGameWon())
            this._deleteGame()
            return
        }
        if (this._checkIfGameTied()) {
            this._updateGameStatus("Game tied.","Game tied.")
            this._deleteGame()
            return
        }

        // sets the other player as the one playing
        this._currentPlayerPlaying = (this._currentPlayerPlaying + 1) % 2

        // this lets the player know its thier turn with a little message
        this._askUserInput()
    }

    _getHeightOfColum(colum){
        for(var i = 0; i < this._boardHeight; i++){
            if(this._board[this._boardWidth*i+colum] != -1){
                return i - 1
            }
        }
        return this._boardHeight-1
    }

    // Used to update the board for the players.
    _updatePiece (pieceIndex) {
        this._players.forEach((player) => {
            player.emit("board-update",pieceIndex,this._currentPlayerPlaying)
        })
    }

    // here to let the player know what the status of his game is (is he waiting, in a game or is the game over)
    _updateGameStatus(playerPlayingMessage,playerWaitingMessage,winningComboIndexes = []){
        this._players.forEach((player,index) => {
            var endGameMessage = index === this._currentPlayerPlaying? playerPlayingMessage : playerWaitingMessage
            player.emit("status", endGameMessage + " Press f5 to find another game.",winningComboIndexes)
        })
    }

    // A simple function to check if the game is won. returns a boolean
    _checkIfGameWon (){
        for(var i = 0; i < this._board.length; i++){
            if (this._board[i] == -1){
                continue
            }
            var player = this._board[i]
            // vertical check
            if (player == this._board[i-this._boardWidth] && player == this._board[i-this._boardWidth*2] && player == this._board[i-this._boardWidth*3]){
                return [i,i-this._boardWidth,i-this._boardWidth*2,i-this._boardWidth*3]
            }
            // horizontal check
            if (this._board[i+1] == player && this._board[i+2] == player && this._board[i+3] == player && Math.floor(i/this._boardWidth) == Math.floor((i+3)/this._boardWidth)){
                return [i,i+1,i+2,i+3]
            }
            // diagonal check right
            if (i%this._boardWidth < 4 && this._board[i-this._boardWidth+1] == player && this._board[i-this._boardWidth*2+2] == player && this._board[i-this._boardWidth*3+3] == player){
                return [i,i-this._boardWidth+1,i-this._boardWidth*2+2,i-this._boardWidth*3+3]
            }
            // diagonal check left
            if (i%this._boardWidth > 2 && this._board[i-this._boardWidth-1] == player && this._board[i-this._boardWidth*2-2] == player && this._board[i-this._boardWidth*3-3] == player){
                return [i,i-this._boardWidth-1,i-this._boardWidth*2-2,i-this._boardWidth*3-3]
            }
        }
        return false
    }

    // A simple check to see if the first row is filled if so it means the game is tied
    _checkIfGameTied(){
        return !(this._board.slice(0,this._boardWidth).includes(-1))
    }
}

module.exports = FourInARowGame