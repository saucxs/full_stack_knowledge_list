import json
import re
import requests
from requests import RequestException

def getPage(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.text
        return None
    except RequestException:
        return None

def regExpPage(html):
    pattern = re.compile('<li.*?list-item.*?data-title="(.*?)".*?data-score="(.*?)".*?>.*?<img.*?src="(.*?)".*?/>', re.S)
    items = re.findall(pattern, html)
    for item in items:
        yield{
            'title': item[0],
            'score': item[1],
            'image': item[2],
        }

def writeToFile(content):
    with open('python_douban_movie.txt', 'a', encoding='utf-8')as f:
        # print(type(json.dumps(content)))
        f.write(json.dumps(content,sort_keys=True,indent=2,ensure_ascii=False))

def main():
    url = "https://movie.douban.com/cinema/nowplaying/nanjing/"
    html = getPage(url)
    for item in regExpPage(html):
        print(item)
        writeToFile(item)

if __name__ == '__main__':
    main()
