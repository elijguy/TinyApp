var express = require("express");
const bcrypt = require('bcrypt');
var app = express();
var cookieSession = require('cookie-session')
var PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");

app.use(cookieSession({
  name: 'session',
  keys:["secret"],
  maxAge: 24 * 60 * 60 * 1000
}));


function generateRandomString() {
  var result = '';
  for (var i = 6; i > 0; --i) result += ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')[Math.floor(Math.random() * ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').length)];
  return(result);
};

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


var urlDatabase = {

};

const users = {

}

app.post("/register",(req,res)=> {

  let test = [];
  for(const eachID in users){
    test.push(users[eachID].email);
  }

  let testlen = (test.length)
  let newid = generateRandomString();
  users[newid] = {};
  urlDatabase[newid] = {};
  users[newid]["id"] = newid;
  users[newid]["email"] = req.body.email;
  const password = req.body.password;
  const hashedpassword = bcrypt.hashSync(password,10);
  users[newid]["password"] = hashedpassword;
  tester = users[newid]["email"];

  for(var eachEmail = 0; eachEmail < testlen; eachEmail++){
    if(test[eachEmail] === tester)
    {
      res.send(400);
    }
  }


  if((users[newid]["email"] === "") || (users[newid]["password"] === "")){
    res.send(400);
  } else {
    res.redirect("/urls");
  }
});


app.get("/register", (req, res) => {
  res.render("user_register");
});


app.post("/logout",(req,res)=>{
  req.session = null;
  res.redirect("/urls");
});


app.get("/login", (req, res) => {
  res.render("user_newlog");
});



app.post("/login",(req,res)=>{
  var set = 0;
  for(const checkId in users) {
    if(users[checkId].email === req.body.email) {
      for(const checkpass in users) {
        if(bcrypt.compareSync(req.body.password, users[checkpass].password)){
          set = users[checkpass].id;
        }
      }
    }
  }

  if(set === 0){
    res.send(403);
  }
  req.session.user_id = set;
  res.redirect("/urls");

});


app.post("/urls/:id",(req, res)=> {
  let smallURL = (req.params.id);
  urlDatabase[(req.session.user_id)][smallURL] = (req.body.updateURL);
  res.redirect("/urls");
});


app.post("/urls/:id/delete",(req, res)=> {
  let deleteURL = req.params.id;
  let url = `/urls/${deleteURL}/delete`;
  delete urlDatabase[(req.session.user_id)][deleteURL];
  res.redirect("/urls");
});


app.get("/urls/:id/delete",(req,res)=>{
  if(req.session.user_id === undefined){
    res.redirect("/login");
  }
  if (urlDatabase[req.session.user_id][req.params.id] === undefined){
    res.redirect("/login");
  }else {
    res.redirect("/urls/:id/delete");
  }
});


app.get("/urls/new", (req, res) => {
  let templateVars = {
    cookie: req.session.user_id,
    user:users
  };
  if (req.session.user_id === undefined){
    res.redirect("/login");
  }else{
    res.render("urls_new",templateVars);
  }
});


app.get("/u/:shortURL", (req, res) => {
  for (var allurl in urlDatabase){
    if(urlDatabase[allurl][req.params.shortURL] !== undefined){
      let longURL = urlDatabase[allurl][req.params.shortURL];
      res.redirect(301,longURL);
    }
  }
});


app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let url = `/urls/${shortURL}`;
  urlDatabase[(req.session.user_id)][shortURL] = (req.body.longURL);
  res.redirect(url);
});


app.get("/", (req, res) => {
  res.redirect("/urls");
});


app.get("/urls.json", (req, res) => {
  res.send(users);
});


app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req,res) => {
    let templateVars = {
      cookie: req.session.user_id,
      urls: urlDatabase,
      user: users
    };
    res.render("urls_index", templateVars);
});


app.get("/urls/:id", (req, res) => {
  let templateVars = {
    cookie: req.session.user_id,
    user: users,
    shortURL: req.params.id,
    urlDatabase: urlDatabase
  };

  if(urlDatabase[req.session.user_id][req.params.id] === undefined){
    res.redirect("/login");
  }else {
    res.render("urls_show", templateVars);
  }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



/*must clear cookies before using*/


