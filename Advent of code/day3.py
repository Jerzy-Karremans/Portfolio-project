rucksacks = open("day3_input.txt","r").read().split("\n")
sum = 0
for i in range(len(rucksacks)):
    compartment1 = rucksacks[i][:len(rucksacks[i])//2]
    compartment2 = rucksacks[i][len(rucksacks[i])//2:]
    for j in range(len(compartment1)):
        if compartment2[j] in compartment1:
            letterIndex = ord(compartment2[j])-96
            if letterIndex > 0:
                sum += letterIndex
            else:
                sum += letterIndex+58
            break
print(sum)
