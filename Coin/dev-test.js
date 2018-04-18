const Block = require('./blockchain/block');
const Blockchain = require('./blockchain');

const Wallet = require('./wallet');

const difficultyTest = 0;
const walletTest = 1;

if (difficultyTest) {
    const bc = new Blockchain();
    for (i = 0; i < 10; i++) {
        console.log(bc.addBlock(`foo: ${i}`).toString());
    }
}

if (walletTest) {
    const wallet = new Wallet();
    console.log(wallet.toString());
}
