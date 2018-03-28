import { Block, genesisBlock } from "./block";
import { calculateBlockHash } from "./utils";

/*
    Validate the structure of the block, so that
    malformed content sent by a peer won’t crash our node.
*/
const isValidBlockStructure = (block: Block): boolean => {
    return (
        typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string'
     );
};

/*
    For a block to be valid the following must apply:
    - Block has to have proper structure
    - The index of the block must be one number larger than the previous block
    - The previousHash of the block match the hash of the previous block
    - The hash of the block itself must be valid
*/
const isValidNewBlock = (newBlock: Block, previousBlock: Block): boolean => {
    if (!isValidBlockStructure(newBlock)) {
        console.log('Invalid block structure: %s', JSON.stringify(newBlock));
        return false;
    }
    const newBlockCalculatedHash: string =
        calculateBlockHash (
            newBlock.index,
            newBlock.previousHash,
            newBlock.timestamp,
            newBlock.data
        );
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('isValidNewBlock Error: Invalid index.');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('isValidNewBlock Error: Invalid previoushash.');
        return false;
    } else if (newBlock.hash !== newBlockCalculatedHash) {
        console.log('isValidNewBlock Error: Hash for new block not equal to calculated hash.');
        return false;
    }
    return true;
};

/*
    Validate that the genesis block is ok.
*/
const isValidGenesis = (block: Block): boolean => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
};

/*
    Validate a full chain of blocks.
    - Check that the first block in the chain matches with the genesisBlock.
    - Validate every consecutive block using the previous methods.
*/
const isValidChain = (blockchainToValidate: Block[]): boolean => {
    if (!isValidGenesis(blockchainToValidate[0])) {
        console.log("isValidChain: Genesis block not valid.");
        return false;
    }

    // Validate every other block except genesis block
    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (!isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            console.log("isValidChain: Blockchain not valid.");
            return false;
        }
    }
    console.log("isValidChain: Blockchain is valid.");
    return true;
};

export { isValidBlockStructure, isValidNewBlock, isValidChain};
