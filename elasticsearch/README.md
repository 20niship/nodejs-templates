# elasticsearch

## install
https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html の内容を見ながら進める。

Ubuntu（Debian）の場合、

```bash
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install elasticsearch
```

Kibanaも入れる場合は、以下を追加
```
sudo apt-get update && sudo apt-get install kibana
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable elasticsearch.service
sudo /bin/systemctl enable kibana.service
```
(参考→https://level69.net/archives/25379）

僕の環境の場合、最後の3行はいらなかった。


## 設定ファイル
ElasticSearchとKibanaのIPアドレスの設定は以下のように書くことができる。



## 起動、停止
```bash
sudo -i service elasticsearch start
sudo -i service elasticsearch stop
```

```bash
sudo -i service kibana start
sudo -i service kibana stop
```

service startしたら、
`http://localhost:5601`と`http://localhost:9200`を確認したらそれぞれKibanaとElasticsearchに接続できる。


## Kibanaからテストデータを追加
参考：https://www.elastic.co/guide/jp/elasticsearch/reference/current/gs-cluster-health.html

1. `http://localhost:5601/app/dev_tools#/console` にアクセスし、Kibanのコンソールを開く。
2. `GET /_cat/health?v`と書いて、その行を実行すると

## kuromojiの設定
1. index.jsに書いてある通りにインストールする。
2. Index作成時にAnalyzerを設定する

```json
PUT /blog_post
{
  "settings": {
    "analysis": {
      "analyzer": {
        "default": { // ここを「hoge_analyzer」とかにすると、_analyze APIなどで指定することができる。
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer"
        }
      }
    }
  }
}
```
そして、Analyzeしてみると、

```json
POST blog_post/_analyze
{
  "text": "国会議事堂"
}
```
↓結果は
```json
{
  "tokens" : [
    {
      "token" : "国会",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "word",
      "position" : 0
    },
    {
      "token" : "議事堂",
      "start_offset" : 2,
      "end_offset" : 5,
      "type" : "word",
      "position" : 1
    }
  ]
}
```
のように、うまくできていることがわかる。

下のように書くことで、インデックス作成時に作ったAnalyzerを指定できる。
```json
POST blog_post/_analyze
{
  "analyzer": "hoge_analyzer",
  "text": "国会議事堂"
}
```


## カテゴリー一覧を検索



GET blog_post/_search
{
  "aggs": {
    "category_count": {
      "terms": {
        "field": "CATEGORY.keyword", "size": 500
      }
    }
  },
  "size": 0
}

## mapping表示
```
GET /mdblog_page/_mapping
```

