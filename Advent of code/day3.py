rucksacks = open("day3_input.txt","r").read().split("\n")
sum = 0
for group in range(0,len(rucksacks),3):
    groupSacks = rucksacks[group:group+3]
    for char in groupSacks[0]:
        if char in groupSacks[1] and char in groupSacks[2]:
            letterIndex = ord(char)-96
            if letterIndex > 0:
                sum += letterIndex
            else:
                sum += letterIndex+58
            break
print(sum)