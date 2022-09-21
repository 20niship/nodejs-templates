const express = require('express');
const session = require('express-session');




const bcrypt = require('bcrypt');
const password = "hoge";
let hashed_password = bcrypt.hashSync(password, 10);
console.log(hashed_password);

const bcrypt = require('bcrypt');
bcrypt.compareSync("hoge", hash_password) // =>ture





const app = express();

const sess = {
  secret: 'secretsecretsecret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

app.use(session(sess))

app.get('/login', (req, res) => {
  res
    .type('text/html')
    .send(
      `<form method="POST" action="/login">
         <label>username</label><br>
	    <input type="text" name="username"><br>
         <label>password</label><br>
	    <input type="password" name="password"><br>
         <input type="submit" name="login">
       </form>`
    )
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === 'admin' && password === 'password') {
      console.log("log in as admin!!");
      req.session.regenerate((err) => {
      req.session.username = 'admin';
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});


app.get('/', (req, res) => {
  var user_name = req.session.username ? req.session.username : "guest";

  res.type('text/html')
  .send(`
    <h1>Hello `+ user_name + `</h1>
    <br>
    <p><a href="/login">login</a></p>
    <p><a href='/logout'>logout</a></p>`);
});

app.listen('3000', () => {
  console.log('Application started');
});


app.listen(8080);


