var express = require("express");

var app = express();

var cookieParser = require('cookie-parser');

var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");

app.use(cookieParser());


function generateRandomString() {

    var result = '';

    for (var i = 6; i > 0; --i) result += ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')[Math.floor(Math.random() * ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').length)];

    return(result);

}

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

  users[newid]["password"] = req.body.password;

  tester = users[newid]["email"];

  for(var eachEmail = 0; eachEmail < testlen; eachEmail++){

    if(test[eachEmail] === tester)
    {
      res.send(400);
    }
  }


if((users[newid]["email"] === "") || (users[newid]["password"] === ""))

  {
    res.send(400);

  } else {

    res.redirect("/urls");
  }


});



app.get("/register", (req, res) => {

  res.render("user_register");

});


app.post("/logout",(req,res)=>{

  res.clearCookie("user_id");

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

        if(users[checkpass].password === req.body.password) {

          set = users[checkpass].id;

        }
      }
    }
  }

  if(set === 0){

    res.send(403);

  }

  res.cookie("user_id", set);

  res.redirect("/urls");

});


app.post("/urls/:id",(req, res)=> {

  let smallURL = (req.params.id);

  urlDatabase[(req.cookies["user_id"])][smallURL] = (req.body.updateURL);

  res.redirect("/urls");

});


app.post("/urls/:id/delete",(req, res)=> {

  let deleteURL = req.params.id;

  let url = `/urls/${deleteURL}/delete`;

console.log('thing', urlDatabase[req.cookies["user_id"]][req.params.id])



  delete urlDatabase[(req.cookies["user_id"])][deleteURL];
  res.redirect("/urls");



});


app.get("/urls/:id/delete",(req,res)=>{

console.log(req.cookies["user_id"]);
if(req.cookies["user_id"] === undefined){
  res.redirect("/login");
}
if (urlDatabase[req.cookies["user_id"]][req.params.id] === undefined){
  res.redirect("/login");
}else {

  res.redirect("/urls/:id/delete");
}


});








app.get("/urls/new", (req, res) => {

   let templateVars = {

      cookie: req.cookies["user_id"],

      user:users

     };
if (req.cookies["user_id"] === undefined){
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

  urlDatabase[(req.cookies["user_id"])][shortURL] = (req.body.longURL);


  res.redirect(url);

});


app.get("/", (req, res) => {

  res.end("Hello!");

});


app.get("/urls.json", (req, res) => {

  res.send(urlDatabase);

});


app.get("/hello", (req, res) => {

  res.end("<html><body>Hello <b>World</b></body></html>\n");

});


app.get("/urls", (req,res) => {


    let templateVars = {

      cookie: req.cookies["user_id"],

      urls: urlDatabase,

      user: users

     };

    res.render("urls_index", templateVars);

});


app.get("/urls/:id", (req, res) => {

  let templateVars = {

    cookie: req.cookies["user_id"],

    user: users,

    shortURL: req.params.id,

    urlDatabase: urlDatabase

   };

if(urlDatabase[req.cookies["user_id"]][req.params.id] === undefined){
  res.redirect("/login");
}else {
  res.render("urls_show", templateVars);
}
  });


app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});



/*I was not able to complete,
must clear cookies before using*/


