const Block = require('./blockchain/block');
const Blockchain = require('./blockchain');

const bc = new Blockchain();
for (i = 0; i < 10; i++) {
    console.log(bc.addBlock(`foo: ${i}`).toString());
}
