morse_code = {
   "A": ".-",
   "B": "-...",
   "C": "-.-.",
   "D": "-..",
   "E": ".",
   "F": "..-.",
   "G": "--.",
   "H": "....",
   "I": "..",
   "J": ".---",
   "K": "-.-",
   "L": ".-..",
   "M": "--",
   "N": "-.",
   "O": "---",
   "P": ".--.",
   "Q": "--.-",
   "R": ".-.",
   "S": "...",
   "T": "-",
   "U": "..-",
   "W": ".--",
   "X": "-..-",
   "Y": "-.--",
   "Z": "--..",
   "1": ".----",
   "2": "..---",
   "3": "...--",
   "4": "....-",
   "5": ".....",
   "6": "-....",
   "7": "--...",
   "8": "---..",
   "9": "----.",
   "0": "-----"
}
seperator = "/"
isDecoding = input("Do you want to decode? (y/n)") == "y"
inputString = input("input string: ")
outputString = ""
if isDecoding:
    for i in inputString.split("/"):
        outputString += list(morse_code.keys())[list(morse_code.values()).index(i)] if list(morse_code.values()).__contains__(i.upper()) else ""
else:
    for i in inputString:
        code = seperator + morse_code[i.upper()] if morse_code.__contains__(i.upper()) else ""
        outputString += code
    outputString += seperator
print(outputString)