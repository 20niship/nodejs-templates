import requests
import json

SLACK_URL = "https://hooks.slack.com/services/AA/BB/CC"

TIMEOUT = 3.5
SCHEMA = "http://"
SERVICE_URLS = [
  ["myclub.techpreneur.jp:8000","Only One Golf"],
  ["ciaon.techpreneur.jp:8000","Ciaon"],
  ["stokee.techpreneur.jp:8000","StoKee"],
  ["buyerlive.techpreneur.jp:8000","BuyerLIve"],
  ["wineopener.techpreneur.jp:8000","WineOpener"],
  ["carbuy2.techpreneur.jp:8000","Garage Hunter(ガレージハンター)"],
  ["garage-hunter.techpreneur.jp:8000","Guild Tokyo"],
  ["livespot.techpreneur.jp:8000","LiveSpot"],
  ["livechannel.techpreneur.jp:8000","Sake chatting"],
  ["outletstudio.techpreneur.jp:8000","fruit outlet studio"],
  ["homelive.techpreneur.jp:8000","HOME L!VE"]
]

dead = ""
internalError = ""
working = ""

for U in SERVICE_URLS:
  try:
    r = requests.get(SCHEMA + U[0], timeout=3.4)
    if(r.status_code != 200):
        internalError += f"• {U[1]} {U[0]} : ERROR = {r.status_code}\n"
    else:
        working += f"• {U[1]} {U[0]} : OK\n"
  except Exception as e:
    print(e)
    dead += f"• {U[1]} {U[0]} : NO CONNECTION !\n"


data = {"blocks": [{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text":
f"""
####   DEAD   ####
{dead}


####  SERVER ERROR ####
{internalError}

####  WORKING ####
{working}
"""
  }}
]}


print(data["blocks"][0]["text"]["text"])


response = requests.post(SLACK_URL, data=json.dumps(data))

print(response.status_code)    # HTTPのステータスコード取得
print(response.text)    # レスポンスのHTMLを文字列で取得

