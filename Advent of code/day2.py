moves = open("day2_input.txt","r").read().split("\n")
apponentPosibleMoves = ["A","B","C"]
myPosibleMoves = ["Y","X","Z"]

totalScore = 0
for i in moves:
    i = i.split(" ") 
    apponentMove = apponentPosibleMoves.index(i[0])
    GameOutcome = myPosibleMoves.index(i[1])
    mymove = (apponentMove + GameOutcome * 2) % 3
    
    if mymove == apponentMove:
        mymove += 3
    elif mymove == (apponentMove + 1) % 3:
        mymove += 6
    totalScore += mymove + 1

print(totalScore)   