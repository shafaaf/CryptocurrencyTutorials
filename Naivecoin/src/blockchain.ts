// Data structure to hold the blockchain
import { Block, genesisBlock } from "./block";
import { isValidChain } from "./blockValidity";

const replaceChain = (currentBlockchain: Block[], newBlocks: Block[]): boolean => {
    if ((isValidChain(newBlocks)) && (newBlocks.length > currentBlockchain.length)) {
        console.log('replaceChain: Replacing current blockchain with received blockchain');
        currentBlockchain = newBlocks;
        // broadcastLatest(); // TODO
        return true;
    } else {
        console.log('Received blockchain invalid so not replacing current local chain.');
        return false;
    }
};

const blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

export { replaceChain, blockchain, getBlockchain };
