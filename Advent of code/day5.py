inputFile = open("day5_input.txt","r").read().split("\n")

crateArr = []
moves = []
for lineIndex in range(len(inputFile)):
    if inputFile[lineIndex] == "":
        # change the drawing into more usable arr
        for stackIndex in range(0,len(inputFile[lineIndex - 1]) + 1,4):
            crateArr.append([])
            for height in range(lineIndex - 2,-1,-1):
                crate = inputFile[height][stackIndex+1]
                if crate != " ":
                    crateArr[stackIndex//4].append(crate)
        # change instructions into arr
        for move in inputFile[lineIndex + 1:]:
            [firstMove,secondAndThirdMove] = move.lstrip("move ").split(" from ")
            [secondMove,thirdMove] = secondAndThirdMove.split(" to ")
            moves.append([int(firstMove),int(secondMove),int(thirdMove)])

# make the moves
for move in moves:
    beginArrIndex = move[1] - 1
    endArrIndex = move[2] - 1
    invertedCratesMoving = []
    # take the crates form start stack
    for crateAmmount in range(move[0]):
        invertedCratesMoving.append(crateArr[beginArrIndex].pop())
    # place them the same way on the end stack
    for crateIndex in range(len(invertedCratesMoving)-1,-1,-1):
        crateArr[endArrIndex].append(invertedCratesMoving[crateIndex])

# read crates on top
s = ""
for crateRow in crateArr:
    s += crateRow[len(crateRow) - 1]
print(s)