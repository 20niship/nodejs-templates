import * as mongoDB from "mongodb";
interface Page {
  id: number,
  title: string,
  tag: string[],
  user: number,
  update: Date,
  created: Date,
  context: string,
};


const mongo_pagename = "mongo";
const mongo_pass = "mongoPass";
const authMechanism = "DEFAULT";

const url = `mongodb://${mongo_pagename}:${mongo_pass}@localhost:27017/?authMechanism=${authMechanism}`;

const client = new mongoDB.MongoClient(url);

export const collections: { pages?: mongoDB.Collection } = {}

export const connect = async () => {
  console.log("Connecting to mongodb.....")
  await client.connect();
  const db = client.db("example");
  // const auth_res = await db.authenticate("mongo", "mongopass")
  // console.log(auth_res)
  collections.pages = db.collection("page");
  console.log("Connected!")
}

export const get_pages = async () => {
  const res = (await collections.pages?.find({}).toArray());
  console.log(res);
  return res;
}

export const insert_one = async () => {
  const page: Page = {
    user: 0,
    title: "aaaa",
    created: new Date(),
    update: new Date(),
    tag: ["aaa", "bbb"],
    context: "Hello World",
    id: 1
  };

  const res = await collections.pages?.insertOne(page);
  console.log(res);
  return res;
}

export const insert_many = async () => {
  // このように配列を引数に取ることで、複数同時に追加することもできる
  collections.pages?.insertMany([
    { name: 'test1', id: 'id7', age: 7, sex: "female" },
    { name: 'test2', id: 'id8', age: 8, sex: "male" }
  ]);
}

/*
const example = async () => {
  // ====================
  // 検索
  // ====================
  // 男性を出力するプログラム
  collections.pages?.find({ sex: "male" }).each(function(err, doc) {
    if (doc !== null) { console.log(doc.name); }
  });

  // 全データ出力
  // users.find().each(function(err, doc) {
  //     console.log(doc);
  // });

  // 出力を制御する（↓のプログラムの場合hあidは出力せず、名前を出力する）
  users.find({}, { projection: { _id: 0, name: 1 } }).toarray(function(err, result) {
    if (err) throw err;
    console.log(result);
  });

  // ====================
  // データ削除 
  // ====================
  //users.deleteone({"age":0});//ageが0のデータを一つ削除
  //users.deletemany({"age":{"$lte": 4}}) //ageが4以下のデータを削除
  // users.deletemany({}) // 全データ削除

  // ====================
  // データ個数を調べる 
  // ====================
  collections.pages?.count({}).then((result) => { // find(条件).count()という書き方もある
    console.log("最終的なデータの数 = ", result);
  })
  client.close();
}
*/


const aggregate_month = async () => {
  const pipeline = [
    { $match: {} },
    { $group: { _id: { $dateToString: { date: "$created", format: "%Y-%m" } }, count: { $sum: 1 } } }
  ];
  const aggCursor = collections.pages?.aggregate(pipeline);
  let res = [];
  for await (const doc of aggCursor || []) res.push(doc);
  console.log(res)
}

const category = async () => {
  const pipeline = [
    { $match: {} },
    { $group: { _id: "$tag", count: { $sum: 1 } } }
  ];
  const aggCursor = collections.pages?.aggregate(pipeline);
  let res = [];
  for await (const doc of aggCursor || []) res.push(doc);
  console.log(res)
}


const main = async () => {
  await connect();
  // await insert_one();
  // await get_pages();
  await aggregate_month();
  console.log("=== END ====")
}

main()
