from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import sys
import time
import json

def ReadUrl(url):
    chromeOpt = Options()
    ser = Service("/usr/bin/chromedriver")
    chromeOpt.add_argument('--no-sandbox')
    chromeOpt.add_argument("--headless")
    chromeOpt.add_argument('--disable-dev-shm-usage')
    chromeOpt.add_experimental_option('excludeSwitches', ['enable-logging'])
    browser = webdriver.Chrome(service=ser,options=chromeOpt)
    browser.get(url)
    return browser

def GetSubjectInfo(browser):
    html = browser.page_source
    soup = BeautifulSoup(html, 'html.parser')
    # reads out the page as a dict of {"CourseName": ["day","date","time","room"]}
    courses = {}
    for course in soup.find("div",id = "course_moments"):
        if "InfoBox-module--title--a58cb" not in str(course) and "InfoBox-module--bottom--edc9b" not in str(course):
            titleAndDates = course.children
            title = next((next(titleAndDates)).children).text
            table = next(titleAndDates).children
            next(table)
            tableIter = next(next(table).children).children
            next(tableIter)
            next(tableIter)
            infoboxIter = next(tableIter).children
            next(infoboxIter)
            dates = next(infoboxIter)
            datesSoupList = list(dates.children)
            for i in range(len(datesSoupList)):
                if datesSoupList[i]['class'] == [] and i > 0:
                    datesSoupList = datesSoupList[i-1:]
                    break
            dateText = []
            for dateSoup in datesSoupList:
                dateText.append(dateSoup.text)
            courses[title] = parseDates(dateText)
    return json.dumps(courses,indent=3)

def parseDates(dates):
    returnDates = []
    for s in dates:
        returnDates.append([])
        index = len(returnDates) -1
        for i in range(len(s)):
            if s[i].isnumeric():
                returnDates[index].append(s[0:i-1])
                s = s[i:]
                break
        returnDates[index].append(s[0:10])

        for i in range(len(s)):
            if s[i] == "(":
                s = s[i+1:]
                break

        for i in range(len(s)):
            if s[i] == "i":
                returnDates[index].append(s[:i-1])
                returnDates[index].append(s[i+3:])
                break
    return returnDates

url = sys.argv[1]
browser = ReadUrl(url)
time.sleep(2)
coursesJson = GetSubjectInfo(browser)

print(coursesJson)
sys.stdout.flush()