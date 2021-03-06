// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidV4 = require('uuid/v4');


const PORT = 5000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    // parse it and assign a UUID
    const incomingMessage = JSON.parse(message);
    incomingMessage.id = uuidV4();

    // Broadcast to all.
    const messageAsString = JSON.stringify(incomingMessage);
    wss.clients.forEach(function each(client) {
      client.send(messageAsString);
    });

  });


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});