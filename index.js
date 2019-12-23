const express = require('express');
const tmi = require("tmi.js");
const app = express();
const port = 3000;
const test = require("./database.js")
const fetch = require('node-fetch');
// import { test } from "./dbtest.js";

// Glitch expects a web server so we're starting express to take care of that.
// The page shows the same information as the readme and includes the remix button.
app.get("/", function (request, response) {
  response.send("It's working!?");
});

app.get("/database", function (request, response) {
  
  // db.query(getUsers, null, (err, results) => {
    //     if (err) {
      //         console.log('Error getting users from database');
      //     }
      //     console.log(results);
      // })  
  const getUsers = 'SELECT * FROM "Users"';
  test.query(getUsers, null, (err, results) => {
    if (err) {
        console.log('Error getting users from database');
        return response.status(500).send('Error getting user');
    }
    console.log(results);
    return response.status(200).send(results.rows);
})

})




// Setting options for our bot, disable debug output once your up and running.
let options = {
  identity: {
    username: "Innovation_Bot",
    password: "oauth:7shxj5o07b3j90nnwuey9aaim7lsec"
  },
    channels: ["konstantinnovation"]
};

// Set up our new TMI client and connect to the server.
let client =  new tmi.client(options);
client.connect();

// We have debug enabled now but if not we want some sort of confirmation
// we've connected to the server.
client.on('connected', (address, port) => {
  console.log(`Connected to ${address}:${port}`);
})

function getUsers() {
  fetch("https://swapi.co/api/people/1/")
  .then(response => response.text())
  .then(result => {
    console.log(result);
    client.action('konstantinnovation', `Found ${result}`);
  })
  .catch(error => console.log('error', error));
}

function checkDB() {
  const getUsers = 'SELECT * FROM "Users"';
  test.query(getUsers, null, (err, results) => {
    if (err) {
        console.log('Error getting users from database');
        return response.status(500).send('Error getting user');
    }
    console.log(results);
    client.action('konstantinnovation', results.rows);
  });
}


// Bot is listening for messages
client.on('message', (channel, user, message, self) => {
  switch(message) {
    case '!test': 
      client.action('konstantinnovation', `Replying to ${user['display-name']}`);
      break;
    case '!users':
      getUsers();
      break;
    case '!dbTest':
      checkDB();
      break;
    default:
      break;
  }
})

let listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});