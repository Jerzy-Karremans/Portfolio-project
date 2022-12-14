inputArr = open("day4_input.txt","r").read().split("\n")
sum = 0
for i in range(len(inputArr)):
    inputArr[i] = inputArr[i].split(",")
    tasks = [inputArr[i][0].split("-"), inputArr[i][1].split("-")]
    taskRanges = []
    for task in tasks:
        outRan = []
        for ran in range(int(task[0]),int(task[1]) + 1):
            outRan.append(str(ran))
        taskRanges.append(outRan)

    check = any(item in taskRanges[0] for item in taskRanges[1])
    if check:
        sum += 1
print(sum)