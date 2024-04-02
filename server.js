import { WebSocketServer } from 'ws';

const port = 1234;

// Créer un serveur WebSocket pour gérer le protocole WebSocket
const wss = new WebSocketServer({
  port: port
}, () => {
  console.log("Serveur WebSocket démarré à ws://localhost:" + port);
});

// Liste pour stocker les noms d'utilisateur connectés
const connectedUsers = new Set();
const listOfMessages = [];
// Fonction pour vérifier si un nom d'utilisateur existe
function userExists(username) {
  return connectedUsers.has(username);
}

wss.on('connection', function(client, request) {
  let wsname;

  // Récupérer le nom d'utilisateur dans les cookies
  const cookies = request.headers.cookie.split(';');
  wsname = cookies.find((c) => {
    return c.trim().startsWith('wsname=');
  });

  if (wsname) {
    wsname = wsname.split('=')[1].trim();
    console.log("Première connexion de", wsname);
    // Enregistrer le nom d'utilisateur dans la liste des utilisateurs connectés
    connectedUsers.add(wsname);

    // Envoyer la liste des messages aux nouveaux utilisateurs
    listOfMessages.forEach(function(message) {
      client.send(message);
    });

    // Saluer le nouvel utilisateur connecté avec un message
    //client.send('👋 Bienvenue, ' + decodeURIComponent(wsname) + ' !');
    //draw a square on the canvas when a new user connects
    //client.send('{"type":"square","x":100,"y":100,"size":50,"color":"red"}');
  } else {
    // Déconnecter le client si aucun nom d'utilisateur n'est trouvé
    console.log("Tentative de connexion sans nom d'utilisateur. Déconnexion...");
    client.close();
    return;
  }
//when client send canvas data
  client.on('message', function(message) {
    console.log("Message reçu de", wsname, ":", message.toString());
    // Transmettre le message à tous les utilisateurs connectés
    wss.clients.forEach(function(client) {
      if (client.readyState === 1) {
        client.send(message.toString());
        //ajouter les messages à la liste
        listOfMessages.push(message.toString());

      }
    });
  });


  // Gérer la fermeture de la connexion
  client.on('close', function() {
    console.log("Déconnexion de", wsname);
    // Supprimer l'utilisateur déconnecté de la liste des utilisateurs connectés
    connectedUsers.delete(wsname);
  });
});

process.on('SIGINT', function() {
  console.log("Serveur WebSocket arrêté.");
  process.exit(0);
});
