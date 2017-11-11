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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


app.post("/register",(req,res)=>{

let test = [];

for(const eachID in users){
test.push(users[eachID].email);
}


  let testlen = (test.length)
  let newid = generateRandomString();
  users[newid] = {};
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

  //res.cookie("user_id",newid);
  res.redirect("/urls");
}


});



app.get("/register", (req, res) => {
  res.render("user_register");
  //console.log(req.body.longURL);

});


app.post("/logout",(req,res)=>{

res.clearCookie("user_id");
res.redirect("/urls");
});

app.get("/login", (req, res) => {
  res.render("user_newlog");
  //console.log(req.body.longURL);

});



app.post("/login",(req,res)=>{
var set = 0;
for(const checkId in users) {

  if(users[checkId].email === req.body.email)
  {

    for(const checkpass in users)
    {
    if(users[checkpass].password === req.body.password)
    {
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
      cookie: req.cookies["user_id"],
      //username: req.cookies["username"]
        user:users
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
  res.json(users);
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
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


