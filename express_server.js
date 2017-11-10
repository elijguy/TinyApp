

var express = require("express");
var app = express();


var cookieParser = require('cookie-parser');



var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");


app.use(cookieParser());




app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};
app.post("/logout",(req,res)=>{
res.clearCookie("username");
res.redirect("/urls");
});

app.post("/login",(req,res)=>{
res.cookie("username",req.body.username);
res.redirect("/urls");
});


app.post("/urls/:id",(req, res)=> {
  let smallURL = (req.params.id);
  urlDatabase[smallURL]= (req.body.updateURL);
  res.redirect("/urls");
});





app.post("/urls/:id/delete",(req, res)=> {
  let deleteURL = req.params.id;
  let url = `/urls/${deleteURL}/delete`;
  delete urlDatabase[deleteURL];
  res.redirect("/urls");
});


app.get("/urls/new", (req, res) => {
   let templateVars = {
      username: req.cookies["username"]
     };

  res.render("urls_new",templateVars);
  //console.log(req.body.longURL);

});

app.get("/u/:shortURL", (req, res) => {
  //console.log(req.body.longURL);
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(301,longURL);
});


app.post("/urls", (req, res) => {
  //console.log(req.body);  // debug statement to see POST parameters
  let shortURL = generateRandomString();
  let url = `/urls/${shortURL}`;
  urlDatabase[shortURL] = (req.body.longURL);
  res.redirect(url);

});

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req,res) => {
    let templateVars = {
      urls: urlDatabase,
      username: req.cookies["username"]
     };
    res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    shortURL: req.params.id,
    urlDatabase: urlDatabase
   };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
    var result = '';
    for (var i = 6; i > 0; --i) result += ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')[Math.floor(Math.random() * ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').length)];
    return(result);
}

