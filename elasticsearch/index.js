
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace' // log表示
});


client.ping({requestTimeout: 30000},  (error) => {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

// -----------------------　indexの作成、削除    -----------------------
const createIndex = async() => {
    console.log("Creating index......");
    try{
      // let res = await client.indices.create({ index: 'mdblog_page' });
      let res = await client.indices.create({ index: 'mdblog_page', 
        body: {
          settings: {
            analysis: {
              analyzer: {
                hoge_kuromoji_analyzer: {
                  // type: "custom",
                  // tokenizer: "kuromoji_tokenizer"
                  "type":      "custom", 
                  "tokenizer": "standard",
                  "char_filter": [
                    "html_strip"
                  ],
                  "filter": [
                    "lowercase",
                    "asciifolding"
                  ]
                }
              }
            }
          }
        }
      });
      console.log(res);
    }catch(err){
      console.log(err);
    }
    // client.indices.create({ index: 'mdblog_page'},(err,resp,status) =>{ if(err) {console.log(err); }else {  console.log("create",resp); }});
    console.log("Create index done!");
}

const deleteIndex = async() => {
    console.log("Deleting index......");
    try{
      let res = await client.indices.delete({index:'mdblog_page'});
      console.log(res);
    }catch(err){
      console.log(err);
    }
    // client.indices.delete({index:'mdblog_page'},function(err,resp,status) { if(err) { console.log(err); }else { console.log("create",resp);} });
    console.log("Deleting index done!");
}

// -----------------------　ドキュメントの作成、削除    -----------------------
// client.index({  
//   index: 'blogs',
//   id: '1',
//   type: 'page',
//   body: {
//     "ConstituencyName": "Ipswich",
//     "ConstituencyID": "E14000761",
//     "ConstituencyType": "Borough",
//     "Electorate": 74499,
//     "ValidVotes": 48694,
//   }
// },function(err,resp,status) {
//     console.log(resp);
// });

// client.delete({  
//   index: 'gov',
//   id: '1',
//   type: 'page'
// },function(err,resp,status) {
//     console.log(resp);
// });

const search = async() => {
  // ドキュメント内のレコードの数を数える
  console.log("Counting.....");
  // const res2 = await client.count({ index: 'mdblog_page' })
  // console.log(res2)

  // -----------------------　検索    -----------------------

  const start = performance.now();
  let res = {}
  for(i = 0; i<500; i++){
    res = await client.search({
      index: 'mdblog_page',
      body: {
        size : 1,
        query: {
          "match": { "_id": 150 } 
          // "match": { "CATEGORY": "Python" } 
          // "match": { "text_markdown": "インストールしますであああ" } 
       
          // "multi_match" : {
            // "query":    "Node.js",
            // "fields": [ "title", "*_tag" ] 
          // }
        }
      }
    })
  }
  const end =  performance.now();
  console.log(end-start);
  console.log(res.hits.hits.length)
  for (const blog of res.hits.hits) {
    console.log('blog:', blog._id);
  }
  console.log("search2........")

  // 全データを取得するには、queryをmatch_allにする
  // from, sizeで出力数を制限＆ページングできる
  res = await client.search({ index: 'mdblog_page', body: { from:10, size:10, query: {match_all: {}} } })
  for (const blog of res.hits.hits) {
    console.log(`${blog._id}   ${blog._source.TITLE}`);
  }


  // Analyzer(kuromoji)が動いているかどうかのテスト
  // const res3 = await client.indices.analyze({
  //   index: "mdblog_page",
  //   body: {
  //     analyzer : "hoge_kuromoji_analyzer",
  //     text : "インストールしま国会議事堂"
  //   }
  // })
  // console.log("analyze result : ")
  // console.log(res3);

}


const fs = require('fs');
const adddata = async() => {
  // -----------------------　データの追加    -----------------------
  // 1つづつ追加する方法
  console.log("Add one data.......");
  try{
    const res = await client.index({
        index: "mdblog_page",
        // type: 'page',
        // type: "_doc",
        // id: _id,
        body: {title:"aaaa", text:"hogehogehuga0123", user:"aaa", mynum: 103, mylist:["a", "b", "c", "d"]}
    });
    console.log(res);
  }catch(error){
    console.log(error);
  }
  console.log("Add one data Done!!");


  console.log("deleting all data.");
  // await client.delete({ index: "blogs",type:"page",id:0 })
  try{
    const res =await client.indices.delete({ index: "mdblog_page"})
    console.log(res);
  }catch(error){
    console.log(error);
  }
  console.log("deleting all data done");

  console.log("Create mapping.")
  const res = await client.indices.create({
    index: 'mdblog_page',
    body: {
      mappings: {
        properties: {
          id: { type: 'integer' },
          text: { type: 'text' },
          user: { type: 'keyword' },
          time: { type: 'date' },
          category: { type: 'keyword' }
        }
      }
    }
  }, { ignore: [400] });
  console.log(res);
  console.log("Create Done.")

  const dataset = JSON.parse(fs.readFileSync('./output.json', 'utf8'));
  const pages = dataset.page;
  console.log(pages.length)

    // const res  = await client.bulk({ refresh: true, 
    //   index: 'blogs',
    //   // type: 'page', 
    //   body : [
    //     { "index" : {}       },
    //     { "name"  : "java"   },
    //     { "index" : {}       },
    //     { "name"  : "golang" },
    //   ]
    //  })

    // console.log(res);

    //   if (bulkResponse.errors) {
    //     const erroredDocuments = []
    //     // The items array has the same order of the dataset we just indexed.
    //     // The presence of the `error` key indicates that the operation
    //     // that we did for the document has failed.
    //     bulkResponse.items.forEach((action, i) => {
    //       const operation = Object.keys(action)[0]
    //       if (action[operation].error) {
    //         erroredDocuments.push({
    //           // If the status is 429 it means that you can retry the document,
    //           // otherwise it's very likely a mapping error, and you should
    //           // fix the document before to try it again.
    //           status: action[operation].status,
    //           error: action[operation].error,
    //           operation: body[i * 2],
    //           document: body[i * 2 + 1]
    //         })
    //       }
    //     })
    //     console.log(erroredDocuments)
    //   }
    console.log("adding each data........")
    for(let i=0; i<pages.length; i++){
      let e = pages[i];
      console.log(Object.keys(e));
      try{
      const res = await client.index({
          index: "mdblog_page",
          type: '_doc',
          id: i,
          body: e
      });
        console.log(e.category);

      // await client.update({
      //   index: 'mdblog_page',
      //   id: i,
      //   body: {
      //     doc: {
      //       tag: ["Python", "Opencv", "C++"]
      //     }
      //   }
      // })
      }catch(err){
        console.log(err)
      }
    }
    console.log("Done!!!");
}


const kuromoji = async() => {
  // install : https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-kuromoji.html
  // cd /usr/share/elasticsearch/
  // sudo ./elasticsearch-plugin install analysis-kuromoji
 //  sudo service elasticsearch restart

 //  curl -X GET 'http://localhost:9200/_nodes/plugins' でプラグイン一覧を表示できるので、pluginの中にkuromojiが入っていればOK
}

(async() => {
  await deleteIndex();
  await createIndex();
  await adddata();
  await search();
})();
