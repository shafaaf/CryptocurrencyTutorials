import * as CryptoJS from "crypto-js";
import { isValidNewBlock } from "./blockValidity";
import { calculateBlockHash } from "./utils";

class Block {
    public index: number; // The height of the block in the blockchain
    public hash: string; // A sha256 hash taken from the content of the block
    public previousHash: string; // A reference to the hash of the previous block. This value explicitly defines the previous block.
    public timestamp: number;
    public data: string // Any data that is included in the block.

    constructor (
        index: number,
        hash: string,
        previousHash: string,
        timestamp: number,
        data: string

    ) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}

// Declare and make a genesis block
const genesisBlock: Block = new Block (
    0, // index
    '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', // hash
    null, // previous hash
    1465154705, // timestamp
    'my genesis block' // data
);

// TODO: Unsure about the null here
const getLatestBlock = (blockchain: Block[]): Block => {
    if(blockchain.length != 0) {
        return blockchain[blockchain.length - 1];
    }
    return null;
}

const addBlock = (blockchain: Block [], newBlock: Block): boolean => {
    if (isValidNewBlock(newBlock, getLatestBlock(blockchain))) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
}

// Create next block when have all data available
// TODO: Check how date is working
const generateNextBlock = (blockchain: Block[], blockData: string) => {
    const previousBlock: Block = getLatestBlock(blockchain);
    const index: number = previousBlock.index + 1;
    const previousHash: string  = previousBlock.hash;
    const timestamp: number = new Date().getTime() / 1000;
    const hash: string = calculateBlockHash (
                                    index,
                                    previousHash,
                                    timestamp,
                                    blockData
                                );
    const nextBlock: Block = new Block (
                                index,
                                hash,
                                previousHash,
                                timestamp,
                                blockData
                            );
    return nextBlock;
}

export {
    Block,
    genesisBlock,
    getLatestBlock,
    addBlock,
    generateNextBlock
};
