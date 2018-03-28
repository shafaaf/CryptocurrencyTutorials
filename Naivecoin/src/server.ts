import * as  bodyParser from 'body-parser';
import * as express from 'express';
import { Block, generateNextBlock } from "./block";
import { getBlockchain } from "./blockchain";

const app = express();
app.use(bodyParser.json());

const httpPort = parseInt(process.env.HTTP_PORT) || 3001;
//const p2pPort: number = parseInt(process.env.P2P_PORT) || 6001;

const initHttpServer = ( myHttpPort: number ) => {

    // Send back current blockchain
    app.get('/blocks', (req, res) => {
        res.send(getBlockchain());
    });

    // Mine for a block with a content given by the user
    // TODO
    app.post('/mineBlock', (req, res) => {
        const newBlock: Block = generateNextBlock (
            getBlockchain(),
            req.body.data
        );
        res.send(newBlock);
    });

    // Send back peer list
    // app.get('/peers', (req, res) => {
    //     res.send(getSockets().map(( s: any ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    // });

    // Add a peer
    // app.post('/addPeer', (req, res) => {
    //     connectToPeers(req.body.peer);
    //     res.send();
    // });

    app.listen(myHttpPort, () => {
        console.log('Listening for http requests on port: ' + myHttpPort + "...");
    });
};

// initHttpServer(httpPort);
// initP2PServer(p2pPort);

export { initHttpServer };
