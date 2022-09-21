const axios = require('axios')
const URL = "https://hooks.slack.com/services/AA/BB/CC";
// const data={text:{type: "mrkdwn", text:"- Hello World!!\n- aaaa\n"}};

const data = {"blocks": [
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "• Detective Chimp\n• Bouncing Boy\n• Aqualad"
    }
  }
]}

const URLS = [
  ["46.51.247.99:8000","Only One Golf",]
  ["3.115.170.174:8000","Ciaon"],
  ["13.113.139.112:8000","StoKee"],
  ["18.182.68.78:8000","BuyerLIve"],
  ["35.76.198.115:8000","WineOpener"],
  ["52.69.234.205:8000","Garage Hunter(ガレージハンター)"],
  ["35.75.173.36:8000","Guild Tokyo"],
  ["35.74.6.120:8000","LiveSpot"],
  ["3.113.55.145:8000","Sake chatting"],
  ["52.197.242.217:8000","fruit outlet studio"],
  ["52.69.190.10:8000","HOME L!VE"]
];


(async()=> {
  console.log("Send Message!!")
  const response = await axios.post(URL, data)
  
  console.log("メッセージを送信しました", res.status)
  console.log(res);
})();

