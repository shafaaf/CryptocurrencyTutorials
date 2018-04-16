const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
    constructor (blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }
    listen() {
        // Start up server, connect to known list of peers,
        // and listen for incoming connections
        const server = new WebSocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeers();
        console.log(`Listening for P2P connections on ${P2P_PORT}`);
    }
    connectToPeers() {
        peers.forEach(peer => {
            // For example- ws://localhost:5001
            const socket = new WebSocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }
    connectSocket(socket) {
        // Called when I connect to peers and when peers connect to me
        // Add socket to list of sockets
        // Add in message handler to listen in for messages
        // Send blockchain
        this.sockets.push(socket);
        console.log("Socket connnected.");
        this.messageHandler(socket);
        this.sendChain(socket);
    }
    messageHandler(socket) { // when receiving messages
        socket.on('message', message => {
            const data = JSON.parse(message);
            this.blockchain.replaceChain(data);
        });
    }
    sendChain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));
    }
    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }
}

module.exports = P2pServer;
