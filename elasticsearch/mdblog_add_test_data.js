
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

const fs = require('fs');

(async() => {
  // 1つづつ追加する方法
  console.log("Add one data.......");
  const dataset = JSON.parse(fs.readFileSync('./output.json', 'utf8'));
  // console.log(dataset[0])
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
    //       const operation =nbject.keys(action)[0]
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
    for(let i=0; i<dataset.length; i++){
      let e = dataset[i];
      e["category"] = e.category && [];
      const date2 = (new Date(e["DATE"])).getTime()
      // const m = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/)
      // console.log(m)
      // const date2 = (new Date(m[1], m[2]-1, m[3], m[4], m[5], m[6])).getTime();

      const page={
        title : e["TITLE"],
        content:e["text_markdown"],
        tag:e.category && [],
        create_time:date2,
        cupdate_time:date2,
        author_id:0 , 
        // author_id: e["AUTHOR"],
        edit_count:0,
        lgtm_count:0,
        view_count:0,
        visible:true,
        thumb_url:"",
      }
     try{
        const res = await client.index({
            index: "mdblog_page",
            // type: '_doc',
            id: i,
            body:page
        });
      }catch(err){
        console.log(err)
      }
    }
    console.log("Done!!!");
})();
