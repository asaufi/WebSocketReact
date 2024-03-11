import { WebSocketServer } from 'ws';

const   port = 1234;

// create a WebSocket Server to deal with the WebSocket protocol
const wss = new WebSocketServer({
  port: port
},() => {
  console.log("WebSocket server started at ws://localhost:" + port);
});

// create a function to be able do broadcast messages to all WebSocket connected clients
wss.broadcast = function broadcast(message) {
  wss.clients.forEach(function each(client) {
    client.send(message);
  });
};

// Register a listener for new connections on the WebSocket.
wss.on('connection', function(client, request) {

  // retrieve the client name in the cookies
  const cookies = request.headers.cookie.split(';');
  let wsname = cookies.find((c) => {
    return c.match(/^\s*wsname/) !== null;
  });
  wsname = wsname.split('=')[1];
  
  console.log("First connexion from", wsname);
  
  // greet the newly connected user with a String message
  client.send(' 👋 Welcome, ' + decodeURIComponent(wsname) + '!' );

  // Register a listener on each message of each connection
  client.on('message', function(message) {

    const cli = '[' + decodeURIComponent(wsname) + '] ';
    console.log("Message from", cli);
    // when receiving a message, broadcast it to all the connected clients
    wss.broadcast(cli + message);
  });
});


process.on('SIGINT', function() {
  console.log("WebSocket server stopped.");
  process.exit(0);
});