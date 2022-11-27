from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import sys
def GetLessonDates(url,courseName):
    chromeOpt = Options()
    ser = Service("/usr/bin/chromedriver")
    chromeOpt.add_argument('--no-sandbox')
    chromeOpt.add_argument("--headless")
    chromeOpt.add_argument('--disable-dev-shm-usage')
    chromeOpt.add_experimental_option('excludeSwitches', ['enable-logging'])
    browser = webdriver.Chrome(service=ser,options=chromeOpt)
    browser.get(url)
    foundDiv = False
    while not foundDiv:
        html = browser.page_source
        soup = BeautifulSoup(html, 'html.parser')
        for course in soup.find("div",id = "course_moments"):
            if courseName in str(course):
                selectedCourse = course
                foundDiv = True
    for i in selectedCourse.find_all(class_="InfoBox-module--tr--e2dab"):
        if "Data" in str(i):
            coursedata = list(i)[1]
            break
    dates = []
    for i in coursedata.children:
        dates.append(i.text)

    return dates

def parseStringsCSV(dates):
    returnDates = "Date,Time,Room\n"
    for s in dates:
        for i in range(len(s)):
            if s[i].isnumeric():
                day = s[0:i-1]
                s = s[i:]
                break
        date = s[0:10]

        for i in range(len(s)):
            if s[i] == "(":
                s = s[i+1:]
                break

        for i in range(len(s)):
            if s[i] == "i":
                time = s[:i-1]
                room = s[i+3:].strip(")")
                break

        returnDates += f"{day},{date},{time},{room}\n"
    return returnDates

url = "https://www.boswell-beta.nl/vwo/wiskunde-b"
courseName = "Basis B + VWO Wiskunde B - Voorjaar 2023 (di/do/za)"

dates = GetLessonDates(url,courseName)

outputcsv = parseStringsCSV(dates)

print(outputcsv)