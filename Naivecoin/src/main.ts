import { Block, addBlock, generateNextBlock } from "./block";
import { blockchain } from "./blockchain";
import { initHttpServer } from "./server";
import { initP2PServer} from './p2p';

console.log("Initial blockchain is: ", blockchain, "\n");

// Create block 1
let newBlock: Block = generateNextBlock (
    blockchain,
    "block 1"
)
if (!addBlock(blockchain, newBlock)) {
    console.log("Error: Did not add in newBlock");
}
console.log("\nblockchain is: ", blockchain, "\n")

// Create block 2
// let newBlock2: Block = generateNextBlock (
//     blockchain,
//     "block 2"
// )
// if (!addBlock(blockchain, newBlock2)) {
//     console.log("Error: Did not add in newBlock2.");
// }
// console.log("\nblockchain is: ", blockchain, "\n")

initHttpServer(3004);
initP2PServer(3005);
