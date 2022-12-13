f = open("day1_input.txt","r")
inputString = f.read()
caloriesArr = inputString.split("\n")
elveTotals = []
sum = 0
for i in caloriesArr:
    if i == "":
        elveTotals.append(sum)
        sum = 0
    else:
        sum += int(i)


total = 0
for place in range(3):
    maxnum = 0
    for i in range(len(elveTotals)):
        if elveTotals[i] > maxnum:
            maxnum = elveTotals[i]
    elveTotals.remove(maxnum)
    total += maxnum

print(total)