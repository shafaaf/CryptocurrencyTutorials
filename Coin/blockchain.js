const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }
    addBlock(data) {
        const lastBlock = this.chain[this.chain.length - 1];
        const block = Block.mineBlock(lastBlock, data);
        this.chain.push(block);
        return block;
    }
    isValidChain(chain) {
        // In JS, two diferent objects are not referencing the same original object
        // cannot be equal to each other even if have same exact elements.
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
        for(let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const previousBlock = chain[i - 1];
            if (currentBlock.lastHash !== previousBlock.hash) return false;
            if (currentBlock.hash !== Block.blockHash(currentBlock)) return false;
        }
        return true;
    }
    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain.');
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log('The received chain is not valid.');
            return;
        }
        console.log('Replacing blockchain with the new chain.');
        this.chain = newChain;
    }
}
module.exports = Blockchain;