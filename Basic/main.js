const SHA256 = require("crypto-js/sha256");

class Block {
    constructor (
        index,  // Where block sits on the chain (Chain is an an array)
        timestamp, // When the block was created
        data, // details of transactions (amount, sender, receiver)
        previousHash ='' // hash of block before this one
    ) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        // hash of block - identifier of block on blockchain
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256 (
            this.index +
            this.timestamp +
            JSON.stringify(this.data) +
            this.previousHash +
            this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !=
                Array(difficulty + 1).join("0")) {  // see if enough 0s

            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("nonce is: " + this.nonce);
        console.log("Block mined: " + this.hash + "\n");
    }
}

class BlockChain {
    constructor () {
        this.difficulty = 4;    // decides how hard to solve a block
        this.chain = [this.createGenesisBlock()];   // array of blocks
    }
    createGenesisBlock() {
        return new Block (
            0,
            "01/01/2017",
            "Genesis block",
            "0"
        );
    }
    getLatestBlock() {
        return this.chain[this.chain.length-1];
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid() {
        for (let i= 1; i<this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if (currentBlock.hash != currentBlock.calculateHash()) {
                console.log("Error at block: ", i);
                return false;
            }
            if (currentBlock.previousHash != previousBlock.hash) {
                console.log("Error at block: ", i);
                return false;
            }
        }
        return true;
    }
}

let shafaafCoin = new BlockChain();
console.log("Mining block 1...");
shafaafCoin.addBlock (
    new Block ( 1, "1/10/2017", { amount: 4 })
);

console.log("Mining block 2...");
shafaafCoin.addBlock (
    new Block ( 2, "1/11/2017", { amount: 10 })
);

console.log("shafaafCoin is: ", shafaafCoin);
// console.log(JSON.stringify(shafaafCoin, null, 4));

// Integrity checks
// Blockchain can only add blocks but not ever modify/delete them
console.log("Is blockchain valid? " + shafaafCoin.isChainValid() + "\n");

// Prev block points to wrong has so returns error
shafaafCoin.chain[1].data = { amount: 4500 };
shafaafCoin.chain[1].hash = shafaafCoin.chain[1].calculateHash();
console.log("Is blockchain valid? " + shafaafCoin.isChainValid());

/*
    Proof of work also called mining. People could spam blocks or
    change a block and recalculate corresponding hashes of ALL the blocks
    to modify the blockchain and make a valid chain even though tampered with.
    So proof of work proves someone put in lots of computig power to make a block.
    In Bitcoin, each hash of a block needs to have a certain number of zeroes.
    So lots of guesses needed - computation power
    Difficulty increased as needed
*/

