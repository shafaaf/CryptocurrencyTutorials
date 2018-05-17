const ChainUtil = require('../chainUtil');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex'); // public addresss of the wallet
    }
    toString() { // TODO: toString for public key print
        return ` Wallet -
            balance  : ${this.balance}™
            publickey:
            ${this.publicKey}`
    }
    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }
}

module.exports = Wallet;
