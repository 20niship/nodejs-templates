const express = require("express");
const app = express();
const logdb = require("./database")

app.set("view engine", "ejs")

const main = async() => {
  await logdb.create_table();


 // parse_file("/var/log/auth.log");
 //  parse_file("/var/log/auth.log.1");
 //  parse_file("/var/log/auth.log.2.gz", true);
 //  parse_file("/var/log/auth.log.3.gz", true);
 //  parse_file("/var/log/auth.log.4.gz", true);
}

app.get("/", async(req, res)=> {
  const n = 100;
  const page = 1;
  const result = await logdb.get_data(n, page); 
  console.log(result);
  res.render("auth_log", {type:"list", result:result });
})

app.get("/ssh", async(req, res)=> {
  res.render("ssh_analisys", {});
})

app.get("/ssh2", async(req, res)=> {
  const n = 100;
  const page = 1;
  const result = await logdb.get_ssh_auth_data(n, page); 
  console.log(result);
  res.render("auth_log", {type:"list", result:result });
})

app.get("/refiptables", async(req, res)=> {
  res.send("ok");
})

app.get("/refnginx", async(req, res)=> {
  res.send("ok");
  await logdb.insert_nginx_data("./tmp/access.log", false);
})

app.get("/refresh_data", async(req, res)=> {
  res.send("ok")
  await logdb.clear_data();
  const pages = [
    // {name:"/var/log/auth.log", zipped:false },
    // {name:"/var/log/auth.log.2", zipped:false },
    // {name:"/var/log/auth.log.2.gz", zipped:true },
    // {name:"/var/log/auth.log.3.gz", zipped:true },
    {name:"./tmp/auth.log", zipped:false },
    {name:"./tmp/auth.log.1", zipped:false },
    {name:"./tmp/auth.log.2.gz", zipped:true },
    {name:"./tmp/auth.log.3.gz", zipped:true },
  ]
  for await (f of pages){
     await logdb.insert_syslog_data(f.name, f.zipped);
    console.log(f.name);
  }
  console.log("hoge")
})

app.get("/ssh_analisis", async(req, res) => {
  const data = await logdb.get_ssh_analitics();
  res.json(data);
})


app.get("/reset", async(req, res)=> {
  await logdb.create_table();
  res.send("ok");
})

app.listen(8000);


