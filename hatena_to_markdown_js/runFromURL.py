import re
import sys
from urllib.parse import urlparse
from pyquery import PyQuery as pq

import sys
import xml.etree.ElementTree as ET
import urllib.request
import urllib.parse
import chardet

from html_to_text_OneArticle.run import *

def getUrlList():
    URL = input("URLを入力してください-＞")
    url = URL + "/sitemap.xml"  #"https://shizenkarasuzon.hatenablog.com/sitemap.xml"

    #url = "https://shizenkarasuzon.hatenablog.com/sitemap.xml"
    req = urllib.request.Request(url)

    with urllib.request.urlopen(req) as response:
        xml_string = response.read()

    root = ET.fromstring(xml_string)
    url_list_root = []

    counter = 0
    while(1):
        try:
            url_list_root.append(root[counter][0].text)
            counter += 1
        except:
            break

    article_url_list = []
    for url in url_list_root:
        req = urllib.request.Request(url)

        with urllib.request.urlopen(req) as response:
            xml_string = response.read()

        root = ET.fromstring(xml_string)
        url_list_root = []

        counter = 0
        while (1):
            try:
                article_url_list.append(root[counter][0].text)
                counter += 1
            except:
                break

    return article_url_list

def MakeOneArticle(url):
    if("entry" not in url): return

    data = urllib.request.urlopen(url).read()
    guess = chardet.detect(data)
    html = data.decode(guess['encoding'])
    data = pq(html)
    article = ""
    title = ""
    date = "None"
    for e in data('.entry-content'):
        article = pq(e).html()

    for e in data('.entry-title-link'):
        title = pq(e).text()

    for e in data('.updated'):
        date = pq(e).text()
    print(" ---------------------  analyzing url .... ------------------------")
    print(" ---- url   = " + url)
    print(" ---- title = " + title)
    print(" ---- date  = "  + date)

    hatena_text = ConvertHTML_to_HATENA(article)

    output_filename = "output\\$$$DATE$$$_$$$TITLE$$$"
    output_filename = output_filename.replace("$$$DATE$$$", date)
    output_filename = output_filename.replace("$$$TITLE$$$", title)

    non_usage_list = [" ", ".", "/", ":", "「", "」", "【", "】", "　", "?", "!", "？", "！"]
    for temp in non_usage_list:
        output_filename = output_filename.replace(temp, "")

    print(output_filename)
    f = open(output_filename + ".txt", "w", encoding="utf-8_sig")
    f.write(hatena_text)
    print("---------     File Saved    --------------")
    f.close()

urlList = getUrlList()
print("Article number -> " + str(len(urlList)))
print("####  main process start!!  ####")
for url in urlList:
    MakeOneArticle(url)