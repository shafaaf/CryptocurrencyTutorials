import { Block, genesisBlock, getLatestBlock, addBlock, generateNextBlock } from "./block";
import { blockchain } from "./blockchain";
import { isValidChain } from "./blockValidity";
import { initHttpServer } from "./server";

console.log("Initial blockchain is: ", blockchain, "\n");

let newBlock: Block = generateNextBlock (
    blockchain,
    "block 2"
)

if (!addBlock(blockchain, newBlock)) {
    console.log("Error: Did not add in new block.");
}
console.log("blockchain is: ", blockchain, "\n")

isValidChain(blockchain);
blockchain.push(genesisBlock); //invalid block
isValidChain(blockchain);

console.log("\n");
// initHttpServer(3001);
