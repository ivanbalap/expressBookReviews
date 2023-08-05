const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// books=null;
let getAllBooks = ()=>{
  return new Promise( (res, rej) =>{
    if (books){
      res(books)
    } else{
      rej({"return message":"some thing went wrong"})
    }
  });
}

let getBooksByISBN = (isbn)=>{
  return new Promise( (res, rej) =>{
    if (books[isbn]){
      res(books[isbn])
    } else{
      rej({"return message":`The isbn: ${isbn} not found`})
    }
  });
}

let getBooksByAuthor = (author)=>{
  return new Promise( (res, rej) =>{
    let by_author_books = {}
    for (const key of Object.keys(books)) { 
      if (books[key]["author"]===author) {
        by_author_books[key]=books[key]
      }
    };
    if (Object.keys(by_author_books).length){
      res(by_author_books)
    } else{
      rej({"return message":`The author: ${author} not found`})
    }
  });
}

let getBooksByTitle = (title)=>{
  return new Promise( (res, rej) =>{
    let by_title_books = {}
    for (const key of Object.keys(books)) { 
      if (books[key]["title"]===title) {
        by_title_books[key]=books[key]
      }
    };
    if (Object.keys(by_title_books).length){
      res(by_title_books)
    } else{
      rej({"return message":`The title: ${title} not found`})
    }
  });
}

public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."+username+password});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  // res.send(JSON.stringify(books,null,4));
  getAllBooks()
  .then((data) => {res.send(JSON.stringify(data,null,4));})
  .catch((err) => {res.send(JSON.stringify(err,null,4));})
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const isbn=req.params.isbn;
  // res.send(books[isbn])
  getBooksByISBN(isbn)
  .then((data) => {res.send(JSON.stringify(data,null,4));})
  .catch((err) => {res.send(JSON.stringify(err,null,4));})
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  let author = req.params.author
  // let by_author_books = {}
  // for (const key of Object.keys(books)) { 
  //   // console.log(key + ": "); 
  //   // console.log(books[key]);
  //   if (books[key]["author"]===author) {
  //     by_author_books[key]=books[key]
  //   }
  // };
  // res.send(JSON.stringify(by_author_books,null,4));
  getBooksByAuthor(author)
  .then((data) => {res.send(JSON.stringify(data,null,4));})
  .catch((err) => {res.send(JSON.stringify(err,null,4));})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  let title = req.params.title
  // let by_title_books = {}
  // for (const key of Object.keys(books)) { 
  //   // console.log(key + ": "); 
  //   // console.log(books[key]);
  //   if (books[key]["title"]===title) {
  //     by_title_books[key]=books[key]
  //   }
  // };
  // res.send(JSON.stringify(by_title_books,null,4));
  getBooksByTitle(title)
  .then((data) => {res.send(JSON.stringify(data,null,4));})
  .catch((err) => {res.send(JSON.stringify(err,null,4));})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const isbn=req.params.isbn;
  // res.send(books[isbn]["reviews"])
  res.send(JSON.stringify(books[isbn]["reviews"],null,4));
});

module.exports.general = public_users;
