const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let bookList = []
    for (const [key, value] of Object.entries(books)) {
        if (value["author"] == author){
            bookList.push(books[key]);
        }
    };
    if (bookList.length > 0){
        return res.send(bookList);
    }
    else {
        return res.status(404).json({message: "Author not found!"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let bookList = []
    for (const [key, value] of Object.entries(books)) {
        if (value["title"] == title){
            bookList.push(books[key]);
        }
    };
    if (bookList.length > 0){
        return res.send(bookList);
    }
    else {
        return res.status(404).json({message: "Title not found!"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"]);
});


function getAllBooks() {
  const url = `http://localhost:5001/`;

  return axios.get(url, {
    withCredentials: true
  })
  .then(response => {
    return response.data;
  }
  )
  .catch(error => {
    return error;
  });
}


function getBookDetailsByISBN(isbn) {
  const url = `http://localhost:5001/isbn/${isbn}`;

    return axios.get(url, {
    withCredentials: true
  })
  .then(response => {
    return response.data;
  }
  )
  .catch(error => {
    return error;
  });
}


function getBookDetailsByAuthor(author) {
  const url = `http://localhost:5001/author/${author}`;

  return axios.get(url, {
    withCredentials: true
  })
  .then(response => {
    return response.data;
  }
  )
  .catch(error => {
    return error;
  });
}


async function getBookByTitle(title){
  try{
    const response = await axios.get(`http://localhost:5001/title/${title}`);
    return response.data;
  }
  catch(err)
  {
    return err
  }
}

module.exports.general = public_users;
