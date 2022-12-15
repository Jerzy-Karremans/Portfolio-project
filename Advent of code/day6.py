inputCharStream = open("day6.txt","r").read()

count = 0
for charindex in range(len(inputCharStream)):
    print(inputCharStream[charindex], inputCharStream[charindex + 1:charindex + 4])
    if inputCharStream[charindex] in inputCharStream[charindex + 1:charindex + 4]:
        count = 0
    else:
        print("")
        count + 1
    if count == 3:
        print(charindex)
        break