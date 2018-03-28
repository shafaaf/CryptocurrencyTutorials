import * as WebSocket from 'ws';
import {Server} from 'ws';

import {
    Block,
    addBlock,
    getLatestBlock
} from './block';

import { getBlockchain, replaceChain } from './blockchain';
import { isValidBlockStructure } from './blockValidity';

// list of peer sockets
const sockets: WebSocket[] = [];
const getSockets = () => sockets;

enum MessageType {
    QUERY_LATEST = 0,
    QUERY_ALL = 1,
    RESPONSE_BLOCKCHAIN = 2
}

class Message {
    public type: MessageType;
    public data: any;
}

const JSONToObject = <T>(data: string): T => {
    try {
        return JSON.parse(data);
    } catch (e) {
        console.log(e);
        return null;
    }
};

const initP2PServer = (p2pPort: number) => {
    //console.log("getBlockchain is: ", getBlockchain());
    const server: Server = new WebSocket.Server({port: p2pPort});
    server.on('connection', (ws: WebSocket) => {
        console.log('Got a connection.');
        initConnection(ws);
    });
    console.log('listening websocket p2p port on: ' + p2pPort);
};

const initConnection = (ws: WebSocket) => {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMsg()); // Query the new connected user to get their latest block
};

const initMessageHandler = (ws: WebSocket) => { // Setup such that can receive different types of messages from new connected user
    ws.on('message', (data: string) => {
        console.log('\nReceived raw message: ', data);
        const message: Message = JSONToObject<Message>(data); // Converts to object of type Message
        if (message === null) {
            console.log('Could not parse received JSON message: ' + data);
            return;
        }
        //console.log('Received JSONToObject message: ', message);
        switch (message.type) {
            case MessageType.QUERY_LATEST:
                console.log('Received QUERY_LATEST request and so send back current latest block.');
                write(ws, responseLatestMsg());
                break;
            case MessageType.QUERY_ALL:
                console.log('Received QUERY_ALL request and so send back current blockchain.');
                write(ws, responseChainMsg());
                break;
            case MessageType.RESPONSE_BLOCKCHAIN: // handles case of both receiving latest block, and blockchain
                console.log('Received RESPONSE_BLOCKCHAIN response and update current blockchain if needed.');
                const receivedBlocks: Block[] = JSONToObject<Block[]>(message.data);
                console.log('receivedBlocks is: ', receivedBlocks);
                if (receivedBlocks === null) {
                    console.log('Invalid blocks received: ');
                    console.log(message.data)
                    break;
                }
                handleBlockchainResponse(receivedBlocks);
                break;
            default:
                console.log("Invalid request");
                break;
        }
    });
};

// Write stringified message on to websocket
const write = (ws: WebSocket, message: Message): void => ws.send(JSON.stringify(message));
// Write stringified message on to all websockets
const broadcast = (message: Message): void => sockets.forEach((socket) => write(socket, message));

/* Message construction */
// Get latest block request from another peer. TODO: Should be called queryChainLatest?
const queryChainLengthMsg = (): Message => ({'type': MessageType.QUERY_LATEST, 'data': null});
// Get blockchain request from another peer
const queryAllMsg = (): Message => ({'type': MessageType.QUERY_ALL, 'data': null});
// Send blochain to another peer
const responseChainMsg = (): Message => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(getBlockchain())
});
// Create message with latest block
const responseLatestMsg = (): Message => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify([getLatestBlock(getBlockchain())])
});

const initErrorHandler = (ws: WebSocket) => {
    const closeConnection = (myWs: WebSocket) => {
        console.log('connection failed to peer: ' + myWs.url);
        sockets.splice(sockets.indexOf(myWs), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
};

// Note: easier to check last block validity first to invalidate if needed
// 1 function to handle both latest block, full blockchain replacement
const handleBlockchainResponse = (receivedBlocks: Block[]) => {
    console.log("handleBlockchainResponse.");
    if (receivedBlocks.length === 0) {
        console.log('received block chain size of 0');
        return;
    }
    const latestBlockReceived: Block = receivedBlocks[receivedBlocks.length - 1];
    if (!isValidBlockStructure(latestBlockReceived)) {
        console.log('block structuture not valid');
        return;
    }
    const latestBlockHeld: Block = getLatestBlock(getBlockchain());
    if (latestBlockReceived.index > latestBlockHeld.index) { // Looking at last block, seems coule be new block/chain
        console.log('handleBlockchainResponse: current local blockchain possibly behind. We got index: '
            + latestBlockHeld.index + '. Peer got index: ' + latestBlockReceived.index);
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) { // Verify if just the next block of current blockchain
            if (addBlock(getBlockchain(), latestBlockReceived)) { // Checks validity of block in function
                broadcast(responseLatestMsg());
            }
        } else if (receivedBlocks.length === 1) { // Not next block and index greater so need whole blockchain. Make new request.
            console.log('We have to query the chain from our peer');
            broadcast(queryAllMsg());
        } else { // peer gave us chain and not next block
            console.log('Received blockchain is longer than current blockchain looking at only index so replacing if valid...');
            replaceChain(getBlockchain(), receivedBlocks); // replace chain does chain validity check
            console.log("blockchain is now: ", getBlockchain());
        }
    } else {
        console.log('handleBlockchainResponse: Received blockchain is not longer than received blockchain. Do nothing');
    }
};

const broadcastLatest = (): void => {
    broadcast(responseLatestMsg());
};

const connectToPeers = (newPeer: string): void => {
    const ws: WebSocket = new WebSocket(newPeer);
    ws.on('open', () => {
        initConnection(ws);
    });
    ws.on('error', () => {
        console.log('connection failed');
    });
};

export {connectToPeers, broadcastLatest, initP2PServer, getSockets};
